export function shallowCopy<T>(source: T, callback: (target: T) => void | T = (t: T) => { }): T {
    let target = <T>{};
    for (var property in source)
        if (source.hasOwnProperty(property))
            target[property] = source[property];
    let result = callback(target);
    return <T>result || target;
};

