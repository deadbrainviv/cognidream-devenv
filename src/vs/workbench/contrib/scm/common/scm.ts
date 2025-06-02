/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../base/common/uri.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { Event } from '../../../../base/common/event.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { Command } from '../../../../editor/common/languages.js';
import { IAction } from '../../../../base/common/actions.js';
import { IMenu } from '../../../../platform/actions/common/actions.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { IMarkdownString } from '../../../../base/common/htmlContent.js';
import { ResourceTree } from '../../../../base/common/resourceTree.js';
import { ISCMHistoryProvider } from './history.js';
import { ITextModel } from '../../../../editor/common/model.js';
import { IObservable } from '../../../../base/common/observable.js';

export const VIEWLET_ID = 'workbench.view.scm';
export const VIEW_PANE_ID = 'workbench.scm';
export const REPOSITORIES_VIEW_PANE_ID = 'workbench.scm.repositories';
export const HISTORY_VIEW_PANE_ID = 'workbench.scm.history';

export interface IBaselineResourceProvider {
	getBaselineResource(resource: URI): Promise<URI>;
}

export const ISCMService = createDecorator<ISCMService>('scm');

export interface ISCMResourceDecorations {
	icon?: URI | ThemeIcon;
	iconDark?: URI | ThemeIcon;
	tooltip?: string;
	strikeThrough?: boolean;
	faded?: boolean;
}

export interface ISCMResource {
	readonly resourceGroup: ISCMResourceGroup;
	readonly sourceUri: URI;
	readonly decorations: ISCMResourceDecorations;
	readonly contextValue: string | undefined;
	readonly command: Command | undefined;
	readonly multiDiffEditorOriginalUri: URI | undefined;
	readonly multiDiffEditorModifiedUri: URI | undefined;
	open(preserveFocus: boolean): Promise<cognidream>;
}

export interface ISCMResourceGroup {
	readonly id: string;
	readonly provider: ISCMProvider;

	readonly resources: readonly ISCMResource[];
	readonly resourceTree: ResourceTree<ISCMResource, ISCMResourceGroup>;
	readonly onDidChangeResources: Evecognidreamognidream>;

    readonly label: string;
contextValue: string | undefined;
    readonly hideWhenEmpty: boolean;
    readonly onDidChange: Evecognidreamognidream >;

    readonly multiDiffEditorEnableViewChanges: boolean;
}

export interface ISCMProvider extends IDisposable {
	readonly id: string;
	readonly label: string;
	readonly contextValue: string;
	readonly name: string;

	readonly groups: readonly ISCMResourceGroup[];
	readonly onDidChangeResourceGroups: Evecognidreamognidream>;
    readonly onDidChangeResources: Evecognidreamognidream >;

    readonly rootUri ?: URI;
    readonly inputBoxTextModel: ITextModel;
    readonly count: IObservable<number | undefined>;
    readonly commitTemplate: IObservable<string>;
    readonly historyProvider: IObservable<ISCMHistoryProvider | undefined>;
    readonly acceptInputCommand ?: Command;
    readonly actionButton: IObservable<ISCMActionButtonDescriptor | undefined>;
    readonly statusBarCommands: IObservable<readonly Command[] | undefined>;

getOriginalResource(uri: URI): Promise<URI | null>;
}

export interface ISCMInputValueProviderContext {
	readonly resourceGroupId: string;
	readonly resources: readonly URI[];
}

export const enum InputValidationType {
	Error = 0,
	Warning = 1,
	Information = 2
}

export interface IInputValidation {
	message: string | IMarkdownString;
	type: InputValidationType;
}

export interface IInputValidator {
	(value: string, cursorPosition: number): Promise<IInputValidation | undefined>;
}

export enum SCMInputChangeReason {
	HistoryPrevious,
	HistoryNext
}

export interface ISCMInputChangeEvent {
	readonly value: string;
	readonly reason?: SCMInputChangeReason;
}

export interface ISCMActionButtonDescriptor {
	command: Command & { shortTitle?: string };
	secondaryCommands?: Command[][];
	enabled: boolean;
}

