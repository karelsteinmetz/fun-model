import * as s from './store';
import * as d from './debug';

let render: () => void = null;

export let bootstrap = (renderCallback: () => void) => {
    render = renderCallback;
    queueOfHandlers = [];
    d.log('Action factory has been initialized.');
};

export interface IAction<T> {
    (param?: T): void;
}

export interface IAsyncAction<T, TState> {
    (param?: T): Promise<TState>;
}

export type IActionHandler<TState extends s.IState, TParams> = (state: TState, t?: TParams) => TState;

function defaultHandler<TValue>(oldValue: TValue, newValue: TValue) { return newValue; }

export function createAction<TState extends s.IState, TParams>(
    cursor: s.ICursor<TState> | s.ICursorFactory<TState, TParams>,
    handler: IActionHandler<TState, TParams> = defaultHandler)
    : IAction<TParams> {

    return <IAction<TParams>>((params?: TParams): void => {
        validateRenderCallback();
        if (changeStateWithQueue(unifyCursor<TState, TParams>(cursor, params), handler, params)) {
            render();
            d.log('Rendering invoked...');
        }
    });
}

function unifyCursor<TState extends s.IState, TParams>(
    cursor: s.ICursor<TState> | s.ICursorFactory<TState, TParams>, params: TParams): s.ICursor<TState> {

    return (<s.ICursorFactory<TState, TParams>>cursor).create instanceof Function
        ? (<s.ICursorFactory<TState, TParams>>cursor).create(params)
        : <s.ICursor<TState>>cursor;
}

export interface IPair<TState extends s.IState, TParam> {
    cursor: s.ICursor<TState>;
    handler: (state: TState, t?: TParam) => TState;
}

export function createActions<TState extends s.IState, TParams>(...pairs: IPair<TState, TParams>[]) {
    return <IAction<TParams>>((params?: TParams) => {
        validateRenderCallback();
        let changed = false;
        for (let i in pairs)
            if (pairs.hasOwnProperty(i)) {
                let pair = pairs[i];
                if (changeStateWithQueue(pair.cursor, pair.handler, params))
                    changed = true;
            }
        changed && render();
    });
}

export function createAsyncAction<TState extends s.IState, TParams>(
    cursor: s.ICursor<TState> | s.ICursorFactory<TState, TParams>, handler: IActionHandler<TState, TParams>)
    : IAsyncAction<TParams, TState> {

    return <IAsyncAction<TParams, TState>>((params?: TParams): Promise<TState> => {
        return new Promise<TState>((f, r) => {
            setTimeout(
                () => {
                    validateRenderCallback();
                    let c = unifyCursor<TState, TParams>(cursor, params);
                    if (changeStateWithQueue(c, handler, params)) {
                        render();
                        d.log('Rendering invoked...');
                    }
                    f(s.getState(c));
                },
                0
            );
        });
    });
}

function validateRenderCallback() {
    if (render === null)
        throw 'Render callback must be set before first usage through bootstrap(defaultState, () => { yourRenderCallback(); }).';
}

interface IQueuedHandling<TState extends s.IState, TParams> {
    cursor: s.ICursor<TState>;
    handler: IActionHandler<TState, TParams>;
    params: TParams;
}

let queueOfHandlers: IQueuedHandling<s.IState, Object>[] = [];
function changeStateWithQueue<TState extends s.IState, TParams>(
    cursor: s.ICursor<TState>, handler: IActionHandler<TState, TParams>, params: TParams): boolean {

    queueOfHandlers.push({ cursor, handler, params });
    if (queueOfHandlers.length > 1)
        return;
    let isStateChanged = false;
    while (queueOfHandlers.length > 0) {
        let n = queueOfHandlers[0];
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