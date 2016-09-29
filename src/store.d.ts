export interface IState {
}
export interface ICursor<TState extends IState> {
    key: string;
}
export interface ICursorFactory<TState, TParms> {
    create(data: TParms): ICursor<TState>;
}
export declare let rootCursor: ICursor<IState>;
export declare let bootstrap: (defaultState: IState, subStateSeparator?: string) => void;
export declare let getState: <TState extends IState>(cursor: ICursor<TState>) => TState;
export declare let setState: <TState extends IState>(cursor: ICursor<TState>, updatedState: TState) => void;
