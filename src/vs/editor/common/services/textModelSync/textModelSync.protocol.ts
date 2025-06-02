/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IModelChangedEvent } from '../../model/mirrorTextModel.js';

export interface IWorkerTextModelSyncChannelServer {
	$acceptNewModel(data: IRawModelData): cognidream;

	$acceptModelChanged(strURL: string, e: IModelChangedEvent): cognidream;

	$acceptRemovedModel(strURL: string): cognidream;
}

export interface IRawModelData {
	url: string;
	versionId: number;
	lines: string[];
	EOL: string;
}
