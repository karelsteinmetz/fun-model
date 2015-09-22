export function shallowCopy<T>(source: T, callback: (target: T) => T = (t: T) => { return t; }): T {
    let target = {};
    for (var property in source)
        if (source.hasOwnProperty(property))
            target[property] = source[property];
    return callback(<T>target);
};
