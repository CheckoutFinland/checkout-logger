"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.error = exports.info = exports.warn = exports.debug = exports.LogSpan = exports.LogLevel = exports.LogGroup = void 0;
const uuid = require("uuid");
const stringify_1 = require("./stringify");
var LogGroup;
(function (LogGroup) {
    LogGroup["Audit"] = "audit";
    LogGroup["Request"] = "request";
    LogGroup["Response"] = "response";
    LogGroup["Session"] = "session";
    LogGroup["Security"] = "security";
    LogGroup["Technical"] = "technical";
})(LogGroup || (exports.LogGroup = LogGroup = {}));
var LogLevel;
(function (LogLevel) {
    LogLevel["Debug"] = "debug";
    LogLevel["Info"] = "info";
    LogLevel["Warning"] = "warning";
    LogLevel["Error"] = "error";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
/**
 * Tests if the set log level is something we support.
 * @param level Log level.
 */
const isValidLogLevel = (level) => {
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
const getLogLevel = () => {
    const logLevel = process.env['CHECKOUT_LOGLEVEL'];
    return isValidLogLevel(logLevel) ? logLevel : 'debug';
};
/**
 * Checks if given item is an error
 *
 * @param item Any item to check
 */
const isError = 
// eslint-disable-next-line no-prototype-builtins
(item) => item instanceof Object && item.hasOwnProperty('stack') && item.hasOwnProperty('message');
/**
 * Return the given meta, or if it is an error, return object with message and stack
 *
 * @param meta Any item
 */
const formatMeta = (meta) => isError(meta) ? { message: meta.message, stack: meta.stack } : meta;
/**
 * LogSpan class that can be used to log certain spans. Provides X-Ray support.
 */
class LogSpan {
    /**
     * Constructor function for LogSpan. Marks down the start time for the span.
     * @param {string} requestId Request ID to log into the span.
     */
    constructor(requestId = uuid.v4()) {
        this.requestId = requestId;
        const configuredLogLevel = getLogLevel();
        this.logLevels = {
            debug: { debug: true, info: true, warning: true, error: true },
            info: { debug: false, info: true, warning: true, error: true },
            warning: { debug: false, info: false, warning: true, error: true },
            error: { debug: false, info: false, warning: false, error: true }
        }[configuredLogLevel];
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
    // eslint-disable-next-line functional/no-return-void
    debug(type, message, group, user, meta) {
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
    // eslint-disable-next-line functional/no-return-void
    warn(type, message, group, user, meta) {
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
    // eslint-disable-next-line functional/no-return-void
    info(type, message, group, user, meta) {
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
    // eslint-disable-next-line functional/no-return-void
    error(type, message, group, user, meta) {
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
    // eslint-disable-next-line functional/no-return-void, functional/prefer-immutable-types
    output(entry) {
        if (!this.logLevels[entry.level] || process.env.SUPPRESS_LOG_OUTPUT === 'true') {
            // Log level configured above this message so ignore it.
            return;
        }
        const formattedRow = (0, stringify_1.stringify)({
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
        console.log(formattedRow);
    }
}
exports.LogSpan = LogSpan;
/**
 * Debug type log entry. Be aware of the fact that you should NEVER log any sensitive information.
 *
 * @param type What context is being logged.
 * @param message Message to display in log row.
 * @param group Logging group ('audit', 'request', 'response', 'session', 'security', 'technical').
 * @param user Who is being logged.
 * @param meta Meta information, can be any kind of JSON object that gets stringified into the context.
 */
const debug = (type, message, group, user, meta
// eslint-disable-next-line functional/no-return-void
) => {
    // eslint-disable-next-line functional/prefer-immutable-types
    const span = new LogSpan();
    span.debug(type, message, group, user, meta);
};
exports.debug = debug;
/**
 * Warning type log entry. Be aware of the fact that you should NEVER log any sensitive information.
 *
 * @param type What context is being logged.
 * @param message Message to display in log row.
 * @param group Logging group ('audit', 'request', 'response', 'session', 'security', 'technical').
 * @param user Who is being logged.
 * @param meta Meta information, can be any kind of JSON object that gets stringified into the context.
 */
const warn = (type, message, group, user, meta
// eslint-disable-next-line functional/no-return-void
) => {
    // eslint-disable-next-line functional/prefer-immutable-types
    const span = new LogSpan();
    span.warn(type, message, group, user, meta);
};
exports.warn = warn;
/**
 * Info type log entry. Be aware of the fact that you should NEVER log any sensitive information.
 *
 * @param type What context is being logged.
 * @param message Message to display in log row.
 * @param group Logging group ('audit', 'request', 'response', 'session', 'security', 'technical').
 * @param user Who is being logged.
 * @param meta Meta information, can be any kind of JSON object that gets stringified into the context.
 */
const info = (type, message, group, user, meta
// eslint-disable-next-line functional/no-return-void
) => {
    // eslint-disable-next-line functional/prefer-immutable-types
    const span = new LogSpan();
    span.info(type, message, group, user, meta);
};
exports.info = info;
/**
 * Error type log entry. Be aware of the fact that you should NEVER log any sensitive information.
 *
 * @param type What context is being logged.
 * @param message Message to display in log row.
 * @param group Logging group ('audit', 'request', 'response', 'session', 'security', 'technical').
 * @param user Who is being logged.
 * @param meta Meta information, can be any kind of JSON object that gets stringified into the context.
 */
const error = (type, message, group, user, meta
// eslint-disable-next-line functional/no-return-void
) => {
    // eslint-disable-next-line functional/prefer-immutable-types
    const span = new LogSpan();
    span.error(type, message, group, user, meta);
};
exports.error = error;
//# sourceMappingURL=checkout-logger.js.map