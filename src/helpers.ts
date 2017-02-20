
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

export function objectShallowCopy<T>(source: T, callback: (target: T) => void | T = (t: T) => { ; }): T {
    const target = <T>{};
    for (let property in source)
        if (source.hasOwnProperty(property))
            target[property] = source[property];
    const result = callback(target);
    return <T>result || target;
};

// function objectShallowCopy<T>(source: T, callback?: (target: T) => void | T): T {
//     const target = <T>{};
//     for (var property in source)
//         if (source.hasOwnProperty(property))
//             target[property] = source[property];
//     const result = callback ? callback(source) : undefined;
//     return <T>result || target;
// };

export function deepFreeze(o) {
    Object.freeze(o);
    Object.getOwnPropertyNames(o).forEach(function (prop) {
        if (o.hasOwnProperty(prop)
            && o[prop] !== null
            && (typeof o[prop] === 'object' || typeof o[prop] === 'function')
            && !Object.isFrozen(o[prop])) {
            deepFreeze(o[prop]);
        }
    });
    return o;
};