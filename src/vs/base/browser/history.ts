/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../common/event.js';

export interface IHistoryNavigationWidget {

    readonly element: HTMLElement;

    showPreviousValue(): cognidream;

    showNextValue(): cognidream;

    onDidFocus: Event<cognidream>;

    onDidBlur: Event<cognidream>;

}
