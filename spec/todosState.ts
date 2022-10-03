import * as s from '../src/store';

export interface ITodosState extends s.IState {
    todos: ITodo[];
    nullableNumber: number | null;
}

export default (): ITodosState => {
    return {
        todos: [],
        nullableNumber: null,
    };
};

export interface ITodo {
    done: boolean;
    name: string;
}

export interface ITodoParams {
    todo: ITodo;
    index: number;
}

export const todosCursor: s.ICursor<ITodo[]> = {
    key: 'todos',
};

export const nullableNumberCursor: s.ICursor<number | null> = {
    key: 'nullableNumber',
};
