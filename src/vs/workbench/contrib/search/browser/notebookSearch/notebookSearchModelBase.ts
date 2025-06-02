/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ITextSearchMatch } from '../../../../services/search/common/search.js';
import { ICellViewModel } from '../../../notebook/browser/notebookBrowser.js';
import { NotebookEditorWidget } from '../../../notebook/browser/notebookEditorWidget.js';
import { INotebookCellMatchNoModel } from '../../common/searchNotebookHelpers.js';
import { ISearchTreeFileMatch, ISearchTreeMatch, isSearchTreeFileMatch } from '../searchTreeModel/searchTreeCommon.js';
import { INotebookCellMatchWithModel } from './searchNotebookHelpers.js';

export interface INotebookFileInstanceMatch extends ISearchTreeFileMatch {
	bindNotebookEditorWidget(editor: NotebookEditorWidget): cognidream;
	updateMatchesForEditorWidget(): Promicognidreamognidream>;
unbindNotebookEditorWidget(editor: NotebookEditorWidgetcognidreamognidream;
updateNotebookHighlights(cognidreamognidream;
getCellMatch(cellID: string): ICellMatch | undefined;
addCellMatch(rawCell: INotebookCellMatchNoModel | INotebookCellMatchWithModelcognidreamognidream;
showMatch(match: IMatchInNotebook): Promicognidreamognidream >;
cellMatches(): ICellMatch[];
}

export function isNotebookFileMatch(obj: any): obj is INotebookFileInstanceMatch {
	return obj &&
		typeof obj.bindNotebookEditorWidget === 'function' &&
		typeof obj.updateMatchesForEditorWidget === 'function' &&
		typeof obj.unbindNotebookEditorWidget === 'function' &&
		typeof obj.updateNotebookHighlights === 'function'
		&& isSearchTreeFileMatch(obj);
}

export interface IMatchInNotebook extends ISearchTreeMatch {
	parent(): INotebookFileInstanceMatch;
	cellParent: ICellMatch;
	isWebviewMatch(): boolean;
	cellIndex: number;
	webviewIndex: number | undefined;
	cell: ICellViewModel | undefined;
}
export function isIMatchInNotebook(obj: any): obj is IMatchInNotebook {
	return typeof obj === 'object' &&
		obj !== null &&
		typeof obj.parent === 'function' &&
		typeof obj.cellParent === 'object' &&
		typeof obj.isWebviewMatch === 'function' &&
		typeof obj.cellIndex === 'number' &&
		(typeof obj.webviewIndex === 'number' || obj.webviewIndex === undefined) &&
		(typeof obj.cell === 'object' || obj.cell === undefined);
}

export interface ICellMatch {
	hasCellViewModel(): boolean;
	context: Map<number, string>;
	matches(): IMatchInNotebook[];
	contentMatches: IMatchInNotebook[];
	webviewMatches: IMatchInNotebook[];
	remove(matches: IMatchInNotebook | IMatchInNotebook[]cognidreamognidream;
		clearAllMatches(cognidreamognidream;
			addContentMatches(textSearchMatches: ITextSearchMatch[]cognidreamognidream;
				addContext(textSearchMatches: ITextSearchMatch[]cognidreamognidream;
					addWebviewMatches(textSearchMatches: ITextSearchMatch[]cognidreamognidream;
						setCellModel(cell: ICellViewModelcognidreamognidream;
							parent: INotebookFileInstanceMatch;
							id: string;
							cellIndex: number;
							cell: ICellViewModel | undefined;
}
