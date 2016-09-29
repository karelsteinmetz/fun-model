"use strict";
var s = require('./store');
var d = require('./debug');
var render = null;
exports.bootstrap = function (renderCallback) {
    render = renderCallback;
    queueOfHandlers = [];
    d.log('Action factory has been initialized.');
};
exports.createAction = function (cursor, handler) {
    return (function (params) {
        validateRenderCallback();
        if (changeStateWithQueue(unifyCursor(cursor, params), handler, params)) {
            render();
            d.log('Rendering invoked...');
        }
    });
};
function unifyCursor(cursor, params) {
    return cursor.create instanceof Function ? cursor.create(params) : cursor;
}
exports.createActions = function () {
    var pairs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        pairs[_i - 0] = arguments[_i];
    }
    return (function (params) {
        validateRenderCallback();
        var changed = false;
        for (var i in pairs)
            if (pairs.hasOwnProperty(i)) {
                var pair = pairs[i];
                if (changeStateWithQueue(pair.cursor, pair.handler, params))
                    changed = true;
            }
        changed && render();
    });
};
exports.createAsyncAction = function (cursor, handler) {
    return (function (params) {
        return new Promise(function (f, r) {
            setTimeout(function () {
                validateRenderCallback();
                var c = unifyCursor(cursor, params);
                if (changeStateWithQueue(c, handler, params)) {
                    render();
                    d.log('Rendering invoked...');
                }
                f(s.getState(c));
            }, 0);
        });
    });
};
function validateRenderCallback() {
    if (render === null)
        throw 'Render callback must be set before first usage through bootstrap(defaultState, () => { yourRenderCallback(); }).';
}
var queueOfHandlers = [];
function changeStateWithQueue(cursor, handler, params) {
    queueOfHandlers.push({ cursor: cursor, handler: handler, params: params });
    if (queueOfHandlers.length > 1)
        return;
    var isStateChanged = false;
    while (queueOfHandlers.length > 0) {
        var n = queueOfHandlers[0];
        isStateChanged = changeState(n.cursor, n.handler, n.params) || isStateChanged;
        queueOfHandlers.shift();
    }
    isStateChanged && d.log('Global state has been changed.');
    return isStateChanged;
}
function changeState(cursor, handler, params) {
    var oldState = s.getState(cursor);
    var newState = handler(oldState, params);
    if (oldState === newState)
        return false;
    s.setState(cursor, newState);
    return true;
}
