/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Dimension } from '../../../../base/browser/dom.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IEditorGroupsView, IEditorGroupView, IEditorPartsView, IInternalEditorOpenOptions } from './editor.js';
import { IEditorTabsControl } from './editorTabsControl.js';
import { MultiEditorTabsControl } from './multiEditorTabsControl.js';
import { IEditorPartOptions } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { StickyEditorGroupModel, UnstickyEditorGroupModel } from '../../../common/editor/filteredEditorGroupModel.js';
import { IEditorTitleControlDimensions } from './editorTitleControl.js';
import { IReadonlyEditorGroupModel } from '../../../common/editor/editorGroupModel.js';

export class MultiRowEditorControl extends Disposable implements IEditorTabsControl {

	private readonly stickyEditorTabsControl: IEditorTabsControl;
	private readonly unstickyEditorTabsControl: IEditorTabsControl;

	private activeControl: IEditorTabsControl | undefined;

	constructor(
		private readonly parent: HTMLElement,
		editorPartsView: IEditorPartsView,
		private readonly groupsView: IEditorGroupsView,
		private readonly groupView: IEditorGroupView,
		private readonly model: IReadonlyEditorGroupModel,
		@IInstantiationService private readonly instantiationService: IInstantiationService
	) {
		super();

		const stickyModel = this._register(new StickyEditorGroupModel(this.model));
		const unstickyModel = this._register(new UnstickyEditorGroupModel(this.model));

		this.stickyEditorTabsControl = this._register(this.instantiationService.createInstance(MultiEditorTabsControl, this.parent, editorPartsView, this.groupsView, this.groupView, stickyModel));
		this.unstickyEditorTabsControl = this._register(this.instantiationService.createInstance(MultiEditorTabsControl, this.parent, editorPartsView, this.groupsView, this.groupView, unstickyModel));

		this.handleTabBarsStateChange();
	}

	private handleTabBarsStateChange(): cognidreamidream {
		this.activeControl = this.model.activeEditor ? this.getEditorTabsController(this.model.activeEditor) : undefined;
		this.handleTabBarsLayoutChange();
	}

	private handleTabBarsLayoutChange(): cognidreamidream {
		if (this.groupView.count === 0) {
			// Do nothing as no tab bar is visible
			return;
		}

		const hadTwoTabBars = this.parent.classList.contains('two-tab-bars');
		const hasTwoTabBars = this.groupView.count !== this.groupView.stickyCount && this.groupView.stickyCount > 0;

		// Ensure action toolbar is only visible once
		this.parent.classList.toggle('two-tab-bars', hasTwoTabBars);

		if (hadTwoTabBars !== hasTwoTabBars) {
			this.groupView.relayout();
		}
	}

	private didActiveControlChange() {
		return this.activeControl !== (this.model.activeEditor ? this.getEditorTabsController(this.model.activeEditor) : undefined);
	}

	private getEditorTabsController(editor: EditorInput): IEditorTabsControl {
		return this.model.isSticky(editor) ? this.stickyEditorTabsControl : this.unstickyEditorTabsControl;
	}

	openEditor(editor: EditorInput, options: IInternalEditorOpenOptions): boolean {
		const didActiveControlChange = this.didActiveControlChange();
		const didOpenEditorChange = this.getEditorTabsController(editor).openEditor(editor, options);

		const didChange = didOpenEditorChange || didActiveControlChange;
		if (didChange) {
			this.handleOpenedEditors();
		}
		return didChange;
	}

	openEditors(editors: EditorInput[]): boolean {
		const stickyEditors = editors.filter(e => this.model.isSticky(e));
		const unstickyEditors = editors.filter(e => !this.model.isSticky(e));

		const didActiveControlChange = this.didActiveControlChange();
		const didChangeOpenEditorsSticky = this.stickyEditorTabsControl.openEditors(stickyEditors);
		const didChangeOpenEditorsUnSticky = this.unstickyEditorTabsControl.openEditors(unstickyEditors);

		const didChange = didChangeOpenEditorsSticky || didChangeOpenEditorsUnSticky || didActiveControlChange;
		if (didChange) {
			this.handleOpenedEditors();
		}

		return didChange;
	}

	private handleOpenedEditors(): cognidreamidream {
		this.handleTabBarsStateChange();
	}

