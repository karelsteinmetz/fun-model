export function shallowCopy<T>(source: T, callback: (target: T) => void | T = (t: T) => { ; }): T {
    let target: T = Array.isArray(source) ? <T><any>[...source] : <T>{};

    for (var property in source) {
        // target.hasOwnProperty(property) to prevent applying arrays properties once again
        if (!target.hasOwnProperty(property) && source.hasOwnProperty(property)) {
            target[property] = source[property];
        }
    }

    let result: void | T = callback(target);
    return <T>result || target;
};
