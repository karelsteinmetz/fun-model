import * as s from './store';
import * as d from './debug';

let render: () => void = null;

export let bootstrap = (renderCallback: () => void) => {
    render = renderCallback;
    d.log('Action factory has been initialized.');
};

export interface IAction<T> {
    (param?: T): void;
}

export let createAction = <TState extends s.IState, TParams>(cursor: s.ICursor<TState>, handler: (state: TState, t?: TParams) => TState)
    : IAction<TParams> => {
    return <IAction<TParams>>((params?: TParams): void => {
        validateRenderCallback();
        if (changeState(cursor, handler, params)) {
            render();
            d.log('Rendering invoked...');
        }
    });
}

export interface IPair<TState extends s.IState, TParam> {
    cursor: s.ICursor<TState>;
    handler: (state: TState, t?: TParam) => TState
}

export let createActions = <TState extends s.IState, TParams>(...pairs: IPair<TState, TParams>[]) => {
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

function changeState<TState extends s.IState, TParams>(cursor: s.ICursor<TState>, handler: (state: TState, t?: TParams) => TState, params: TParams)
    : boolean {
    let oldState = s.getState(cursor);
    let newState = handler(oldState, params);
    if (oldState === newState)
        return false;
    s.setState(cursor, newState);
    d.log('Global state has been changed.');
    return true;
}
