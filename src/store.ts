import * as h from './helpers';
import * as d from './debug';

export interface IState {
}

export interface ICursor<TState extends IState> {
    key: string;
    _?: TState;
}

export interface ICursorFactory<TState, TParms> {
    create(data?: TParms): ICursor<TState>;
}

let state: IState | null = null;
let stateSeparator = '.';
let freezing: boolean | (() => boolean) = false;
const rootStateKey = '';

export const rootCursor: ICursor<IState> = {
    key: rootStateKey
};

export const bootstrap = (defaultState: IState | null, withStateFreezing: boolean | (() => boolean) = false, subStateSeparator: string = '.') => {
    stateSeparator = subStateSeparator;
    state = defaultState;
    freezing = withStateFreezing;
};

export const isExistingCursor = <TState extends IState>(cursor: ICursor<TState>): boolean => {
    const hasExistingInnerStateInArray = (innerState: IState[], path: string[]): boolean => {
        const index = Number(path.shift());
        return index < innerState.length
            ? hasExistingInnerState(innerState[index], path)
            : false;
    }
    const hasExistingInnerState = (innerState: IState, path: string[]): boolean => {
        if (path.length === 0)
            return true;
        const subPath = path.shift();
        if (!subPath)
            return true;
        if ((<any>innerState)[subPath] === undefined)
            return false;
        const prop = (<any>innerState)[subPath];
        return Array.isArray(prop)
            ? hasExistingInnerStateInArray(prop, path)
            : hasExistingInnerState(prop, path);
    };

    if (!isSetDefaultState(state) || !isValidCursorKey(cursor))
        throw 'Invalid operation.';

    return cursor.key === rootStateKey
        ? true
        : hasExistingInnerState(state, cursor.key.split(stateSeparator));
}

export const getState = <TState extends IState>(cursor: ICursor<TState>): TState => {
    const getInnerState = (innerState: IState, path: string[]): IState => {
        if (path.length === 0)
            return innerState;
        const subPath = path.shift();
        if (!subPath)
            return innerState;
        checkSubstate(innerState, subPath, cursor.key);
        const prop = (<any>innerState)[subPath];
        return Array.isArray(prop) && path.length > 0
            ? getInnerState(prop[Number(path.shift())], path)
            : getInnerState(prop, path);
    };

    if (!isSetDefaultState(state) || !isValidCursorKey(cursor))
        throw 'Invalid operation.';

    return <TState>(cursor.key === rootStateKey
        ? state
        : getInnerState(state, cursor.key.split(stateSeparator)));
};

export const setState = <TState extends IState>(cursor: ICursor<TState>, updatedState: TState) => {
    const setInnerState = <TInnerState extends IState>(innerState: TInnerState, path: string[]): TInnerState => {
        if (path.length === 0)
            return <any>updatedState;
        const subPath = path.shift();
        if (!subPath)
            return <any>updatedState;

        createSubstate(innerState, subPath);
        const prop = (<any>innerState)[subPath];
        let newSubState: Object | Array<IState> | null = null;
        if (Array.isArray(prop) && path.length > 0) {
            let index = Number(path.shift());
            newSubState = [...prop];
            (<any>newSubState)[index] = setInnerState((<any>newSubState)[index], path);
        }
        else
            newSubState = setInnerState(prop, path);

        if (newSubState === prop)
            return innerState;

        const newState = h.shallowCopy(innerState);
        (<any>newState)[subPath] = newSubState;
        return newState;
    };

    if (!isSetDefaultState(state) || !isValidCursorKey(cursor))
        throw 'Invalid operation.';

    state =
        cursor.key === rootStateKey
            ? updatedState
            : setInnerState(state, cursor.key.split(stateSeparator));
    if (h.isFunction(freezing) ? freezing() : freezing)
        h.deepFreeze(state);
    d.log('Current state:', state);
};

function checkSubstate(s: IState, subPath: string, cursorKey: string) {
    if ((<any>s)[subPath] === undefined)
        throw `State for cursor key (${cursorKey}) does not exist.`;
}

function createSubstate(s: IState, subPath: string) {
    if ((<any>s)[subPath] === undefined)
        (<any>s)[subPath] = {};
}

function isSetDefaultState<T>(state: T | null): state is T {
    if (state === null)
        throw 'Default state must be set before first usage through bootstrap(defaultState, () => { yourRenderCallback(); }).';
    return true;
}

function isValidCursorKey<TState extends IState>(cursor: ICursor<TState>): boolean {
    if (cursor.key === null)
        throw 'Cursor key cannot be null.';
    return true;
}