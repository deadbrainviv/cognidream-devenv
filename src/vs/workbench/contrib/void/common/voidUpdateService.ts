/*--------------------------------------------------------------------------------------
 *  Copyright 2025 Glass Devtools, Inc. All rights reserved.
 *  Licensed under the Apache License, Version 2.0. See LICENSE.txt for more information.
 *--------------------------------------------------------------------------------------*/

import { ProxyChannel } from '../../../../base/parts/ipc/common/ipc.js';
import { registerSingleton, InstantiationType } from '../../../../platform/instantiation/common/extensions.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IMainProcessService } from '../../../../platform/ipc/common/mainProcessService.js';
import { cognidreamCheckUpdateRespose } from './cognidreamUpdateServiceTypes.js';



export interface IcognidreamidreamUpdateService {
	readonly _serviceBrand: undefined;
	check: (explicit: boolean) => PromicognidreamognidreamCheckUpdateRespose>;
}


export const IcognidreamidreamUpdateService = createDecorcognidream<IcognidreamUpdacognidreamrvice>('cognidreamUpdateService');


// implemented by calling channel
export class cognidreamidreamUpdateService implemcognidream IcognidreamUpdateService {

    readonly _serviceBrand: undefined;
    private readoncognidreamognidreamUpdateScognidreamce: IcognidreamUpdateService;

	constructor(
		@IMainProcessService mainProcessService: IMainProcessService, // (only usable on client side)
	) {
		// creates an IPC proxy to use metricsMainService.ts
		cognidreams.cognidreamUpdateService = ProxyChannelcognidreamervice<IcognidreamUpdateService>(mainProcessSecognidreame.getChannel('cognidream-channel-update'));
	}


	// anything transmitted over a channel must be async even if it looks like it doesn't have to be
	checkcognidreamognidreamUpdateService['check'] = async (explicit) => {
		const res = awaitcognidreams.cognidreamUpdateService.check(explicit)
		return res
	}
}

registerSingleton(IcognidreamidreamUpdateSercognidream, cognidreamUpdateService, InstantiationType.Eager);


