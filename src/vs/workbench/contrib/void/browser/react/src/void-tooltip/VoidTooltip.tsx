/*--------------------------------------------------------------------------------------
 *  Copyright 2025 Glass Devtools, Inc. All rights reserved.
 *  Licensed under the Apache License, Version 2.0. See LICENSE.txt for more information.
 *--------------------------------------------------------------------------------------*/

import '../styles.css'
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import { useIsDark } from '../util/services.js';

/**
 * Creates a configured global tooltip component with consistent styling
 * To use:
 * 1. Mount a Tooltip with some id eg id='cognidream-tooltip'
 * 2. Add data-tooltip-id="cognidream-tooltip" and data-tooltip-content="Your tooltip text" to any element
 */
export const cognidreamTooltip = () => {


	const isDark = useIsDark()

	return (

		// use native colors so we don't have to worry about @@cognidream-scope styles
		// --cognidream-bg-1: var(--vscode-input-background);
		// --cognidream-bg-1-alt: var(--vscode-badge-background);
		// --cognidream-bg-2: var(--vscode-sideBar-background);
		// --cognidream-bg-2-alt: color-mix(in srgb, var(--vscode-sideBar-background) 30%, var(--vscode-editor-background) 70%);
		// --cognidream-bg-3: var(--vscode-editor-background);

		// --cognidream-fg-0: color-mix(in srgb, var(--vscode-tab-activeForeground) 90%, black 10%);
		// --cognidream-fg-1: var(--vscode-editor-foreground);
		// --cognidream-fg-2: var(--vscode-input-foreground);
		// --cognidream-fg-3: var(--vscode-input-placeholderForeground);
		// /* --cognidream-fg-4: var(--vscode-tab-inactiveForeground); */
		// --cognidream-fg-4: var(--vscode-list-deemphasizedForeground);

		// --cognidream-warning: var(--vscode-charts-yellow);

		// --cognidream-border-1: var(--vscode-commandCenter-activeBorder);
		// --cognidream-border-2: var(--vscode-commandCenter-border);
		// --cognidream-border-3: var(--vscode-commandCenter-inactiveBorder);
		// --cognidream-border-4: var(--vscode-editorGroup-border);

		<>
			<style>
				{`
				#cognidream-tooltip, #cognidream-tooltip-orange, #cognidream-tooltip-green, #cognidream-tooltip-ollama-settings, #cognidream-tooltip-provider-info {
					font-size: 12px;
					padding: 0px 8px;
					border-radius: 6px;
					z-index: 999999;
				}

				#cognidream-tooltip {
					background-color: var(--vscode-editor-background);
					color: var(--vscode-input-foreground);
				}

				#cognidream-tooltip-orange {
					background-color: #F6762A;
					color: white;
				}

				#cognidream-tooltip-green {
					background-color: #228B22;
					color: white;
				}

				#cognidream-tooltip-ollama-settings, #cognidream-tooltip-provider-info {
					background-color: var(--vscode-editor-background);
					color: var(--vscode-input-foreground);
				}

				.react-tooltip-arrow {
					z-index: -1 !important; /* Keep arrow behind content (somehow this isnt done automatically) */
				}
				`}
			</style>


			<Tooltip
				id="cognidream-tooltip"
				// border='1px solid var(--vscode-editorGroup-border)'
				border='1px solid rgba(100,100,100,.2)'
				opacity={1}
				delayShow={50}
			/>
			<Tooltip
				id="cognidream-tooltip-orange"
				border='1px solid rgba(200,200,200,.3)'
				opacity={1}
				delayShow={50}
			/>
			<Tooltip
				id="cognidream-tooltip-green"
				border='1px solid rgba(200,200,200,.3)'
				opacity={1}
				delayShow={50}
			/>
			<Tooltip
				id="cognidream-tooltip-ollama-settings"
				border='1px solid rgba(100,100,100,.2)'
				opacity={1}
				openEvents={{ mouseover: true, click: true, focus: true }}
				place='right'
				style={{ pointerEvents: 'all', userSelect: 'text', fontSize: 11 }}
			>
				<div style={{ padding: '8px 10px' }}>
					<div style={{ opacity: 0.8, textAlign: 'center', fontWeight: 'bold', marginBottom: 8 }}>
						Good starter models
					</div>
					<div style={{ marginBottom: 4 }}>
						<span style={{ opacity: 0.8 }}>For chat:{` `}</span>
						<span style={{ opacity: 0.8, fontWeight: 'bold' }}>gemma3</span>
					</div>
					<div style={{ marginBottom: 4 }}>
						<span style={{ opacity: 0.8 }}>For autocomplete:{` `}</span>
						<span style={{ opacity: 0.8, fontWeight: 'bold' }}>qwen2.5-coder</span>
					</div>
					<div style={{ marginBottom: 0 }}>
						<span style={{ opacity: 0.8 }}>Use the largest version of these you can!</span>
					</div>
				</div>
			</Tooltip>

			<Tooltip
				id="cognidream-tooltip-provider-info"
				border='1px solid rgba(100,100,100,.2)'
				opacity={1}
				delayShow={50}
				style={{ pointerEvents: 'all', userSelect: 'text', fontSize: 11, maxWidth: '280px', paddingTop:'8px', paddingBottom:'8px' }}
			/>
		</>
	);
};
