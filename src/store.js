"use strict";
var h = require('./helpers');
var d = require('./debug');
var state = null;
var stateSeparator = '.';
var rootStateKey = '';
exports.rootCursor = {
    key: rootStateKey
};
exports.bootstrap = function (defaultState, subStateSeparator) {
    if (subStateSeparator === void 0) { subStateSeparator = '.'; }
    stateSeparator = subStateSeparator;
    state = defaultState;
};
exports.getState = function (cursor) {
    var getInnerState = function (innerState, path) {
        if (path.length === 0)
            return innerState;
        var subPath = path.shift();
        checkSubstate(innerState, subPath, cursor.key);
        var prop = innerState[subPath];
        return Array.isArray(prop) && path.length > 0
            ? getInnerState(prop[Number(path.shift())], path)
            : getInnerState(prop, path);
    };
    checkDefaultStateAndCursor(cursor);
    return (cursor.key === rootStateKey
        ? state
        : getInnerState(state, cursor.key.split(stateSeparator)));
};
exports.setState = function (cursor, updatedState) {
    var setInnerState = function (innerState, path) {
        if (path.length === 0)
            return updatedState;
        var subPath = path.shift();
        checkSubstate(innerState, subPath, cursor.key);
        var prop = innerState[subPath];
        var newSubState = null;
        if (Array.isArray(prop) && path.length > 0) {
            var index = Number(path.shift());
            prop[index] = setInnerState(prop[index], path);
            newSubState = prop.slice();
        }
        else
            newSubState = setInnerState(prop, path);
        if (newSubState === prop)
            return innerState;
        var newState = h.shallowCopy(innerState);
        newState[subPath] = newSubState;
        return newState;
    };
    checkDefaultStateAndCursor(cursor);
    state =
        cursor.key === rootStateKey
            ? updatedState
            : setInnerState(state, cursor.key.split(stateSeparator));
    d.log('Current state:', state);
};
function checkSubstate(s, subPath, cursorKey) {
    if (s[subPath] === undefined)
        throw "State for cursor key (" + cursorKey + ") does not exist.";
}
function checkDefaultStateAndCursor(cursor) {
    if (state === null)
        throw 'Default state must be set before first usage through bootstrap(defaultState, () => { yourRenderCallback(); }).';
    if (cursor.key === null)
        throw 'Cursor key cannot be null.';
}
