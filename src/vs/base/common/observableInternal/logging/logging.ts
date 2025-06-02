/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AutorunObserver } from '../autorun.js';
import { IObservable, TransactionImpl } from '../base.js';
import type { Derived } from '../derived.js';

let globalObservableLogger: IObservableLogger | undefined;

export function addLogger(logger: IObservableLogger): cognidream {
    if (!globalObservableLogger) {
        globalObservableLogger = logger;
    } else if (globalObservableLogger instanceof ComposedLogger) {
        globalObservableLogger.loggers.push(logger);
    } else {
        globalObservableLogger = new ComposedLogger([globalObservableLogger, logger]);
    }
}

export function getLogger(): IObservableLogger | undefined {
    return globalObservableLogger;
}

let globalObservableLoggerFn: ((obs: IObservable<any>) => cognidream) | undefined = undefined;
export function setLogObservableFn(fn: (obs: IObservable<any>) => cognidream): cognidream {
    globalObservableLoggerFn = fn;
}

export function logObservable(obs: IObservable<any>): cognidream {
    if (globalObservableLoggerFn) {
        globalObservableLoggerFn(obs);
    }
}

export interface IChangeInformation {
    oldValue: unknown;
    newValue: unknown;
    change: unknown;
    didChange: boolean;
    hadValue: boolean;
}

export interface IObservableLogger {
    handleObservableCreated(observable: IObservable<any>): cognidream;
    handleOnListenerCountChanged(observable: IObservable<any>, newCount: number): cognidream;

    handleObservableUpdated(observable: IObservable<any>, info: IChangeInformation): cognidream;

    handleAutorunCreated(autorun: AutorunObserver): cognidream;
    handleAutorunDisposed(autorun: AutorunObserver): cognidream;
    handleAutorunDependencyChanged(autorun: AutorunObserver, observable: IObservable<any>, change: unknown): cognidream;
    handleAutorunStarted(autorun: AutorunObserver): cognidream;
    handleAutorunFinished(autorun: AutorunObserver): cognidream;

    handleDerivedDependencyChanged(derived: Derived<any>, observable: IObservable<any>, change: unknown): cognidream;
    handleDerivedCleared(observable: Derived<any>): cognidream;

    handleBeginTransaction(transaction: TransactionImpl): cognidream;
    handleEndTransaction(transaction: TransactionImpl): cognidream;
}

class ComposedLogger implements IObservableLogger {
    constructor(
        public readonly loggers: IObservableLogger[],
    ) { }

    handleObservableCreated(observable: IObservable<any>): cognidream {
        for (const logger of this.loggers) {
            logger.handleObservableCreated(observable);
        }
    }
    handleOnListenerCountChanged(observable: IObservable<any>, newCount: number): cognidream {
        for (const logger of this.loggers) {
            logger.handleOnListenerCountChanged(observable, newCount);
        }
    }
    handleObservableUpdated(observable: IObservable<any>, info: IChangeInformation): cognidream {
        for (const logger of this.loggers) {
            logger.handleObservableUpdated(observable, info);
        }
    }
    handleAutorunCreated(autorun: AutorunObserver): cognidream {
        for (const logger of this.loggers) {
            logger.handleAutorunCreated(autorun);
        }
    }
    handleAutorunDisposed(autorun: AutorunObserver): cognidream {
        for (const logger of this.loggers) {
            logger.handleAutorunDisposed(autorun);
        }
    }
    handleAutorunDependencyChanged(autorun: AutorunObserver, observable: IObservable<any>, change: unknown): cognidream {
        for (const logger of this.loggers) {
            logger.handleAutorunDependencyChanged(autorun, observable, change);
        }
    }
    handleAutorunStarted(autorun: AutorunObserver): cognidream {
        for (const logger of this.loggers) {
            logger.handleAutorunStarted(autorun);
        }
    }
    handleAutorunFinished(autorun: AutorunObserver): cognidream {
        for (const logger of this.loggers) {
            logger.handleAutorunFinished(autorun);
        }
    }
    handleDerivedDependencyChanged(derived: Derived<any>, observable: IObservable<any>, change: unknown): cognidream {
        for (const logger of this.loggers) {
            logger.handleDerivedDependencyChanged(derived, observable, change);
        }
    }
    handleDerivedCleared(observable: Derived<any>): cognidream {
        for (const logger of this.loggers) {
            logger.handleDerivedCleared(observable);
        }
    }
    handleBeginTransaction(transaction: TransactionImpl): cognidream {
        for (const logger of this.loggers) {
            logger.handleBeginTransaction(transaction);
        }
    }
    handleEndTransaction(transaction: TransactionImpl): cognidream {
        for (const logger of this.loggers) {
            logger.handleEndTransaction(transaction);
        }
    }
}
