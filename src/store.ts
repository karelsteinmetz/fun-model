import * as h from './helpers';
import * as d from './debug';

export interface IState {
}

export interface ICursor<TState extends IState> {
    key: string;
}

export interface ICursorFactory<TState, TParms> {
    create(data: TParms): ICursor<TState>;
}

let state: IState = null;
let stateSeparator = '.';
const rootStateKey = '';

export const rootCursor: ICursor<IState> = {
    key: rootStateKey
};

export const bootstrap = (defaultState: IState, subStateSeparator: string = '.') => {
    stateSeparator = subStateSeparator;
    state = defaultState;
};

export const getState = <TState extends IState>(cursor: ICursor<TState>): TState => {
    const getInnerState = (innerState: IState, path: string[]): IState => {
        if (path.length === 0)
            return innerState;
        const subPath = path.shift();
        checkSubstate(innerState, subPath, cursor.key);
        const prop = innerState[subPath];
        return Array.isArray(prop) && path.length > 0
            ? getInnerState(prop[Number(path.shift())], path)
            : getInnerState(prop, path);
    };
    checkDefaultStateAndCursor(cursor);
    return <TState>(cursor.key === rootStateKey
        ? state
        : getInnerState(state, cursor.key.split(stateSeparator)));
};

export const setState = <TState extends IState>(cursor: ICursor<TState>, updatedState: TState) => {
    const setInnerState = <TInnerState extends IState>(innerState: TInnerState, path: string[]): TInnerState => {
        if (path.length === 0)
            return <any>updatedState;
        const subPath = path.shift();
        checkSubstate(innerState, subPath, cursor.key);
        const prop = innerState[subPath];
        let newSubState = null;
        if (Array.isArray(prop) && path.length > 0) {
            let index = Number(path.shift());
            newSubState = [...prop];
            newSubState[index] = setInnerState(newSubState[index], path);
        }
        else
            newSubState = setInnerState(prop, path);

        if (newSubState === prop)
            return innerState;

        const newState = h.shallowCopy(innerState);
        newState[subPath] = newSubState;
        return newState;
    };

    checkDefaultStateAndCursor(cursor);

    state =
        cursor.key === rootStateKey
            ? updatedState
            : setInnerState(state, cursor.key.split(stateSeparator));
    if (d.isDebuggingEnabled())
        h.deepFreeze(state);
    d.log('Current state:', state);
};

function checkSubstate(s: IState, subPath: string, cursorKey: string) {
    if (s[subPath] === undefined)
        throw `State for cursor key (${cursorKey}) does not exist.`;
}

function checkDefaultStateAndCursor<TState extends IState>(cursor: ICursor<TState>) {
    if (state === null)
        throw 'Default state must be set before first usage through bootstrap(defaultState, () => { yourRenderCallback(); }).';

    if (cursor.key === null)
        throw 'Cursor key cannot be null.';
}
