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
    (param: T): void;
}

export interface IParamLessAction {
    (): void;
}

export type IActionHandler<TState, TParams> = (state: TState, t: TParams) => TState;

export type IParamLessActionHandler<TState> = (state: TState) => TState;

type IInternalActionHandler<TState> = (state: TState) => TState;

const renderCallbackMustBeSetBefore = 'Render callback must be set before first usage through bootstrap(defaultState, () => { yourRenderCallback(); }).';

export const createAction = <TState, TParams>(cursor: s.CursorType<TState> | s.ICursorFactory<TState, TParams>, handler: IActionHandler<TState, TParams>)
    : IAction<TParams> => {
    return (params: TParams): void => {
        if (stateChanged === null)
            throw renderCallbackMustBeSetBefore;
        
        if (changeStateWithQueue(unifyCursor(cursor, params), (state) => handler(state, params))) {
            stateChanged();
            d.log('Rendering invoked...');
        }
    };
};

export const createReplaceAction = <TState>(cursor: s.CursorType<TState> | s.ICursorFactory<TState, TState>)
    : IAction<TState> => {
    return createAction(cursor, (_state, params) => params);
};

export const createParamLessAction = <TState>(cursor: s.CursorType<TState> | s.ICursorFactory<TState, TState>, handler: IParamLessActionHandler<TState>)
    : IParamLessAction => {
    return (): void => {
        if (stateChanged === null)
            throw renderCallbackMustBeSetBefore;

        if (changeStateWithQueue(unifyCursor(cursor, null), handler)) {
            stateChanged();
            d.log('Rendering invoked...');
        }
    };
};

function unifyCursor<TState, TParams>(cursor: s.CursorType<TState> | s.ICursorFactory<TState, TParams>, params: TParams): s.ICursor<TState> {
    return (<any>cursor).create instanceof Function
        ? <s.ICursor<TState>>(<any>cursor).create(params)
        : <s.ICursor<TState>>(s.isCursorFunction(<s.CursorType<TState>>cursor) ? (<() => s.ICursor<TState>>cursor)() : cursor);
}

export interface IPair<TState, TParam> {
    cursor: s.ICursor<TState>;
    handler: (state: TState, t: TParam) => TState
}

export const createActions = <TState, TParams>(...pairs: IPair<TState, TParams>[]): IAction<TParams> => {
    return (params: TParams) => {
        if (stateChanged === null)
            throw renderCallbackMustBeSetBefore;

        let changed = false;
        for (var i in pairs)
            if (pairs.hasOwnProperty(i)) {
                let pair = pairs[i];
                if (changeStateWithQueue(pair.cursor, (state) => pair.handler(state, params)))
                    changed = true;
            }
        changed && stateChanged();
    };
};

export interface IParamLessPair<TState> {
    cursor: s.ICursor<TState>;
    handler: (state: TState) => TState
}

export const createParamLessActions = <TState>(...pairs: IParamLessPair<TState>[]): IParamLessAction => {
    return () => {
        if (stateChanged === null)
            throw renderCallbackMustBeSetBefore;
        let changed = false;
        for (var i in pairs)
            if (pairs.hasOwnProperty(i)) {
                let pair = pairs[i];
                if (changeStateWithQueue(pair.cursor, pair.handler))
                    changed = true;
            }
        changed && stateChanged();
    };
};

interface IQueuedHandling<TState> {
    cursor: s.ICursor<TState>;
    handler: IInternalActionHandler<TState>;
}

let queueOfHandlers: IQueuedHandling<any>[] = [];
function changeStateWithQueue<TState>(cursor: s.ICursor<TState>, handler: IInternalActionHandler<TState>)
    : boolean {
    queueOfHandlers.push({ cursor, handler });
    if (queueOfHandlers.length > 1)
        return false;
    let isStateChanged = false;
    while (queueOfHandlers.length > 0) {
        let n = queueOfHandlers[0];
        if (h.isFunction(exceptionHandling) ? exceptionHandling() : exceptionHandling)
            try {
                isStateChanged = changeState(n.cursor, n.handler) || isStateChanged;
            } catch (error) {
                d.log('Error in action handling: ', error);
            }
        else
            isStateChanged = changeState(n.cursor, n.handler) || isStateChanged;

        queueOfHandlers.shift();
    }
    isStateChanged && d.log('Global state has been changed.');
    return isStateChanged;
}

function changeState<TState>(cursor: s.ICursor<TState>, handler: IInternalActionHandler<TState>)
    : boolean {
    let oldState = s.getState(cursor);
    let newState = handler(oldState);
    if (oldState === newState)
        return false;
    s.setState(cursor, newState);
    return true;
}
