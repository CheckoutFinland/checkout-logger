"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringify = void 0;
/**
 * Stringifies an object, removing any circular references
 *
 * @param object Object to stringify
 */
const stringify = (object) => {
    // tslint:disable-next-line: no-any
    const cache = [];
    return JSON.stringify(object, (_key, value) => {
        if (typeof value === 'object' && value !== null) {
            // Remove circular references
            if (cache.indexOf(value) !== -1) {
                return '[Circular]';
            }
            cache.push(value);
        }
        return value;
    });
};
exports.stringify = stringify;
//# sourceMappingURL=stringify.js.map