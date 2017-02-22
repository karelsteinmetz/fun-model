import * as s from '../src/store';

export interface ITodosState extends s.IState {
    todos: ITodo[]
}

export default (): ITodosState => {
    return {
        todos: []
    }
}

export interface ITodo {
    done: boolean
    name: string
}

export interface ITodoParams {
    todo: ITodo
    index: number
}

export const todosCursor: s.ICursor<ITodo[]> = {
    key: 'todos'
}