"use strict";
function shallowCopy(source, callback) {
    if (callback === void 0) { callback = function (t) { }; }
    var target = {};
    for (var property in source)
        if (source.hasOwnProperty(property))
            target[property] = source[property];
    var result = callback(target);
    return result || target;
}
exports.shallowCopy = shallowCopy;
;
