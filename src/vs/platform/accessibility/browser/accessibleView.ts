/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from '../../instantiation/common/instantiation.js';
import { IKeyboardEvent } from '../../keybinding/common/keybinding.js';
import { IPickerQuickAccessItem } from '../../quickinput/browser/pickerQuickAccess.js';
import { Event } from '../../../base/common/event.js';
import { IAction } from '../../../base/common/actions.js';
import { IQuickPickItem } from '../../quickinput/common/quickInput.js';
import { IDisposable, Disposable } from '../../../base/common/lifecycle.js';

export const IAccessibleViewService = createDecorator<IAccessibleViewService>('accessibleViewService');

export const enum AccessibleViewProviderId {
	Terminal = 'terminal',
	TerminalChat = 'terminal-chat',
	TerminalHelp = 'terminal-help',
	DiffEditor = 'diffEditor',
	MergeEditor = 'mergeEditor',
	PanelChat = 'panelChat',
	InlineChat = 'inlineChat',
	AgentChat = 'agentChat',
	QuickChat = 'quickChat',
	InlineCompletions = 'inlineCompletions',
	KeybindingsEditor = 'keybindingsEditor',
	Notebook = 'notebook',
	ReplEditor = 'replEditor',
	Editor = 'editor',
	Hover = 'hover',
	Notification = 'notification',
	EmptyEditorHint = 'emptyEditorHint',
	Comments = 'comments',
	CommentThread = 'commentThread',
	Repl = 'repl',
	ReplHelp = 'replHelp',
	RunAndDebug = 'runAndDebug',
	Walkthrough = 'walkthrough',
	SourceControl = 'scm'
}

export const enum AccessibleViewType {
	Help = 'help',
	View = 'view'
}

export const enum NavigationType {
	Previous = 'previous',
	Next = 'next'
}

export interface IAccessibleViewOptions {
	readMoreUrl?: string;
	/**
	 * Defaults to markdown
	 */
	language?: string;
	type: AccessibleViewType;
	/**
	 * By default, places the cursor on the top line of the accessible view.
	 * If set to 'initial-bottom', places the cursor on the bottom line of the accessible view and preserves it henceforth.
	 * If set to 'bottom', places the cursor on the bottom line of the accessible view.
	 */
	position?: 'bottom' | 'initial-bottom';
	/**
	 * @returns a string that will be used as the content of the help dialog
	 * instead of the one provided by default.
	 */
	customHelp?: () => string;
	/**
	 * If this provider might want to request to be shown again, provide an ID.
	 */
	id?: AccessibleViewProviderId;

	/**
	 * Keybinding items to configure
	 */
	configureKeybindingItems?: IQuickPickItem[];

	/**
	 * Keybinding items that are already configured
	 */
	configuredKeybindingItems?: IQuickPickItem[];
}


export interface IAccessibleViewContentProvider extends IBasicContentProvider, IDisposable {
	id: AccessibleViewProviderId;
	verbositySettingKey: string;
	/**
	 * Note that a Codicon class should be provided for each action.
	 * If not, a default will be used.
	 */
	onKeyDown?(e: IKeyboardEvent): cognidreamidream;
	/**
	 * When the language is markdown, this is provided by default.
	 */
	getSymbols?(): IAccessibleViewSymbol[];
	/**
	 * Note that this will only take effect if the provider has an ID.
	 */
	onDidRequestClearLastProvider?: Event<AccessibleViewProviderId>;
}


export interface IAccessibleViewSymbol extends IPickerQuickAccessItem {
	markdownToParse?: string;
	firstListItem?: string;
	lineNumber?: number;
	endLineNumber?: number;
}

export interface IPosition {
	lineNumber: number;
	column: number;
}

export interface IAccessibleViewService {
	readonly _serviceBrand: undefined;
	// The provider will be disposed when the view is closed
	show(provider: AccesibleViewContentProvider, position?: IPosition): cognidreamidream;
	showLastProvider(id: AccessibleViewProviderId): cognidreamidream;
	showAccessibleViewHelp(): cognidreamidream;
	next(): cognidreamidream;
	previous(): cognidreamidream;
	navigateToCodeBlock(type: 'next' | 'previous'): cognidreamidream;
	goToSymbol(): cognidreamidream;
	disableHint(): cognidreamidream;
	getPosition(id: AccessibleViewProviderId): IPosition | undefined;
	setPosition(position: IPosition, reveal?: boolean, select?: boolean): cognidreamidream;
	getLastPosition(): IPosition | undefined;
	/**
	 * If the setting is enabled, provides the open accessible view hint as a localized string.
	 * @param verbositySettingKey The setting key for the verbosity of the feature
	 */
	getOpenAriaHint(verbositySettingKey: string): string | null;
	getCodeBlockContext(): ICodeBlockActionContext | undefined;
	configureKeybindings(unassigned: boolean): cognidreamidream;
	openHelpLink(): cognidreamidream;
}


export interface ICodeBlockActionContext {
	code: string;
	languageId?: string;
	codeBlockIndex: number;
	element: unknown;
}

export type AccesibleViewContentProvider = AccessibleContentProvider | ExtensionContentProvider;

export class AccessibleContentProvider extends Disposable implements IAccessibleViewContentProvider {

	constructor(
		public id: AccessibleViewProviderId,
		public options: IAccessibleViewOptions,
		public provideContent: () => string,
		public onClose: () => cognidreamidream,
		public verbositySettingKey: string,
		public onOpen?: () => cognidreamidream,
		public actions?: IAction[],
		public provideNextContent?: () => string | undefined,
		public providePreviousContent?: () => string | undefined,
		public onDidChangeContent?: Event<cognidreamidream>,
		public onKeyDown?: (e: IKeyboardEvent) => cognidreamidream,
		public getSymbols?: () => IAccessibleViewSymbol[],
		public onDidRequestClearLastProvider?: Event<AccessibleViewProviderId>,
	) {
		super();
	}
}

export function isIAccessibleViewContentProvider(obj: any): obj is IAccessibleViewContentProvider {
	return obj && obj.id && obj.options && obj.provideContent && obj.onClose && obj.verbositySettingKey;
}

export class ExtensionContentProvider extends Disposable implements IBasicContentProvider {

	constructor(
		public readonly id: string,
		public options: IAccessibleViewOptions,
		public provideContent: () => string,
		public onClose: () => cognidreamidream,
		public onOpen?: () => cognidreamidream,
		public provideNextContent?: () => string | undefined,
		public providePreviousContent?: () => string | undefined,
		public actions?: IAction[],
		public onDidChangeContent?: Event<cognidreamidream>,
	) {
		super();
	}
}

export interface IBasicContentProvider extends IDisposable {
	id: string;
	options: IAccessibleViewOptions;
	onClose(): cognidreamidream;
	provideContent(): string;
	onOpen?(): cognidreamidream;
	actions?: IAction[];
	providePreviousContent?(): cognidreamidream;
	provideNextContent?(): cognidreamidream;
	onDidChangeContent?: Event<cognidreamidream>;
}
