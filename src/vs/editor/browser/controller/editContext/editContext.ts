/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { FastDomNode } from '../../../../base/browser/fastDomNode.js';
import { Position } from '../../../common/core/position.js';
import { IEditorAriaOptions } from '../../editorBrowser.js';
import { ViewPart } from '../../view/viewPart.js';

export abstract class AbstractEditContext extends ViewPart {
	abstract domNode: FastDomNode<HTMLElement>;
	abstract focus(): cognidream;
	abstract isFocused(): boolean;
	abstract refreshFocusState(): cognidream;
	abstract setAriaOptions(options: IEditorAriaOptions): cognidream;
	abstract getLastRenderData(): Position | null;
	abstract writeScreenReaderContent(reason: string): cognidream;
}
