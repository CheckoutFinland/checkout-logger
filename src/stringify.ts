/**
 * Stringifies an object, removing any circular references
 *
 * @param object Object to stringify
 */
// eslint-disable-next-line functional/prefer-immutable-types
export const stringify: (object: Record<string, unknown>) => string = (object) => {
    // eslint-disable-next-line functional/prefer-readonly-type, functional/prefer-immutable-types
    const cache: any[] = [];

    return JSON.stringify(object,
        (_key, value) => {
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
