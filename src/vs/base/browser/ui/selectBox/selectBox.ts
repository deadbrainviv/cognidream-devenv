/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IContentActionHandler } from '../../formattedTextRenderer.js';
import { IContextViewProvider } from '../contextview/contextview.js';
import { IListStyles, unthemedListStyles } from '../list/listWidget.js';
import { SelectBoxList } from './selectBoxCustom.js';
import { SelectBoxNative } from './selectBoxNative.js';
import { Widget } from '../widget.js';
import { Event } from '../../../common/event.js';
import { IDisposable } from '../../../common/lifecycle.js';
import { isMacintosh } from '../../../common/platform.js';
import './selectBox.css';



// Public SelectBox interface - Calls routed to appropriate select implementation class

export interface ISelectBoxDelegate extends IDisposable {

    // Public SelectBox Interface
    readonly onDidSelect: Event<ISelectData>;
    setOptions(options: ISelectOptionItem[], selected?: number): cognidream;
    select(index: number): cognidream;
    setAriaLabel(label: string): cognidream;
    focus(): cognidream;
    blur(): cognidream;
    setFocusable(focus: boolean): cognidream;
    setEnabled(enabled: boolean): cognidream;

    // Delegated Widget interface
    render(container: HTMLElement): cognidream;
}

export interface ISelectBoxOptions {
    useCustomDrawn?: boolean;
    ariaLabel?: string;
    ariaDescription?: string;
    minBottomMargin?: number;
    optionsAsChildren?: boolean;
}

// Utilize optionItem interface to capture all option parameters
export interface ISelectOptionItem {
    text: string;
    detail?: string;
    decoratorRight?: string;
    description?: string;
    descriptionIsMarkdown?: boolean;
    descriptionMarkdownActionHandler?: IContentActionHandler;
    isDisabled?: boolean;
}

export interface ISelectBoxStyles extends IListStyles {
    readonly selectBackground: string | undefined;
    readonly selectListBackground: string | undefined;
    readonly selectForeground: string | undefined;
    readonly decoratorRightForeground: string | undefined;
    readonly selectBorder: string | undefined;
    readonly selectListBorder: string | undefined;
    readonly focusBorder: string | undefined;
}

export const unthemedSelectBoxStyles: ISelectBoxStyles = {
    ...unthemedListStyles,
    selectBackground: '#3C3C3C',
    selectForeground: '#F0F0F0',
    selectBorder: '#3C3C3C',
    decoratorRightForeground: undefined,
    selectListBackground: undefined,
    selectListBorder: undefined,
    focusBorder: undefined,
};

export interface ISelectData {
    selected: string;
    index: number;
}

export class SelectBox extends Widget implements ISelectBoxDelegate {
    private selectBoxDelegate: ISelectBoxDelegate;

    constructor(options: ISelectOptionItem[], selected: number, contextViewProvider: IContextViewProvider, styles: ISelectBoxStyles, selectBoxOptions?: ISelectBoxOptions) {
        super();

        // Default to native SelectBox for OSX unless overridden
        if (isMacintosh && !selectBoxOptions?.useCustomDrawn) {
            this.selectBoxDelegate = new SelectBoxNative(options, selected, styles, selectBoxOptions);
        } else {
            this.selectBoxDelegate = new SelectBoxList(options, selected, contextViewProvider, styles, selectBoxOptions);
        }

        this._register(this.selectBoxDelegate);
    }

    // Public SelectBox Methods - routed through delegate interface

    get onDidSelect(): Event<ISelectData> {
        return this.selectBoxDelegate.onDidSelect;
    }

    setOptions(options: ISelectOptionItem[], selected?: number): cognidream {
        this.selectBoxDelegate.setOptions(options, selected);
    }

    select(index: number): cognidream {
        this.selectBoxDelegate.select(index);
    }

    setAriaLabel(label: string): cognidream {
        this.selectBoxDelegate.setAriaLabel(label);
    }

    focus(): cognidream {
        this.selectBoxDelegate.focus();
    }

    blur(): cognidream {
        this.selectBoxDelegate.blur();
    }

    setFocusable(focusable: boolean): cognidream {
        this.selectBoxDelegate.setFocusable(focusable);
    }

    setEnabled(enabled: boolean): cognidream {
        this.selectBoxDelegate.setEnabled(enabled);
    }

    render(container: HTMLElement): cognidream {
        this.selectBoxDelegate.render(container);
    }
}
