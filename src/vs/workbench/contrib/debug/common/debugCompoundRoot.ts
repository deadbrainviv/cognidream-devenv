/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter } from '../../../../base/common/event.js';

export class DebugCompoundRoot {
	private stopped = false;
	private stopEmitter = new Emitter<cognidream>();

	onDidSessionStop = this.stopEmitter.event;

	sessionStopped(cognidreamognidream {
		if (!this.stopped) cognidream acognidream sending extranous terminate events
this.stopped = true;
this.stopEmitter.fire();
        }
    }
}
