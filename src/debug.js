"use strict";
var debug = undefined;
exports.bootstrap = function (debugCallback) {
    debug = debugCallback;
};
function log(message, params) {
    debug && debug(message, params);
}
exports.log = log;