export interface ISCMActionButton {
	readonly type: 'actionButton';
	readonly repository: ISCMRepository;
	readonly button: ISCMActionButtonDescriptor;
}

export interface ISCMInput {
	readonly repository: ISCMRepository;

	readonly value: string;
	setValue(value: string, fromKeyboard: booleancognidreamognidream;
		readonly onDidChange: Event<ISCMInputChangeEvent>;

		placeholder: string;
		readonly onDidChangePlaceholder: Event<string>;

		validateInput: IInputValidator;
		readonly onDidChangeValidateInput: Evecognidreamognidream>;

enabled: boolean;
    readonly onDidChangeEnablement: Event<boolean>;

visible: boolean;
    readonly onDidChangeVisibility: Event<boolean>;

setFocus(cognidreamognidream;
    readonly onDidChangeFocus: Evecognidreamognidream >;

showValidationMessage(message: string | IMarkdownString, type: InputValidationTypecognidreamognidream;
    readonly onDidChangeValidationMessage: Event<IInputValidation>;

showNextHistoryValue(cognidreamognidream;
showPreviousHistoryValue(cognidreamognidream;
}

export interface ISCMRepository extends IDisposable {
	readonly id: string;
	readonly provider: ISCMProvider;
	readonly input: ISCMInput;
}

export interface ISCMService {

	readonly _serviceBrand: undefined;
	readonly onDidAddRepository: Event<ISCMRepository>;
	readonly onDidRemoveRepository: Event<ISCMRepository>;
	readonly repositories: Iterable<ISCMRepository>;
	readonly repositoryCount: number;

	registerSCMProvider(provider: ISCMProvider): ISCMRepository;

	getRepository(id: string): ISCMRepository | undefined;
	getRepository(resource: URI): ISCMRepository | undefined;
}

export interface ISCMTitleMenu {
	readonly actions: IAction[];
	readonly secondaryActions: IAction[];
	readonly onDidChangeTitle: Evecognidreamognidream>;
    readonly menu: IMenu;
}

export interface ISCMRepositoryMenus {
	readonly titleMenu: ISCMTitleMenu;
	readonly repositoryMenu: IMenu;
	readonly repositoryContextMenu: IMenu;
	getResourceGroupMenu(group: ISCMResourceGroup): IMenu;
	getResourceMenu(resource: ISCMResource): IMenu;
	getResourceFolderMenu(group: ISCMResourceGroup): IMenu;
}

export interface ISCMMenus {
	getRepositoryMenus(provider: ISCMProvider): ISCMRepositoryMenus;
}

export const enum ISCMRepositorySortKey {
	DiscoveryTime = 'discoveryTime',
	Name = 'name',
	Path = 'path'
}

export const ISCMViewService = createDecorator<ISCMViewService>('scmView');

export interface ISCMViewVisibleRepositoryChangeEvent {
	readonly added: Iterable<ISCMRepository>;
	readonly removed: Iterable<ISCMRepository>;
}

export interface ISCMViewService {
	readonly _serviceBrand: undefined;

	readonly menus: ISCMMenus;

	repositories: ISCMRepository[];
	readonly onDidChangeRepositories: Event<ISCMViewVisibleRepositoryChangeEvent>;

	visibleRepositories: readonly ISCMRepository[];
	readonly onDidChangeVisibleRepositories: Event<ISCMViewVisibleRepositoryChangeEvent>;

	isVisible(repository: ISCMRepository): boolean;
	toggleVisibility(repository: ISCMRepository, visible?: booleancognidreamognidream;

		toggleSortKey(sortKey: ISCMRepositorySortKeycognidreamognidream;

			readonly focusedRepository: ISCMRepository | undefined;
			readonly onDidFocusRepository: Event<ISCMRepository | undefined>;
			focus(repository: ISCMRepositorycognidreamognidream;

				/**
				 * Focused repository or the repository for the active editor
				 */
				readonly activeRepository: IObservable<ISCMRepository | undefined>;
				pinActiveRepository(repository: ISCMRepository | undefinedcognidreamognidream;
}

export const SCM_CHANGES_EDITOR_ID = 'workbench.editor.scmChangesEditor';

export interface ISCMChangesEditor { }
