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
let rootStateKey = '';

export let rootCursor: ICursor<IState> = {
    key: rootStateKey
};

export let bootstrap = (defaultState: IState, subStateSeparator: string = '.') => {
    stateSeparator = subStateSeparator;
    state = defaultState;
};

export let getState = <TState extends IState>(cursor: ICursor<TState>): TState => {
    let getInnerState = (innerState: IState, path: string[]): IState => {
        if (path.length === 0)
            return innerState;
        let subPath = path.shift();
        checkSubstate(innerState, subPath, cursor.key);
        let prop = innerState[subPath];
        return Array.isArray(prop) && path.length > 0
            ? getInnerState(prop[Number(path.shift())], path)
            : getInnerState(prop, path);
    };
    checkDefaultStateAndCursor(cursor);
    return <TState>(cursor.key === rootStateKey
        ? state
        : getInnerState(state, cursor.key.split(stateSeparator)));
};

export let setState = <TState extends IState>(cursor: ICursor<TState>, updatedState: TState) => {
    let setInnerState = <TInnerState extends IState>(innerState: TInnerState, path: string[]): TInnerState => {
        if (path.length === 0)
            return <any>updatedState;
        let subPath = path.shift();
        checkSubstate(innerState, subPath, cursor.key);
        let prop = innerState[subPath];
        let newSubState = null;
        if (Array.isArray(prop) && path.length > 0) {
            let index = Number(path.shift());
            prop[index] = setInnerState(prop[index], path);
            newSubState = [...prop];
        }
        else
            newSubState = setInnerState(prop, path);

        if (newSubState === prop)
            return innerState;

        let newState = h.shallowCopy(innerState);
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
