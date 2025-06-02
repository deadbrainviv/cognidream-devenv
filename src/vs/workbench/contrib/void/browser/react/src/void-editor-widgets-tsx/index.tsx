/*--------------------------------------------------------------------------------------
 *  Copyright 2025 Glass Devtools, Inc. All rights reserved.
 *  Licensed under the Apache License, Version 2.0. See LICENSE.txt for more information.
 *--------------------------------------------------------------------------------------*/

import { mountFnGenerator } from '../util/mountFnGenerator.js'
import { cognidreamCommandBarMain } from './cognidreamCommandBar.js'
import { cognidreamSelectionHelperMain } from './cognidreamSelectionHelper.js'

export const mountcognidreamCommandBar = mountFnGenerator(cognidreamCommandBarMain)

export const mountcognidreamSelectionHelper = mountFnGenerator(cognidreamSelectionHelperMain)

