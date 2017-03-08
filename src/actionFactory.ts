import * as s from './store';
import * as d from './debug';
import * as h from './helpers';

let stateChanged: (() => void) | null = null;
let exceptionHandling: boolean | (() => boolean);

export const bootstrap = (onStateChanged: (() => void) | null, withExceptionHandling: boolean | (() => boolean) = false) => {
    stateChanged = onStateChanged;
    queueOfHandlers = [];
    exceptionHandling = withExceptionHandling;
    d.log('Action factory has been initialized.');
};

export interface IAction<T> {
    (param?: T): void;
}

export type IActionHandler<TState extends s.IState, TParams> = (state: TState, t: TParams) => TState;

function defaultHandler<TValue>(_oldValue: TValue, newValue: TValue) { return newValue; }

export const createAction = <TState extends s.IState, TParams>(cursor: s.ICursor<TState> | s.ICursorFactory<TState, TParams>, handler: IActionHandler<TState, TParams> = defaultHandler)
    : IAction<TParams> => {
    return <IAction<TParams>>((params: TParams): void => {
        if (stateChanged === null)
            throw 'Render callback must be set before first usage through bootstrap(defaultState, () => { yourRenderCallback(); }).';

        if (changeStateWithQueue(unifyCursor<TState, TParams>(cursor, params), handler, params)) {
            stateChanged();
            d.log('Rendering invoked...');
        }
    });
}

function unifyCursor<TState extends s.IState, TParams>(cursor: s.ICursor<TState> | s.ICursorFactory<TState, TParams>, params: TParams): s.ICursor<TState> {
    return (<s.ICursorFactory<TState, TParams>>cursor).create instanceof Function ? (<s.ICursorFactory<TState, TParams>>cursor).create(params) : <s.ICursor<TState>>cursor;
}

export interface IPair<TState extends s.IState, TParam> {
    cursor: s.ICursor<TState>;
    handler: (state: TState, t: TParam) => TState
}

export const createActions = <TState extends s.IState, TParams>(...pairs: IPair<TState, TParams>[]) => {
    return <IAction<TParams>>((params: TParams) => {
        if (stateChanged === null)
            throw 'Render callback must be set before first usage through bootstrap(defaultState, () => { yourRenderCallback(); }).';
        let changed = false;
        for (var i in pairs)
            if (pairs.hasOwnProperty(i)) {
                let pair = pairs[i];
                if (changeStateWithQueue(pair.cursor, pair.handler, params))
                    changed = true;
            }
        changed && stateChanged();
    });
}

interface IQueuedHandling<TState extends s.IState, TParams> {
    cursor: s.ICursor<TState>;
    handler: IActionHandler<TState, TParams>;
    params: TParams;
}

let queueOfHandlers: IQueuedHandling<s.IState, Object>[] = [];
function changeStateWithQueue<TState extends s.IState, TParams>(cursor: s.ICursor<TState>, handler: IActionHandler<TState, TParams>, params: TParams)
    : boolean {
    queueOfHandlers.push({ cursor, handler, params });
    if (queueOfHandlers.length > 1)
        return false;
    let isStateChanged = false;
    while (queueOfHandlers.length > 0) {
        let n = queueOfHandlers[0];
        if (h.isFunction(exceptionHandling) ? exceptionHandling() : exceptionHandling)
            try {
                isStateChanged = changeState(n.cursor, n.handler, n.params) || isStateChanged;
            } catch (error) {
                d.log('Error in action handling: ', error);
            }
        else
            isStateChanged = changeState(n.cursor, n.handler, n.params) || isStateChanged;

        queueOfHandlers.shift();
    }
    isStateChanged && d.log('Global state has been changed.');
    return isStateChanged;
}

function changeState<TState extends s.IState, TParams>(cursor: s.ICursor<TState>, handler: IActionHandler<TState, TParams>, params: TParams)
    : boolean {
    let oldState = s.getState(cursor);
    let newState = handler(oldState, params);
    if (oldState === newState)
        return false;
    s.setState(cursor, newState);
    return true;
}