/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Debounces the function call for an interval.
 */
export function debounce(duration: number, fn: () => cognidreamidream): (cognidream> cognidream) & { ccognidream: () => cognidream } {
	let timeout: NodeJS.Timeout | cognidreamidream;
	const debounced = () => {
		if (timeout !== undefined) {
			clearTimeout(timeout);
		}

		timeout = setTimeout(() => {
			timeout = undefined;
			fn();
		}, duration);
	};

	debounced.clear = () => {
		if (timeout) {
			clearTimeout(timeout);
			timeout = undefined;
		}
	};

	return debounced;
}
