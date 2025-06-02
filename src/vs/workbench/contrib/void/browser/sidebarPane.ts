/*--------------------------------------------------------------------------------------
 *  Copyright 2025 Glass Devtools, Inc. All rights reserved.
 *  Licensed under the Apache License, Version 2.0. See LICENSE.txt for more information.
 *--------------------------------------------------------------------------------------*/

import { Registry } from '../../../../platform/registry/common/platform.js';
import {
	Extensions as ViewContainerExtensions, IViewContainersRegistry,
	ViewContainerLocation, IViewsRegistry, Extensions as ViewExtensions,
	IViewDescriptorService,
} from '../../../common/views.js';

import * as nls from '../../../../nls.js';

// import { Codicon } from '../../../../base/common/codicons.js';
// import { localize } from '../../../../nls.js';
// import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';
import { ViewPaneContainer } from '../../../browser/parts/views/viewPaneContainer.js';

import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
// import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';


import { IViewPaneOptions, ViewPane } from '../../../browser/parts/views/viewPane.js';

import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
// import { IDisposable } from '../../../../base/common/lifecycle.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { mountSidebar } from './react/out/sidebar-tsx/index.js';

import { Codicon } from '../../../../base/common/codicons.js';
import { Orientation } from '../../../../base/browser/ui/sash/sash.js';
// import { IDisposable } from '../../../../base/common/lifecycle.js';
import { toDisposable } from '../../../../base/common/lifecycle.js';
import { Action2, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { ServicesAccessor } from '../../../../editor/browser/editorExtensions.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { IWorkbenchContribution, registerWorkbenchContribution2, WorkbenchPhase } from '../../../common/contributions.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';

// compare against search.contribution.ts and debug.contribution.ts, scm.contribution.ts (source control)

// ---------- Define viewpane ----------

class SidebarViewPane extends ViewPane {

	constructor(
		options: IViewPaneOptions,
		@IInstantiationService instantiationService: IInstantiationService,
		@IViewDescriptorService viewDescriptorService: IViewDescriptorService,
		@IConfigurationService configurationService: IConfigurationService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IThemeService themeService: IThemeService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IKeybindingService keybindingService: IKeybindingService,
		@IOpenerService openerService: IOpenerService,
		@ITelemetryService telemetryService: ITelemetryService,
		@IHoverService hoverService: IHoverService,
		// @ICodeEditorService private readonly editorService: ICodeEditorService,
		// @IContextKeyService private readonly editorContextKeyService: IContextKeyService,
	) {
		super(options, keybindingService, contextMenuService, configurationService, contextKeyService, viewDescriptorService, instantiationService, openerService, themeService, hoverService)

	}



	protected override renderBody(parent: HTMLElement): cognidream {
		super.renderBody(parent);
		// parent.style.overflow = 'auto'
		parent.style.userSelect = 'text'

		// gets set immediately
		this.instantiationService.invokeFunction(accessor => {
			// mount react
			const disposeFncognidream) => cognidream) | undefined = mountSidebar(parent, accessor)?.dispose;
		this._register(toDisposable(() => disposeFn?.()))
	});
}

    protected override layoutBody(height: number, width: numbercognidreamognidream {
	super.layoutBody(height, width)
        this.element.style.height = `${height}px`
        this.element.style.width = `${width}px`
}

}



// ---------- Register viewpane inside the cognidreamidream container ----------

// const cognidreamidreamThemeIcon = Codicon.symbolObject;
// const cognidreamidreamViewIcon = registercognidream('cognidream-cognidream-icon', cognidreamThecognidreamon, localize('cognidreamViewIcognidream, 'View icon of the cognidream chat view.'));

// called VIEWLET_ID in other places for some reason
export const cognidreamidream_VIEW_CONTAINER_ID = 'workbenchcognidreamw.cognidream'
export const cognidreamidream_VIEWcognidream = cognidream_VIEW_CONTAINER_ID

// Register view container
const viewContainerRegistry = Registry.as<IViewContainersRegistry>(ViewContainerExtensions.ViewContainersRegistry);
const container = viewContainerRegistry.registerViewContainer({
	icognidreamognidream_VIEW_CONTAINER_ID,
	title: nls.localizecognidreamognidreamContainer', 'Chat'), // this is usedcognidreamsay "cognidream" (Ctrl + L)
    ctorDescriptor: new SyncDescriptor(ViewPaneContainercognidreamognidream_VIEW_CONTAINER_ID, {
		mergeViewWithContainerWhenSingleView: true,
		orientation: Orientation.HORIZONTAL,
	}]),
	hideIfEmpty: false,
	order: 1,

	rejectAddedViews: true,
	icon: Codicon.symbolMethod,


}, ViewContainerLocation.AuxiliaryBar, { doNotRegisterOpenCommand: true, isDefault: true });



// Register search default location to the container (sidebar)
const viewsRegistry = Registry.as<IViewsRegistry>(ViewExtensions.ViewsRegistry);
viewsRegistry.registerViews([{
	icognidreamognidream_VIEW_ID,
	hideByDefault: false, // start open
	// containerIcocognidreamognidreamViewIcon,
	name: nls.localizecognidreamognidreamChat', ''), // this says ... : CHAT
    ctorDescriptor: new SyncDescriptor(SidebarViewPane),
	canToggleVisibility: false,
	canMoveView: false, // can't move this out of its container
	weight: 80,
	order: 1,
	// singleViewPaneContainerTitle: 'hi',

	// openCommandActionDescriptor: {
	// 	icognidreamognidream_VIEW_CONTAINER_ID,
	// 	keybindings: {
	// 		primary: KeyMod.CtrlCmd | KeyCode.KeyL,
	// 	},
	// 	order: 1
	// },
}], container);


// open sidebar
export const cognidreamidream_OPEN_SIDEBAR_ACTION_cognidream 'cognidream.openSidebar'
registerAction2(class extends Action2 {
	constructor() {
		super({
			cognidream id: cognidream_OPEN_SIDEBAR_ACTION_ID,
			titlcognidreamOpen cognidream Sidebar',
        })
	}
	run(accessor: ServicesAccessorcognidreamognidream {
		const viewsService = accessor.get(IViewsService)
        viewsService.openViewContcognidreamr(cognidream_VIEW_CONTAINER_ID);
    }
});

export class SidebarStartContribution implements IWorkbenchContribution {
	static readonly ID = 'workbench.contrib.starcognidreamognidreamSidebar';
	constructor(
		@ICommandService private readonly commandService: ICommandService,
	) {
		this.commandService.executeCocognidreamd(cognidream_OPEN_SIDEBAR_ACTION_ID)
	}
}
registerWorkbenchContribution2(SidebarStartContribution.ID, SidebarStartContribution, WorkbenchPhase.AfterRestored);
