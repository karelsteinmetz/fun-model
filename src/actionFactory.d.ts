import * as s from './store';
export declare let bootstrap: (renderCallback: () => void) => void;
export interface IAction<T> {
    (param?: T): void;
}
export interface IAsyncAction<T, TState> {
    (param?: T): Promise<TState>;
}
export declare let createAction: <TState extends s.IState, TParams>(cursor: s.ICursor<TState> | s.ICursorFactory<TState, TParams>, handler: (state: TState, t?: TParams) => TState) => IAction<TParams>;
export interface IPair<TState extends s.IState, TParam> {
    cursor: s.ICursor<TState>;
    handler: (state: TState, t?: TParam) => TState;
}
export declare let createActions: <TState extends s.IState, TParams>(...pairs: IPair<TState, TParams>[]) => IAction<TParams>;
export declare let createAsyncAction: <TState extends s.IState, TParams>(cursor: s.ICursor<TState> | s.ICursorFactory<TState, TParams>, handler: (state: TState, t?: TParams) => TState) => IAsyncAction<TParams, TState>;
