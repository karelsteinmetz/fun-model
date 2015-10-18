import { setState, getState, IState, ICursor } from './store';

let render: () => void = null;
let debug: debugCallbackType = undefined;

export type debugCallbackType = (message: string, params?: any) => void

export let bootstrap = (renderCallback: () => void, debugCallback: debugCallbackType = (m, p) => {}) => {
    render = renderCallback;
    debug = debugCallback;
    debug('Action factory has been initialized.');
};

export interface IAction<T> {
    (param?: T): void;
}

export let createAction = <TState extends IState, TParams>(cursor: ICursor<TState>, handler: (state: TState, t?: TParams) => TState)
    : IAction<TParams> => {
    return <IAction<TParams>>((params?: TParams): void => {
        validateRenderCallback();
        if (changeState(cursor, handler, params)) {
            render();
            debug('Rendering invoked...');
        }
    });
}

export interface IPair<TState extends IState, TParam> {
    cursor: ICursor<TState>;
    handler: (state: TState, t?: TParam) => TState
}

export let createActions = <TState1 extends IState, TParams>(...pairs: IPair<TState1, TParams>[]) => {
    return <IAction<TParams>>((params?: TParams) => {
        validateRenderCallback();
        let changed = false;
        for (var i in pairs)
            if (pairs.hasOwnProperty(i)) {
                let pair = pairs[i];
                if (changeState(pair.cursor, pair.handler, params))
                    changed = true;
            }
        changed && render();
    });
}

function validateRenderCallback() {
    if (render === null)
        throw 'Render callback must be set before first usage through bootstrap(defaultState, () => { yourRenderCallback(); }).';
}

function changeState<TState extends IState, TParams>(cursor: ICursor<TState>, handler: (state: TState, t?: TParams) => TState, params: TParams)
    : boolean {
    let oldState = getState(cursor);
    let newState = handler(oldState, params);
    if (oldState === newState)
        return false;

    setState(cursor, newState);
    debug('Current state: ', newState);
    return true;
}
