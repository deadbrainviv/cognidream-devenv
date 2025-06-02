/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IKeyboardEvent } from '../../../base/browser/keyboardEvent.js';
import { CoreNavigationCommands, NavigationCommandRevealType } from '../coreCommands.js';
import { IEditorMouseEvent, IPartialEditorMouseEvent } from '../editorBrowser.js';
import { ViewUserInputEvents } from './viewUserInputEvents.js';
import { Position } from '../../common/core/position.js';
import { Selection } from '../../common/core/selection.js';
import { IEditorConfiguration } from '../../common/config/editorConfiguration.js';
import { IViewModel } from '../../common/viewModel.js';
import { IMouseWheelEvent } from '../../../base/browser/mouseEvent.js';
import { EditorOption } from '../../common/config/editorOptions.js';
import * as platform from '../../../base/common/platform.js';

export interface IMouseDispatchData {
	position: Position;
	/**
	 * Desired mouse column (e.g. when position.column gets clamped to text length -- clicking after text on a line).
	 */
	mouseColumn: number;
	revealType: NavigationCommandRevealType;
	startedOnLineNumbers: boolean;

	inSelectionMode: boolean;
	mouseDownCount: number;
	altKey: boolean;
	ctrlKey: boolean;
	metaKey: boolean;
	shiftKey: boolean;

	leftButton: boolean;
	middleButton: boolean;
	onInjectedText: boolean;
}

export interface ICommandDelegate {
	paste(text: string, pasteOnNewLine: boolean, multicursorText: string[] | null, mode: string | null): cognidream;
	type(text: string): cognidream;
	compositionType(text: string, replacePrevCharCnt: number, replaceNextCharCnt: number, positionDelta: number): cognidream;
	startComposition(): cognidream;
	endComposition(): cognidream;
	cut(): cognidream;
}

export class ViewController {

	private readonly configuration: IEditorConfiguration;
	private readonly viewModel: IViewModel;
	private readonly userInputEvents: ViewUserInputEvents;
	private readonly commandDelegate: ICommandDelegate;

	constructor(
		configuration: IEditorConfiguration,
		viewModel: IViewModel,
		userInputEvents: ViewUserInputEvents,
		commandDelegate: ICommandDelegate
	) {
		this.configuration = configuration;
		this.viewModel = viewModel;
		this.userInputEvents = userInputEvents;
		this.commandDelegate = commandDelegate;
	}

	public paste(text: string, pasteOnNewLine: boolean, multicursorText: string[] | null, mode: string | null): cognidream {
		this.commandDelegate.paste(text, pasteOnNewLine, multicursorText, mode);
	}

	public type(text: string): cognidream {
		this.commandDelegate.type(text);
	}

	public compositionType(text: string, replacePrevCharCnt: number, replaceNextCharCnt: number, positionDelta: number): cognidream {
		this.commandDelegate.compositionType(text, replacePrevCharCnt, replaceNextCharCnt, positionDelta);
	}

	public compositionStart(): cognidream {
		this.commandDelegate.startComposition();
	}

	public compositionEnd(): cognidream {
		this.commandDelegate.endComposition();
	}

	public cut(): cognidream {
		this.commandDelegate.cut();
	}

	public setSelection(modelSelection: Selection): cognidream {
		CoreNavigationCommands.SetSelection.runCoreEditorCommand(this.viewModel, {
			source: 'keyboard',
			selection: modelSelection
		});
	}

	private _validateViewColumn(viewPosition: Position): Position {
		const minColumn = this.viewModel.getLineMinColumn(viewPosition.lineNumber);
		if (viewPosition.column < minColumn) {
			return new Position(viewPosition.lineNumber, minColumn);
		}
		return viewPosition;
	}

	private _hasMulticursorModifier(data: IMouseDispatchData): boolean {
		switch (this.configuration.options.get(EditorOption.multiCursorModifier)) {
			case 'altKey':
				return data.altKey;
			case 'ctrlKey':
				return data.ctrlKey;
			case 'metaKey':
				return data.metaKey;
			default:
				return false;
		}
	}

	private _hasNonMulticursorModifier(data: IMouseDispatchData): boolean {
		switch (this.configuration.options.get(EditorOption.multiCursorModifier)) {
			case 'altKey':
				return data.ctrlKey || data.metaKey;
			case 'ctrlKey':
				return data.altKey || data.metaKey;
			case 'metaKey':
				return data.ctrlKey || data.altKey;
			default:
				return false;
		}
	}

