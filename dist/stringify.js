"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringify = void 0;
/**
 * Stringifies an object, removing any circular references
 *
 * @param object Object to stringify
 */
const stringify = (object) => {
    // eslint-disable-next-line functional/prefer-readonly-type
    const cache = [];
    return JSON.stringify(object, (_key, value) => {
        if (typeof value === 'object' && value !== null) {
            // Remove circular references
            if (cache.indexOf(value) !== -1) {
                return '[Circular]';
            }
            // eslint-disable-next-line functional/immutable-data
            cache.push(value);
        }
        return value;
    });
};
exports.stringify = stringify;
//# sourceMappingURL=stringify.js.map