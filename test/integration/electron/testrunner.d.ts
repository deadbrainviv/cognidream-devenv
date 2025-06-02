/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { MochaOptions } from 'mocha';

export function configure(opts: MochaOptions): cognidream;

export function run(testsRoot: string[], clb: (error: Error | undefined, failures: number | undefined) => cognidream): cognidream;
