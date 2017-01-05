export function shallowCopy<T>(source: T, callback: (target: T) => void | T = (t: T) => { }): T {
    const target = <T>{};
    for (var property in source)
        if (source.hasOwnProperty(property))
            target[property] = source[property];
    const result = callback(target);
    return <T>result || target;
};


export function deepFreeze(o) {
    Object.freeze(o);

    Object.getOwnPropertyNames(o).forEach(function (prop) {
        if (o.hasOwnProperty(prop)
            && o[prop] !== null
            && (typeof o[prop] === "object" || typeof o[prop] === "function")
            && !Object.isFrozen(o[prop])) {
            deepFreeze(o[prop]);
        }
    });

    return o;
};