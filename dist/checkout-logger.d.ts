export declare enum LogGroup {
    Audit = "audit",
    Request = "request",
    Response = "response",
    Session = "session",
    Security = "security",
    Technical = "technical"
}
export declare enum LogLevel {
    Debug = "debug",
    Info = "info",
    Warning = "warning",
    Error = "error"
}
/**
 * LogSpan class that can be used to log certain spans. Provides X-Ray support.
 */
export declare class LogSpan {
    private readonly requestId;
    private readonly logLevels;
    /**
     * Constructor function for LogSpan. Marks down the start time for the span.
     * @param {string} requestId Request ID to log into the span.
     */
    constructor(requestId?: string);
    /**
     * Debug type log entry. Be aware of the fact that you should NEVER log any sensitive information.
     *
     * @param type What context is being logged.
     * @param message Message to display in log row.
     * @param group Logging group ('audit', 'request', 'response', 'session', 'security', 'technical').
     * @param user Who is being logged.
     * @param meta Meta information, can be any kind of JSON object that gets stringified into the context.
     */
    debug(type: string, message: string, group?: LogGroup, user?: string, meta?: any): void;
    /**
     * Warning type log entry. Be aware of the fact that you should NEVER log any sensitive information.
     *
     * @param type What context is being logged.
     * @param message Message to display in log row.
     * @param group Logging group ('audit', 'request', 'response', 'session', 'security', 'technical').
     * @param user Who is being logged.
     * @param meta Meta information, can be any kind of JSON object that gets stringified into the context.
     */
    warn(type: string, message: string, group: LogGroup, user?: string, meta?: any): void;
    /**
     * Info type log entry. Be aware of the fact that you should NEVER log any sensitive information.
     *
     * @param type What context is being logged.
     * @param message Message to display in log row.
     * @param group Logging group ('audit', 'request', 'response', 'session', 'security', 'technical').
     * @param user Who is being logged.
     * @param meta Meta information, can be any kind of JSON object that gets stringified into the context.
     */
    info(type: string, message: string, group: LogGroup, user?: string, meta?: any): void;
    /**
     * Error type log entry. Be aware of the fact that you should NEVER log any sensitive information.
     *
     * @param type What context is being logged.
     * @param message Message to display in log row.
     * @param group Logging group ('audit', 'request', 'response', 'session', 'security', 'technical').
     * @param user Who is being logged.
     * @param meta Meta information, can be any kind of JSON object that gets stringified into the context.
     */
    error(type: string, message: string, group: LogGroup, user?: string, meta?: any): void;
    /**
     * Manipulates the LogEntry into a well formatted log row.
     * @param entry Log entry object.
     */
    private output;
}
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
export declare const debug: LogFunction;
/**
 * Warning type log entry. Be aware of the fact that you should NEVER log any sensitive information.
 *
 * @param type What context is being logged.
 * @param message Message to display in log row.
 * @param group Logging group ('audit', 'request', 'response', 'session', 'security', 'technical').
 * @param user Who is being logged.
 * @param meta Meta information, can be any kind of JSON object that gets stringified into the context.
 */
export declare const warn: LogFunction;
/**
 * Info type log entry. Be aware of the fact that you should NEVER log any sensitive information.
 *
 * @param type What context is being logged.
 * @param message Message to display in log row.
 * @param group Logging group ('audit', 'request', 'response', 'session', 'security', 'technical').
 * @param user Who is being logged.
 * @param meta Meta information, can be any kind of JSON object that gets stringified into the context.
 */
export declare const info: LogFunction;
/**
 * Error type log entry. Be aware of the fact that you should NEVER log any sensitive information.
 *
 * @param type What context is being logged.
 * @param message Message to display in log row.
 * @param group Logging group ('audit', 'request', 'response', 'session', 'security', 'technical').
 * @param user Who is being logged.
 * @param meta Meta information, can be any kind of JSON object that gets stringified into the context.
 */
export declare const error: LogFunction;
