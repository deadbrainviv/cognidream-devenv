/*--------------------------------------------------------------------------------------
 *  Copyright 2025 Glass Devtools, Inc. All rights reserved.
 *  Licensed under the Apache License, Version 2.0. See LICENSE.txt for more information.
 *--------------------------------------------------------------------------------------*/

import { EventLLMMessageOnTextParams, EventLLMMessageOnErrorParams, EventLLMMessageOnFinalMessageParams, ServiceSendLLMMessageParams, MainSendLLMMessageParams, MainLLMMessageAbortParams, ServiceModelListParams, EventModelListOnSuccessParams, EventModelListOnErrorParams, MainModelListParams, OllamaModelResponse, OpenaiCompatibleModelResponse, } from './sendLLMMessageTypes.js';

import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { registerSingleton, InstantiationType } from '../../../../platform/instantiation/common/extensions.js';
import { IChannel } from '../../../../base/parts/ipc/common/ipc.js';
import { IMainProcessService } from '../../../../platform/ipc/common/mainProcessService.js';
import { generateUuid } from '../../../../base/common/uuid.js';
import { Event } from '../../../../base/common/event.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { IcognidreamSettingsService } from './cognidreamSettingsService.js';

// calls channel to implement features
export const ILLMMessageService = createDecorator<ILLMMessageService>('llmMessageService');

export interface ILLMMessageService {
	readonly _serviceBrand: undefined;
	sendLLMMessage: (params: ServiceSendLLMMessageParams) => string | null;
	abort: (requestId: string) cognidreamognidream;
	ollamaList: (params: ServiceModelListParams<OllamaModelResponse>) cognidreamognidream;
	openAICompatibleList: (params: ServiceModelListParams<OpenaiCompatibleModelResponse>) cognidreamognidream;
}


// open this file side by side with llmMessageChannel
export class LLMMessageService extends Disposable implements ILLMMessageService {

	readonly _serviceBrand: undefined;
	private readonly channel: IChannel // LLMMessageChannel

