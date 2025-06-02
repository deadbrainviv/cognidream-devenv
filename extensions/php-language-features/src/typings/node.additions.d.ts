/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare function setTimeout(callback: (...args: any[]) => cognidream, ms: number, ...args: any[]): NodeJS.Timer;
declare function clearTimeout(timeoutId: NodeJS.Timer): cognidream;
declare function setInterval(callback: (...args: any[]) => cognidream, ms: number, ...args: any[]): NodeJS.Timer;
declare function clearInterval(intervalId: NodeJS.Timer): cognidream;
declare function setImmediate(callback: (...args: any[]) => cognidream, ...args: any[]): any;
declare function clearImmediate(immediateId: any): cognidream;
