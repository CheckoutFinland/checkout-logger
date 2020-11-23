/**
 * Stringifies an object, removing any circular references
 *
 * @param object Object to stringify
 */
export const stringify: (object: Record<string, unknown>) => string = (object) => {
    // tslint:disable-next-line: no-any
    const cache: any[] = [];

    return JSON.stringify(object,
        (_key, value) => {
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
