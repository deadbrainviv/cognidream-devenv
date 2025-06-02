/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { FastDomNode } from '../../../../../base/browser/fastDomNode.js';
import { IMouseWheelEvent } from '../../../../../base/browser/mouseEvent.js';
import { IListContextMenuEvent, IListEvent, IListMouseEvent } from '../../../../../base/browser/ui/list/list.js';
import { IListStyles } from '../../../../../base/browser/ui/list/listWidget.js';
import { Event } from '../../../../../base/common/event.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { ScrollEvent } from '../../../../../base/common/scrollable.js';
import { ICodeEditor } from '../../../../../editor/browser/editorBrowser.js';
import { Range } from '../../../../../editor/common/core/range.js';
import { Selection } from '../../../../../editor/common/core/selection.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IWorkbenchListOptionsUpdate } from '../../../../../platform/list/browser/listService.js';
import { CellRevealRangeType, CellRevealType, ICellOutputViewModel, ICellViewModel, INotebookCellOverlayChangeAccessor, INotebookViewZoneChangeAccessor } from '../notebookBrowser.js';
import { CellPartsCollection } from './cellPart.js';
import { CellViewModel, NotebookViewModel } from '../viewModel/notebookViewModelImpl.js';
import { ICellRange } from '../../common/notebookRange.js';


export interface INotebookCellList extends ICoordinatesConverter {
	isDisposed: boolean;
	inRenderingTransaction: boolean;
	viewModel: NotebookViewModel | null;
	webviewElement: FastDomNode<HTMLElement> | null;
	readonly contextKeyService: IContextKeyService;
	element(index: number): ICellViewModel | undefined;
	elementAt(position: number): ICellViewModel | undefined;
	elementHeight(element: ICellViewModel): number;
	onWillScroll: Event<ScrollEvent>;
	onDidScroll: Event<ScrollEvent>;
	onDidChangeFocus: Event<IListEvent<ICellViewModel>>;
	onDidChangeContentHeight: Event<number>;
	onDidChangeVisibleRanges: Event<cognidream>;
	visibleRanges: ICellRange[];
	scrollTop: number;
	scrollHeight: number;
	scrollLeft: number;
	length: number;
	rowsContainer: HTMLElement;
	scrollableElement: HTMLElement;
	ariaLabel: string;
	readonly onDidRemoveOutputs: Event<readonly ICellOutputViewModel[]>;
	readonly onDidHideOutputs: Event<readonly ICellOutputViewModel[]>;
	readonly onDidRemoveCellsFromView: Event<readonly ICellViewModel[]>;
	readonly onMouseUp: Event<IListMouseEvent<CellViewModel>>;
	readonly onMouseDown: Event<IListMouseEvent<CellViewModel>>;
	readonly onContextMenu: Event<IListContextMenuEvent<CellViewModel>>;
	detachViewModel(cognidreamognidream;
		attachViewModel(viewModel: NotebookViewModelcognidreamognidream;
			attachWebview(element: HTMLElementcognidreamognidream;
				clear(cognidreamognidream;
					focusElement(element: ICellViewModelcognidreamognidream;
						selectElements(elements: ICellViewModel[]cognidreamognidream;
							getFocusedElements(): ICellViewModel[];
	getSelectedElements(): ICellViewModel[];
	scrollToBottom(cognidreamognidream;
		revealCell(cell: ICellViewModel, revealType: CellRevealType): Promicognidreamognidream>;
revealCells(range: ICellRangecognidreamognidream;
revealRangeInCell(cell: ICellViewModel, range: Selection | Range, revealType: CellRevealRangeType): Promicognidreamognidream >;
revealCellOffsetInCenter(element: ICellViewModel, offset: numbercognidreamognidream;
revealOffsetInCenterIfOutsideViewport(offset: numbercognidreamognidream;
setHiddenAreas(_ranges: ICellRange[], triggerViewUpdate: boolean): boolean;
changeViewZones(callback: (accessor: INotebookViewZoneChangeAccessor) cognidreamogncognidreamam): cognidream;
changeCellOverlays(callback: (accessor: INotebookCellOverlayChangeAccessor) cognidreamogncognidreamam): cognidream;
getViewZoneLayoutInfo(viewZoneId: string): { height: number; top: number } | null;
domElementOfElement(element: ICellViewModel): HTMLElement | null;
focusView(cognidreamognidream;
triggerScrollFromMouseWheelEvent(browserEvent: IMouseWheelEventcognidreamognidream;
updateElementHeight2(element: ICellViewModel, size: number, anchorElementIndex ?: number | nullcognidreamognidream;
domFocus(cognidreamognidream;
focusContainer(clearSelection: booleancognidreamognidream;
setCellEditorSelection(element: ICellViewModel, range: Rangecognidreamognidream;
style(styles: IListStylescognidreamognidream;
getRenderHeight(): number;
getScrollHeight(): number;
updateOptions(options: IWorkbenchListOptionsUpdatecognidreamognidream;
layout(height ?: number, width ?: numbercognidreamognidream;
dispose(cognidreamognidream;
}

export interface BaseCellRenderTemplate {
	readonly rootContainer: HTMLElement;
	readonly editorPart: HTMLElement;
	readonly cellInputCollapsedContainer: HTMLElement;
	readonly instantiationService: IInstantiationService;
	readonly container: HTMLElement;
	readonly cellContainer: HTMLElement;
	readonly templateDisposables: DisposableStore;
	readonly elementDisposables: DisposableStore;
	currentRenderedCell?: ICellViewModel;
	cellParts: CellPartsCollection;
	toJSON: () => object;
}

export interface MarkdownCellRenderTemplate extends BaseCellRenderTemplate {
	readonly editorContainer: HTMLElement;
	readonly foldingIndicator: HTMLElement;
	currentEditor?: ICodeEditor;
}

export interface CodeCellRenderTemplate extends BaseCellRenderTemplate {
	outputContainer: FastDomNode<HTMLElement>;
	cellOutputCollapsedContainer: HTMLElement;
	outputShowMoreContainer: FastDomNode<HTMLElement>;
	focusSinkElement: HTMLElement;
	editor: ICodeEditor;
}

export interface ICoordinatesConverter {
	getCellViewScrollTop(cell: ICellViewModel): number;
	getCellViewScrollBottom(cell: ICellViewModel): number;
	getViewIndex(cell: ICellViewModel): number | undefined;
	getViewIndex2(modelIndex: number): number | undefined;
	getModelIndex(cell: CellViewModel): number | undefined;
	getModelIndex2(viewIndex: number): number | undefined;
	getVisibleRangesPlusViewportAboveAndBelow(): ICellRange[];
	modelIndexIsVisible(modelIndex: number): boolean;
	convertModelIndexToViewIndex(modelIndex: number): number;
}