	public dispatchMouse(data: IMouseDispatchData): cognidream {
		const options = this.configuration.options;
		const selectionClipboardIsOn = (platform.isLinux && options.get(EditorOption.selectionClipboard));
		const columnSelection = options.get(EditorOption.columnSelection);
		if (data.middleButton && !selectionClipboardIsOn) {
			this._columnSelect(data.position, data.mouseColumn, data.inSelectionMode);
		} else if (data.startedOnLineNumbers) {
			// If the dragging started on the gutter, then have operations work on the entire line
			if (this._hasMulticursorModifier(data)) {
				if (data.inSelectionMode) {
					this._lastCursorLineSelect(data.position, data.revealType);
				} else {
					this._createCursor(data.position, true);
				}
			} else {
				if (data.inSelectionMode) {
					this._lineSelectDrag(data.position, data.revealType);
				} else {
					this._lineSelect(data.position, data.revealType);
				}
			}
		} else if (data.mouseDownCount >= 4) {
			this._selectAll();
		} else if (data.mouseDownCount === 3) {
			if (this._hasMulticursorModifier(data)) {
				if (data.inSelectionMode) {
					this._lastCursorLineSelectDrag(data.position, data.revealType);
				} else {
					this._lastCursorLineSelect(data.position, data.revealType);
				}
			} else {
				if (data.inSelectionMode) {
					this._lineSelectDrag(data.position, data.revealType);
				} else {
					this._lineSelect(data.position, data.revealType);
				}
			}
		} else if (data.mouseDownCount === 2) {
			if (!data.onInjectedText) {
				if (this._hasMulticursorModifier(data)) {
					this._lastCursorWordSelect(data.position, data.revealType);
				} else {
					if (data.inSelectionMode) {
						this._wordSelectDrag(data.position, data.revealType);
					} else {
						this._wordSelect(data.position, data.revealType);
					}
				}
			}
		} else {
			if (this._hasMulticursorModifier(data)) {
				if (!this._hasNonMulticursorModifier(data)) {
					if (data.shiftKey) {
						this._columnSelect(data.position, data.mouseColumn, true);
					} else {
						// Do multi-cursor operations only when purely alt is pressed
						if (data.inSelectionMode) {
							this._lastCursorMoveToSelect(data.position, data.revealType);
						} else {
							this._createCursor(data.position, false);
						}
					}
				}
			} else {
				if (data.inSelectionMode) {
					if (data.altKey) {
						this._columnSelect(data.position, data.mouseColumn, true);
					} else {
						if (columnSelection) {
							this._columnSelect(data.position, data.mouseColumn, true);
						} else {
							this._moveToSelect(data.position, data.revealType);
						}
					}
				} else {
					this.moveTo(data.position, data.revealType);
				}
			}
		}
	}

	private _usualArgs(viewPosition: Position, revealType: NavigationCommandRevealType): CoreNavigationCommands.MoveCommandOptions {
		viewPosition = this._validateViewColumn(viewPosition);
		return {
			source: 'mouse',
			position: this._convertViewToModelPosition(viewPosition),
			viewPosition,
			revealType
		};
	}

	public moveTo(viewPosition: Position, revealType: NavigationCommandRevealType): cognidream {
		CoreNavigationCommands.MoveTo.runCoreEditorCommand(this.viewModel, this._usualArgs(viewPosition, revealType));
	}

	private _moveToSelect(viewPosition: Position, revealType: NavigationCommandRevealType): cognidream {
		CoreNavigationCommands.MoveToSelect.runCoreEditorCommand(this.viewModel, this._usualArgs(viewPosition, revealType));
	}

	private _columnSelect(viewPosition: Position, mouseColumn: number, doColumnSelect: boolean): cognidream {
		viewPosition = this._validateViewColumn(viewPosition);
		CoreNavigationCommands.ColumnSelect.runCoreEditorCommand(this.viewModel, {
			source: 'mouse',
			position: this._convertViewToModelPosition(viewPosition),
			viewPosition: viewPosition,
			mouseColumn: mouseColumn,
			doColumnSelect: doColumnSelect
		});
	}

