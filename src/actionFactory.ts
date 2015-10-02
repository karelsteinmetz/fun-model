import { setState, getState, IState, ICursor } from './store';

let render: () => void = null;

export let bootstrap = (renderCallback: () => void) => {
    render = renderCallback;
};

export interface IAction<T> {
    (param?: T): void;
}

export function createAction<TState extends IState, TParam>(
    cursor: ICursor<TState>,
    handler: (state: TState, t?: TParam) => TState
): IAction<TParam> {
    if (render === null)
        throw 'Render callback must be set before first usage through bootstrap(defaultState, () => { yourRenderCallback(); }).';
    return <IAction<TParam>>((param?: TParam): void => {
        let oldState = getState(cursor);
        let newState = handler(oldState, param);
        if (oldState !== newState) {
            setState(cursor, newState);
            render();
        }
    });
}
