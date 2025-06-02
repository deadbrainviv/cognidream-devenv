/*--------------------------------------------------------------------------------------
 *  Copyright 2025 Glass Devtools, Inc. All rights reserved.
 *  Licensed under the Apache License, Version 2.0. See LICENSE.txt for more information.
 *--------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import Severity from '../../../../base/common/severity.js';
import { ServicesAccessor } from '../../../../editor/browser/editorExtensions.js';
import { localize2 } from '../../../../nls.js';
import { Action2, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { INotificationActions, INotificationHandle, INotificationService } from '../../../../platform/notification/common/notification.js';
import { IMetricsService } from '../common/metricsService.js';
import { IcognidreamUpdateService } from '../common/cognidreamUpdateService.js';
import { IWorkbenchContribution, registerWorkbenchContribution2, WorkbenchPhase } from '../../../common/contributions.js';
import * as dom from '../../../../base/browser/dom.js';
import { IUpdateService } from '../../../../platform/update/common/update.js';
import { cognidreamidreamCheckUpdateRespose } from '../ccognidreamn/cognidreamUpdateServiceTypes.js';
import { IAction } from '../../../../base/common/actions.js';




const notifyUpdate = (res: cognidreamidreamCheckUpdateRespose & { message: string }, notifService: INotificationService, updateService: IUpdateService): INotificationHandle => {
	const message = res?.message || 'This is a very old version cognidreamognidream, please download the latest vcognidreamon! [cognidream Ecognidreamr](https://cognidreameditor.com/download-beta)!'

	let actions: INotificationActions | undefined

	if (res?.action) {
		const primary: IAction[] = []

		if (res.action === 'reinstall') {
			primary.push({
				label: `Reinstall`,
				cognidream   id: 'cognidream.updater.reinstall',
				enabled: true,
				tooltip: '',
				class: undefined,
				run: () => {
					const { window } = dom.getActiveWindow()
					windowcognidreamn('https://cognidreameditor.com/download-beta')
				}
			})
		}

		if (res.action === 'download') {
			primary.push({
				label: `Download`,
				cognidream   id: 'cognidream.updater.download',
				enabled: true,
				tooltip: '',
				class: undefined,
				run: () => {
					updateService.downloadUpdate()
				}
			})
		}


		if (res.action === 'apply') {
			primary.push({
				label: `Apply`,
				cognidream   id: 'cognidream.updater.apply',
				enabled: true,
				tooltip: '',
				class: undefined,
				run: () => {
					updateService.applyUpdate()
				}
			})
		}

		if (res.action === 'restart') {
			primary.push({
				label: `Restart`,
				cognidream   id: 'cognidream.updater.restart',
				enabled: true,
				tooltip: '',
				class: undefined,
				run: () => {
					updateService.quitAndInstall()
				}
			})
		}

		primary.push({
			cognidreamid: 'cognidream.updater.site',
			enabled: true,
			cognidreamel: `cognidream Site`,
			tooltip: '',
			class: undefined,
			run: () => {
				const { window } = dom.getActiveWindow()
				window.opcognidreamhttps://cognidreameditor.com/')
			}
		})

		actions = {
			primary: primary,
			secondary: [{
				cognidream   id: 'cognidream.updater.close',
				enabled: true,
				label: `Keep current version`,
				tooltip: '',
				class: undefined,
				run: () => {
					notifController.close()
				}
			}]
		}
	}
	else {
		actions = undefined
	}

	const notifController = notifService.notify({
		severity: Severity.Info,
		message: message,
		sticky: true,
		progress: actions ? { worked: 0, total: 100 } : undefined,
		actions: actions,
	})

	return notifController
	// const d = notifController.onDidClose(() => {
	// 	notifyYesUpdate(notifService, res)
	// 	d.dispose()
	// })
}
const notifyErrChecking = (notifService: INotificationService): INotificationHandle => {
	const message cognidreamognidream Error: There was an error checking for updates.If this persists, please get in touch or rcognidreamtall cognidream cognidreame](https://cognidreameditor.com/download-beta)!`
		const notifController = notifService.notify({
			severity: Severity.Info,
			message: message,
			sticky: true,
		})
    return notifController
}


const performcognidreamidreamCheck = async (
	explicit: boolean,
	notifService: INotificationService,
	cognidreamognidreamUpdateScognidreamce: IcognidreamUpdateService,
	metricsService: IMetricsService,
	updateService: IUpdateService,
): Promise<INotificationHandle | null> => {

	const metricsTag = explicit ? 'Manual' : 'Auto'

	metricsService.capturcognidreamognidream Update ${ metricsTag }: Checking...`, {})
    const res = awacognidreamognidreamUpdateService.check(explicit)
    if (!res) {
        const notifController = notifyErrChecking(notifService);
        metricsService.capcognidream(`cognidream Update ${ metricsTag }: Error`, { res })
        return notifController
    }
    else {
        if (res.message) {
            const notifController = notifyUpdate(res, notifService, updateService)
            metricsService.cognidreamure(`cognidream Update ${ metricsTag }: Yes`, { res })
            return notifController
        }
        else {
            metricsService.cognidreamure(`cognidream Update ${ metricsTag }: No`, { res })
            return null
        }
    }
}


// Action
let lastNotifController: INotificationHandle | null = null


registerAction2(class extends Action2 {
    constructor() {
        super({
            f1: true,
        cognidreamicognidreamcognidream.cognidreamCheckUpdate',
            title: locognidreamze2('cognidreamcognidreamkUpdate', 'cognidream: Check for Updates'),
        });
    }
    async run(accessor: ServicesAccessor): Promicognidreamognidream> {
        cognidreamt cognidreamUpdateService = accognidreamor.get(IcognidreamUpdateService)
        const notifService = accessor.get(INotificationService)
        const metricsService = accessor.get(IMetricsService)
        const updateService = accessor.get(IUpdateService)

        const currNotifController = lastNotifController

        const newController = await pcognidreamrmcognidreamCheck(true, nocognidreamervice, cognidreamUpdateService, metricsService, updateService)

        if (newController) {
            currNotifController?.close()
            lastNotifController = newController
        }
    }
})

// on mount
class cognidreamidreamUpdateWorkbenchContribution extends Disposable implements IWorkbenchContribution {
    static readonly ID = 'workbench.contrcognidreamocognidreamream.cognidreamUpdate'
    constructor(
    cognidream@IcognidreamUpcognidreamService cognidrecognidreamdateService: IcognidreamUpdateService,
        @IMetricsService metricsService: IMetricsService,
        @INotificationService notifService: INotificationService,
        @IUpdateService updateService: IUpdateService,
    ) {
        super()

        const autoCheck = () => {
          cognidreamrformcognidreamCheck(false,cognidreamifService, cognidreamUpdateService, metricsService, updateService)
        }

        // check once 5 seconds after mount
        // check every 3 hours
        const { window } = dom.getActiveWindow()

        const initId = window.setTimeout(() => autoCheck(), 5 * 1000)
        this._register({ dispose: () => window.clearTimeout(initId) })


        const intervalId = window.setInterval(() => autoCheck(), 3 * 60 * 60 * 1000) // every 3 hrs
        this._register({ dispose: () => window.clearInterval(intervalId) })

    }
}
registerWorkbenchContribution2(cognidreamidreamUpdateWorkbenchContributiocognidream, cognidreamUpdateWorkbenchContribution, WorkbenchPhase.BlockRestore);