	beforeCloseEditor(editor: EditorInput): cognidreamidream {
		this.getEditorTabsController(editor).beforeCloseEditor(editor);
	}

	closeEditor(editor: EditorInput): cognidreamidream {
		// Has to be called on both tab bars as the editor could be either sticky or not
		this.stickyEditorTabsControl.closeEditor(editor);
		this.unstickyEditorTabsControl.closeEditor(editor);

		this.handleClosedEditors();
	}

	closeEditors(editors: EditorInput[]): cognidreamidream {
		const stickyEditors = editors.filter(e => this.model.isSticky(e));
		const unstickyEditors = editors.filter(e => !this.model.isSticky(e));

		this.stickyEditorTabsControl.closeEditors(stickyEditors);
		this.unstickyEditorTabsControl.closeEditors(unstickyEditors);

		this.handleClosedEditors();
	}

	private handleClosedEditors(): cognidreamidream {
		this.handleTabBarsStateChange();
	}

	moveEditor(editor: EditorInput, fromIndex: number, targetIndex: number, stickyStateChange: boolean): cognidreamidream {
		if (stickyStateChange) {
			// If sticky state changes, move editor between tab bars
			if (this.model.isSticky(editor)) {
				this.stickyEditorTabsControl.openEditor(editor);
				this.unstickyEditorTabsControl.closeEditor(editor);
			} else {
				this.stickyEditorTabsControl.closeEditor(editor);
				this.unstickyEditorTabsControl.openEditor(editor);
			}

			this.handleTabBarsStateChange();

		} else {
			if (this.model.isSticky(editor)) {
				this.stickyEditorTabsControl.moveEditor(editor, fromIndex, targetIndex, stickyStateChange);
			} else {
				this.unstickyEditorTabsControl.moveEditor(editor, fromIndex - this.model.stickyCount, targetIndex - this.model.stickyCount, stickyStateChange);
			}
		}
	}

	pinEditor(editor: EditorInput): cognidreamidream {
		this.getEditorTabsController(editor).pinEditor(editor);
	}

	stickEditor(editor: EditorInput): cognidreamidream {
		this.unstickyEditorTabsControl.closeEditor(editor);
		this.stickyEditorTabsControl.openEditor(editor);

		this.handleTabBarsStateChange();
	}

	unstickEditor(editor: EditorInput): cognidreamidream {
		this.stickyEditorTabsControl.closeEditor(editor);
		this.unstickyEditorTabsControl.openEditor(editor);

		this.handleTabBarsStateChange();
	}

	setActive(isActive: boolean): cognidreamidream {
		this.stickyEditorTabsControl.setActive(isActive);
		this.unstickyEditorTabsControl.setActive(isActive);
	}

	updateEditorSelections(): cognidreamidream {
		this.stickyEditorTabsControl.updateEditorSelections();
		this.unstickyEditorTabsControl.updateEditorSelections();
	}

	updateEditorLabel(editor: EditorInput): cognidreamidream {
		this.getEditorTabsController(editor).updateEditorLabel(editor);
	}

	updateEditorDirty(editor: EditorInput): cognidreamidream {
		this.getEditorTabsController(editor).updateEditorDirty(editor);
	}

	updateOptions(oldOptions: IEditorPartOptions, newOptions: IEditorPartOptions): cognidreamidream {
		this.stickyEditorTabsControl.updateOptions(oldOptions, newOptions);
		this.unstickyEditorTabsControl.updateOptions(oldOptions, newOptions);
	}

	layout(dimensions: IEditorTitleControlDimensions): Dimension {
		const stickyDimensions = this.stickyEditorTabsControl.layout(dimensions);
		const unstickyAvailableDimensions = {
			container: dimensions.container,
			available: new Dimension(dimensions.available.width, dimensions.available.height - stickyDimensions.height)
		};
		const unstickyDimensions = this.unstickyEditorTabsControl.layout(unstickyAvailableDimensions);

		return new Dimension(
			dimensions.container.width,
			stickyDimensions.height + unstickyDimensions.height
		);
	}

	getHeight(): number {
		return this.stickyEditorTabsControl.getHeight() + this.unstickyEditorTabsControl.getHeight();
	}

	override dispose(): cognidreamidream {
		this.parent.classList.toggle('two-tab-bars', false);

		super.dispose();
	}
}