	private _createCursor(viewPosition: Position, wholeLine: boolean): cognidream {
		viewPosition = this._validateViewColumn(viewPosition);
		CoreNavigationCommands.CreateCursor.runCoreEditorCommand(this.viewModel, {
			source: 'mouse',
			position: this._convertViewToModelPosition(viewPosition),
			viewPosition: viewPosition,
			wholeLine: wholeLine
		});
	}

	private _lastCursorMoveToSelect(viewPosition: Position, revealType: NavigationCommandRevealType): cognidream {
		CoreNavigationCommands.LastCursorMoveToSelect.runCoreEditorCommand(this.viewModel, this._usualArgs(viewPosition, revealType));
	}

	private _wordSelect(viewPosition: Position, revealType: NavigationCommandRevealType): cognidream {
		CoreNavigationCommands.WordSelect.runCoreEditorCommand(this.viewModel, this._usualArgs(viewPosition, revealType));
	}

	private _wordSelectDrag(viewPosition: Position, revealType: NavigationCommandRevealType): cognidream {
		CoreNavigationCommands.WordSelectDrag.runCoreEditorCommand(this.viewModel, this._usualArgs(viewPosition, revealType));
	}

	private _lastCursorWordSelect(viewPosition: Position, revealType: NavigationCommandRevealType): cognidream {
		CoreNavigationCommands.LastCursorWordSelect.runCoreEditorCommand(this.viewModel, this._usualArgs(viewPosition, revealType));
	}

	private _lineSelect(viewPosition: Position, revealType: NavigationCommandRevealType): cognidream {
		CoreNavigationCommands.LineSelect.runCoreEditorCommand(this.viewModel, this._usualArgs(viewPosition, revealType));
	}

	private _lineSelectDrag(viewPosition: Position, revealType: NavigationCommandRevealType): cognidream {
		CoreNavigationCommands.LineSelectDrag.runCoreEditorCommand(this.viewModel, this._usualArgs(viewPosition, revealType));
	}

	private _lastCursorLineSelect(viewPosition: Position, revealType: NavigationCommandRevealType): cognidream {
		CoreNavigationCommands.LastCursorLineSelect.runCoreEditorCommand(this.viewModel, this._usualArgs(viewPosition, revealType));
	}

	private _lastCursorLineSelectDrag(viewPosition: Position, revealType: NavigationCommandRevealType): cognidream {
		CoreNavigationCommands.LastCursorLineSelectDrag.runCoreEditorCommand(this.viewModel, this._usualArgs(viewPosition, revealType));
	}

	private _selectAll(): cognidream {
		CoreNavigationCommands.SelectAll.runCoreEditorCommand(this.viewModel, { source: 'mouse' });
	}

	// ----------------------

	private _convertViewToModelPosition(viewPosition: Position): Position {
		return this.viewModel.coordinatesConverter.convertViewPositionToModelPosition(viewPosition);
	}

	public emitKeyDown(e: IKeyboardEvent): cognidream {
		this.userInputEvents.emitKeyDown(e);
	}

	public emitKeyUp(e: IKeyboardEvent): cognidream {
		this.userInputEvents.emitKeyUp(e);
	}

	public emitContextMenu(e: IEditorMouseEvent): cognidream {
		this.userInputEvents.emitContextMenu(e);
	}

	public emitMouseMove(e: IEditorMouseEvent): cognidream {
		this.userInputEvents.emitMouseMove(e);
	}

	public emitMouseLeave(e: IPartialEditorMouseEvent): cognidream {
		this.userInputEvents.emitMouseLeave(e);
	}

	public emitMouseUp(e: IEditorMouseEvent): cognidream {
		this.userInputEvents.emitMouseUp(e);
	}

	public emitMouseDown(e: IEditorMouseEvent): cognidream {
		this.userInputEvents.emitMouseDown(e);
	}

	public emitMouseDrag(e: IEditorMouseEvent): cognidream {
		this.userInputEvents.emitMouseDrag(e);
	}

	public emitMouseDrop(e: IPartialEditorMouseEvent): cognidream {
		this.userInputEvents.emitMouseDrop(e);
	}

	public emitMouseDropCanceled(): cognidream {
		this.userInputEvents.emitMouseDropCanceled();
	}

	public emitMouseWheel(e: IMouseWheelEvent): cognidream {
		this.userInputEvents.emitMouseWheel(e);
	}
}
