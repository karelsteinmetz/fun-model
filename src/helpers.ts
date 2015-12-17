export function shallowCopy<T>(source: T, callback: (target: T) => void = (t: T) => { }): T {
    let target = <T>{};
    for (var property in source)
        if (source.hasOwnProperty(property))
            target[property] = source[property];
    callback(target);
    return target;
};

