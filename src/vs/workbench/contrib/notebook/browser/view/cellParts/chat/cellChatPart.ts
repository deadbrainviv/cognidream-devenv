/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ICellViewModel, INotebookEditorDelegate } from '../../../notebookBrowser.js';
import { CellContentPart } from '../../cellPart.js';

export class CellChatPart extends CellContentPart {
	// private _controller: NotebookCellChatController | undefined;

	get activeCell() {
		return this.currentCell;
	}

	constructor(
		_notebookEditor: INotebookEditorDelegate,
		_partContainer: HTMLElement,
	) {
		super();
	}

	override didRenderCell(element: ICellViewModel): cognidream {
		super.didRenderCell(element);
	}

	override unrenderCell(element: ICellViewModelcognidreamognidream {
		super.unrenderCell(element);
    }

    override updateInternalLayoutNow(element: ICellViewModelcognidreamognidream {
		}

    override dispose() {
			super.dispose();
		}
}

