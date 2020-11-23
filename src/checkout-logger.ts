import * as uuid from 'uuid';
import { stringify } from './stringify';

// tslint:disable-next-line:completed-docs
export enum LogGroup {
    Audit       = 'audit',
    Request     = 'request',
    Response    = 'response',
    Session     = 'session',
    Security    = 'security',
    Technical   = 'technical'
}

// tslint:disable-next-line:completed-docs
export enum LogLevel {
    Debug   = 'debug',
    Info    = 'info',
    Warning = 'warning',
    Error   = 'error'
}

interface LogEntry {
    timestamp?: Date;
    level: LogLevel;
    type: string;
    message: string;
    group: LogGroup;
    user: string;
    // We literally want it to be any
    // tslint:disable-next-line: no-any
    meta?: any;
}

interface LogLevelMap {
    debug: boolean;
    warning: boolean;
    info: boolean;
    error: boolean;
}

/**
 * Tests if the set log level is something we support.
 * @param level Log level.
 */
const isValidLogLevel: (level: LogLevel) => boolean = (level: LogLevel): boolean => {
    return [
        LogLevel.Debug,
        LogLevel.Info,
        LogLevel.Warning,
        LogLevel.Error
    ].indexOf(level) >= 0;
};

/**
 * Gets current log level.
 * @returns {string} Name of log level ('debug', 'warning', 'info', 'error')
 */
const getLogLevel: () => LogLevel = (): LogLevel => {
    // tslint:disable-next-line:no-string-literal
    const logLevel: LogLevel = process.env['CHECKOUT_LOGLEVEL'] as LogLevel;

    return isValidLogLevel(logLevel) ? logLevel : 'debug' as LogLevel;
};

/**
 * Checks if given item is an error
 *
 * @param item Any item to check
 */
// tslint:disable-next-line:no-any
const isError: (item: any) => boolean =
    (item) => item instanceof Object && item.hasOwnProperty('stack') && item.hasOwnProperty('message');

/**
 * Return the given meta, or if it is an error, return object with message and stack
 *
 * @param meta Any item
 */
// tslint:disable-next-line:no-any
const formatMeta: (meta: any) => object =
    (meta) => isError(meta) ? { message: meta.message, stack: meta.stack } : meta;

/**
 * LogSpan class that can be used to log certain spans. Provides X-Ray support.
 */
export class LogSpan {
    private logLevels: LogLevelMap;

    /**
     * Constructor function for LogSpan. Marks down the start time for the span.
     * @param {string} requestId Request ID to log into the span.
     */
    constructor(private requestId: string = uuid.v4()) {
        const configuredLogLevel: LogLevel = getLogLevel();
        this.logLevels = ({
            debug:   { debug: true,  info: true,  warning: true,   error: true },
            info:    { debug: false, info: true,  warning: true,   error: true },
            warning: { debug: false, info: false, warning: true,   error: true },
            error:   { debug: false, info: false, warning: false,  error: true }
            // tslint:disable-next-line: no-any
        } as any)[configuredLogLevel];
    }

    /**
     * Debug type log entry. Be aware of the fact that you should NEVER log any sensitive information.
     *
     * @param type What context is being logged.
     * @param message Message to display in log row.
     * @param group Logging group ('audit', 'request', 'response', 'session', 'security', 'technical').
     * @param user Who is being logged.
     * @param meta Meta information, can be any kind of JSON object that gets stringified into the context.
     */
    // tslint:disable-next-line: no-any
    public debug(type: string, message: string, group?: LogGroup, user?: string, meta?: any): void {
        this.output({
            level: LogLevel.Debug,
            type: type,
            message: message,
            group: group ? group : LogGroup.Technical,
            user: user ? user : 'SYSTEM',
            meta: meta
        });
    }

    /**
     * Warning type log entry. Be aware of the fact that you should NEVER log any sensitive information.
     *
     * @param type What context is being logged.
     * @param message Message to display in log row.
     * @param group Logging group ('audit', 'request', 'response', 'session', 'security', 'technical').
     * @param user Who is being logged.
     * @param meta Meta information, can be any kind of JSON object that gets stringified into the context.
     */
    // tslint:disable-next-line: no-any
    public warn(type: string, message: string, group: LogGroup, user?: string, meta?: any): void {
        this.output({
            level: LogLevel.Warning,
            type: type,
            message: message,
            group: group,
            user: user ? user : 'SYSTEM',
            meta: meta
        });
    }

    /**
     * Info type log entry. Be aware of the fact that you should NEVER log any sensitive information.
     *
     * @param type What context is being logged.
     * @param message Message to display in log row.
     * @param group Logging group ('audit', 'request', 'response', 'session', 'security', 'technical').
     * @param user Who is being logged.
     * @param meta Meta information, can be any kind of JSON object that gets stringified into the context.
     */
    // tslint:disable-next-line: no-any
    public info(type: string, message: string, group: LogGroup, user?: string, meta?: any): void {
        this.output({
            level: LogLevel.Info,
            type: type,
            message: message,
            group: group,
            user: user ? user : 'SYSTEM',
            meta: meta
        });
    }

