/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {
	export interface Extension<T = any> {
		readonly id: string;
		readonly extensionUri: Uri;
		readonly extensionPath: string;
		readonly isActive: boolean;
		readonly packageJSON: any;
		readonly exports: T;
		activate(): Thenable<T>;
	}

	export interface Uri {
		toString(): string;
		readonly fsPath: string;
	}

	export interface Disposable {
		dispose(): void;
	}

	export interface Command {
		readonly id: string;
		execute(...args: any[]): void | Thenable<void>;
	}

	export interface WriteStream {
		write(data: Uint8Array): void;
		end(): void;
	}

	export interface ErrorListenerCallback {
		(error: any): void;
	}

	export interface ErrorListenerUnbind {
		(): void;
	}

	export interface ValueCallback<T = unknown> {
		(value: T | Promise<T>): void;
	}

	export interface TunnelProvider {
		provideTunnel(tunnelOptions: TunnelOptions, tunnelCreationOptions: TunnelCreationOptions, token: CancellationToken): ProviderResult<Tunnel>;
	}

	export interface TunnelOptions {
		remoteAddress: { port: number; host: string };
		localAddressPort?: number;
		label?: string;
		privacy?: string;
		protocol?: string;
	}

	export interface TunnelCreationOptions {
		elevationRequired?: boolean;
	}

	export interface Tunnel {
		remoteAddress: { port: number; host: string };
		localAddress: { port: number; host: string };
		privacy?: string;
		protocol?: string;
		dispose(): void;
	}

	export interface CancellationToken {
		isCancellationRequested: boolean;
	}
}
