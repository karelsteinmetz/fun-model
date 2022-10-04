import { debug } from './debug';

export function shallowCopy<T>(
    source: T,
    callback?: (target: T) => void | T
): T {
    if (source instanceof Array) {
        source = [...source] as unknown as T;
        const result = callback ? callback(source) : undefined;
        return result || source;
    }

    if (isObjectType(source)) {
        return objectShallowCopy<T & Object>(
            source,
            callback ? (t) => callback(t) as T & Object : undefined
        );
    }

    if (debug) {
        debug('Shallow copy should not be used for primitive types.');
    }

    const result = callback && callback(source);
    return result || source;
}

function isObjectType(source: unknown): source is Object {
    return typeof source === 'object';
}

export function objectShallowCopy<T extends Object>(
    source: T,
    callback: (target: T) => void | T = (_t: T) => {}
): T {
    const target = <T>{};
    for (var property in source)
        if (source.hasOwnProperty(property))
            (<any>target)[property] = (<any>source)[property];

    const result = callback(target);
    return <T>result || target;
}

export function deepFreeze<T extends Object>(source: T): T {
    Object.freeze(source);
    for (var property in source) {
        const sourceProperty = (<any>source)[property];
        if (
            source.hasOwnProperty(property) &&
            sourceProperty !== null &&
            (typeof sourceProperty === 'object' ||
                typeof sourceProperty === 'function') &&
            !Object.isFrozen(sourceProperty)
        )
            deepFreeze(sourceProperty);
    }

    return source;
}

export function isFunction(val: any): val is Function {
    return typeof val == 'function';
}