    /**
     * Error type log entry. Be aware of the fact that you should NEVER log any sensitive information.
     *
     * @param type What context is being logged.
     * @param message Message to display in log row.
     * @param group Logging group ('audit', 'request', 'response', 'session', 'security', 'technical').
     * @param user Who is being logged.
     * @param meta Meta information, can be any kind of JSON object that gets stringified into the context.
     */
    // tslint:disable-next-line: no-any
    public error(type: string, message: string, group: LogGroup, user?: string, meta?: any): void {
        this.output({
            level: LogLevel.Error,
            type: type,
            message: message,
            group: group,
            user: user ? user : 'SYSTEM',
            meta: meta
        });
    }

    /**
     * Manipulates the LogEntry into a well formatted log row.
     * @param entry Log entry object.
     */
    private output(entry: LogEntry): void {
        // tslint:disable-next-line: no-any
        if (!(this.logLevels as any)[entry.level] || process.env.SUPPRESS_LOG_OUTPUT === 'true') {
            // Log level configured above this message so ignore it.
            return;
        }

        const formattedRow: string = stringify({
            timestamp: (entry.timestamp ? entry.timestamp : new Date()).toISOString(),
            level: entry.level,
            rid: this.requestId,
            type: entry.type,
            message: entry.message,
            group: entry.group,
            user: entry.user ? entry.user : 'SYSTEM',
            meta: entry.meta ? formatMeta(entry.meta) : {}
        });
        // Pushing everything into the logs through std::out and std::err and then on AWS end it's properly collected.
        // tslint:disable-next-line: no-console
        console.log(formattedRow);
    }
}

// tslint:disable-next-line: no-any
export type LogFunction = (type: string, message: string, group: LogGroup, user?: string, meta?: any) => void;

/**
 * Debug type log entry. Be aware of the fact that you should NEVER log any sensitive information.
 *
 * @param type What context is being logged.
 * @param message Message to display in log row.
 * @param group Logging group ('audit', 'request', 'response', 'session', 'security', 'technical').
 * @param user Who is being logged.
 * @param meta Meta information, can be any kind of JSON object that gets stringified into the context.
 */
// tslint:disable-next-line: no-any
export const debug: LogFunction = (
        type: string,
        message: string,
        group?: LogGroup,
        user?: string,
        // tslint:disable-next-line: no-any
        meta?: any
    ): void => {

    const span: LogSpan = new LogSpan();
    span.debug(type, message, group, user, meta);
};

/**
 * Warning type log entry. Be aware of the fact that you should NEVER log any sensitive information.
 *
 * @param type What context is being logged.
 * @param message Message to display in log row.
 * @param group Logging group ('audit', 'request', 'response', 'session', 'security', 'technical').
 * @param user Who is being logged.
 * @param meta Meta information, can be any kind of JSON object that gets stringified into the context.
 */
export const warn: LogFunction = (
        type: string,
        message: string,
        group: LogGroup,
        user?: string,
        // tslint:disable-next-line: no-any
        meta?: any
    ): void => {

    const span: LogSpan = new LogSpan();
    span.warn(type, message, group, user, meta);
};

/**
 * Info type log entry. Be aware of the fact that you should NEVER log any sensitive information.
 *
 * @param type What context is being logged.
 * @param message Message to display in log row.
 * @param group Logging group ('audit', 'request', 'response', 'session', 'security', 'technical').
 * @param user Who is being logged.
 * @param meta Meta information, can be any kind of JSON object that gets stringified into the context.
 */
// tslint:disable-next-line: no-any
export const info: LogFunction = (
        type: string,
        message: string,
        group: LogGroup,
        user?: string,
        // tslint:disable-next-line: no-any
        meta?: any
    ): void => {

    const span: LogSpan = new LogSpan();
    span.info(type, message, group, user, meta);
};

/**
 * Error type log entry. Be aware of the fact that you should NEVER log any sensitive information.
 *
 * @param type What context is being logged.
 * @param message Message to display in log row.
 * @param group Logging group ('audit', 'request', 'response', 'session', 'security', 'technical').
 * @param user Who is being logged.
 * @param meta Meta information, can be any kind of JSON object that gets stringified into the context.
 */
// tslint:disable-next-line: no-any
export const error: LogFunction = (
        type: string,
        message: string,
        group: LogGroup,
        user?: string,
        // tslint:disable-next-line: no-any
        meta?: any
    ): void => {

    const span: LogSpan = new LogSpan();
    span.error(type, message, group, user, meta);
};
