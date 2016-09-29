"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var s = require('./src/store');
var af = require('./src/actionFactory');
var d = require('./src/debug');
__export(require('./src/store'));
__export(require('./src/actionFactory'));
__export(require('./src/helpers'));
exports.bootstrap = function (defaultState, renderCallback, debugCallback, subStateSeparator) {
    if (debugCallback === void 0) { debugCallback = undefined; }
    if (subStateSeparator === void 0) { subStateSeparator = '.'; }
    debugCallback && d.bootstrap(function (m, p) { return debugCallback("fun-model -> " + m, p); });
    s.bootstrap(defaultState, subStateSeparator);
    af.bootstrap(renderCallback);
};