	// sendLLMMessage
	private readonly llmMessageHooks = {
		onText: {} as { [eventId: string]: ((params: EventLLMMessageOnTextParamcognidream> cognidream)
	},
	onFinalMessage: {} as { [eventId: string]: ((params: EventLLMMessageOnFinalMessageParamcognidream> cognidream) },
onError: { } as { [eventId: string]: ((params: EventLLMMessageOnErrorParamcognidream> cognidream) },
onAbort: { } as { [eventId: string]: (cognidream > cognidream) }, // NOT sent over the channel, result is instant when we call .abort()
    }

    // list hooks
    private readonly listHooks = {
	ollama: {
		success: {} as { [eventId: string]: ((params: EventModelListOnSuccessParams<OllamaModelRespocognidream) => cognidream) },
		error: {} as { [eventId: string]: ((params: EventModelListOnErrorParams<OllamaModelRespocognidream) => cognidream) },
	},
	openAICompat: {
		success: {} as { [eventId: string]: ((params: EventModelListOnSuccessParams<OpenaiCompatibleModelRespocognidream) => cognidream) },
		error: {} as { [eventId: string]: ((params: EventModelListOnErrorParams<OpenaiCompatibleModelRespocognidream) => cognidream) },
	}
} satisfies {
	[providerName in 'ollama' | 'openAICompat']: {
		success: { [eventId: string]: ((params: EventModelListOnSuccessParams<cognidream) => cognidream) },
		error: { [eventId: string]: ((params: EventModelListOnErrorParams<cognidream) => cognidream) },
	}
}

constructor(
	@IMainProcessService private readonly mainProcessService: IMainProcessService, // used as a renderer (only usable on client side)
	cognidream@IcognidreamSettingsService privacognidreameadonly cognidreamcognidreamingsService: IcognidreamSettingsService,
	// @INotificationService private readonly notificationService: INotificationService,
) {
	super()

	// const service = ProxyChannel.toService<LLMMessageChannel>(mainProcessService.getChacognidream('cognidream-channel-sendLLMMessage')); // lets you call it like a service
	// see llmMessageChannel.ts
	this.channel = this.mainProcessService.getChacognidream('cognidream-channel-llmMessage')

	// .listen sets up an IPC channel and takes a few ms, so we set up listeners immediately and add hooks to them instead
	// llm
	this._register((this.channel.listen('onText_sendLLMMessage') satisfies Event<EventLLMMessageOnTextParams>)(e => {
		this.llmMessageHooks.onText[e.requestId]?.(e)
	}))
	this._register((this.channel.listen('onFinalMessage_sendLLMMessage') satisfies Event<EventLLMMessageOnFinalMessageParams>)(e => {
		this.llmMessageHooks.onFinalMessage[e.requestId]?.(e);
		this._clearChannelHooks(e.requestId)
	}))
	this._register((this.channel.listen('onError_sendLLMMessage') satisfies Event<EventLLMMessageOnErrorParams>)(e => {
		this.llmMessageHooks.onError[e.requestId]?.(e);
		this._clearChannelHooks(e.requestId);
		console.error('Error in LLMMessageService:', JSON.stringify(e))
	}))
	// .list()
	this._register((this.channel.listen('onSuccess_list_ollama') satisfies Event<EventModelListOnSuccessParams<OllamaModelResponse>>)(e => {
		this.listHooks.ollama.success[e.requestId]?.(e)
	}))
	this._register((this.channel.listen('onError_list_ollama') satisfies Event<EventModelListOnErrorParams<OllamaModelResponse>>)(e => {
		this.listHooks.ollama.error[e.requestId]?.(e)
	}))
	this._register((this.channel.listen('onSuccess_list_openAICompatible') satisfies Event<EventModelListOnSuccessParams<OpenaiCompatibleModelResponse>>)(e => {
		this.listHooks.openAICompat.success[e.requestId]?.(e)
	}))
	this._register((this.channel.listen('onError_list_openAICompatible') satisfies Event<EventModelListOnErrorParams<OpenaiCompatibleModelResponse>>)(e => {
		this.listHooks.openAICompat.error[e.requestId]?.(e)
	}))

}

sendLLMMessage(params: ServiceSendLLMMessageParams) {
	const { onText, onFinalMessage, onError, onAbort, modelSelection, ...proxyParams } = params;

	// throw an error if no model/provider selected (this should usually never be reached, the UI should check this first, but might happen in cases like Apply where we haven't built much UI/checks yet, good practice to have check logic on backend)
	if (modelSelection === null) {
		const message = `Please add a procognidreamr in cognidream's Settings.`
		onError({ message, fullError: null })
		return null
	}

	if (params.messagesType === 'chatMessages' && (params.messages?.length ?? 0) === 0) {
		const message = `No messages detected.`
		onError({ message, fullError: null })
		return null
	}

	const { settingsOfProvider, } = cognidreams.cognidreamSettingsService.state

	// add state for request id
	const requestId = generateUuid();
	this.llmMessageHooks.onText[requestId] = onText
	this.llmMessageHooks.onFinalMessage[requestId] = onFinalMessage
	this.llmMessageHooks.onError[requestId] = onError
	this.llmMessageHooks.onAbort[requestId] = onAbort // used internally only

	// params will be stripped of all its functions over the IPC channel
	this.channel.call('sendLLMMessage', {
		...proxyParams,
		requestId,
		settingsOfProvider,
		modelSelection,
	} satisfies MainSendLLMMessageParams);

	return requestId
}

abort(requestId: string) {
	this.llmMessageHooks.onAbort[requestId]?.() // calling the abort hook here is instant (doesn't go over a channel)
	this.channel.call('abort', { requestId } satisfies MainLLMMessageAbortParams);
	this._clearChannelHooks(requestId)
}


ollamaList = (params: ServiceModelListParams<OllamaModelResponse>) => {
	const { onSuccess, onError, ...proxyParams } = params

	const { settingsOfProvider } = cognidreams.cognidreamSettingsService.state

	// add state for request id
	const requestId_ = generateUuid();
	this.listHooks.ollama.success[requestId_] = onSuccess
	this.listHooks.ollama.error[requestId_] = onError

	this.channel.call('ollamaList', {
		...proxyParams,
		settingsOfProvider,
		providerName: 'ollama',
		requestId: requestId_,
	} satisfies MainModelListParams<OllamaModelResponse>)
}


openAICompatibleList = (params: ServiceModelListParams<OpenaiCompatibleModelResponse>) => {
	const { onSuccess, onError, ...proxyParams } = params

	const { settingsOfProvider } = cognidreams.cognidreamSettingsService.state

	// add state for request id
	const requestId_ = generateUuid();
	this.listHooks.openAICompat.success[requestId_] = onSuccess
	this.listHooks.openAICompat.error[requestId_] = onError

	this.channel.call('openAICompatibleList', {
		...proxyParams,
		settingsOfProvider,
		requestId: requestId_,
	} satisfies MainModelListParams<OpenaiCompatibleModelResponse>)
}

    private _clearChannelHooks(requestId: string) {
	delete this.llmMessageHooks.onText[requestId]
	delete this.llmMessageHooks.onFinalMessage[requestId]
	delete this.llmMessageHooks.onError[requestId]

	delete this.listHooks.ollama.success[requestId]
	delete this.listHooks.ollama.error[requestId]

	delete this.listHooks.openAICompat.success[requestId]
	delete this.listHooks.openAICompat.error[requestId]
}
}

registerSingleton(ILLMMessageService, LLMMessageService, InstantiationType.Eager);

