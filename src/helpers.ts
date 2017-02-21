
export function shallowCopy<T>(source: T, callback?: (target: T) => void | T): T;
export function shallowCopy<T>(source: T[], callback?: (target: T[]) => void | T[]): T[];
export function shallowCopy(source: any, callback?: (target: any) => void | any): any {
    if (source instanceof Array) {
        source = [...source];
        const result = callback ? callback(source) : undefined;
        return result || source;
    }
    return objectShallowCopy(source, callback);
}

export function objectShallowCopy<T>(source: T, callback: (target: T) => void | T = (_t: T) => { }): T {
    const target = <T>{};
    for (var property in source)
        if (source.hasOwnProperty(property))
            (<any>target)[property] = (<any>source)[property];

    const result = callback(target);
    return <T>result || target;
};

export function deepFreeze(source: any) {
    Object.freeze(source);
    for (var property in source)
        if (source.hasOwnProperty(property)
            && source[property] !== null
            && (typeof source[property] === "object" || typeof source[property] === "function")
            && !Object.isFrozen(source[property]))
            deepFreeze(source[property]);

    // Object.getOwnPropertyNames(source).forEach(function (prop) {
    //     if (source.hasOwnProperty(prop)
    //         && source[prop] !== null
    //         && (typeof source[prop] === "object" || typeof source[prop] === "function")
    //         && !Object.isFrozen(source[prop])) {
    //         deepFreeze(source[prop]);
    //     }
    // });
    return source;
};