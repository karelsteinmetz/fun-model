/// <reference path="./jasmine"/>
import * as s from '../src/store';
import * as tds from './todosState';
import * as d from '../src/debug';

describe('store', () => {
    beforeEach(() => {
        resetStore();
    });

    it('gets and sets root state if cursor key is rootStateKey', () => {
        s.bootstrap({ some: null });
        let state = { some: 'state' };

        s.setState(s.rootCursor, state);

        expect(s.getState(s.rootCursor)).toBe(state);
    });

    describe('rootCursor', () => {
        it('cursor has empty key', () => {
            expect(s.rootCursor.key).toBe('');
        });
    });

    describe('getState', () => {
        describe('without booting', () => {
            it('throws if key does not exist', () => {
                expect(() => s.getState<s.IState>(s.rootCursor))
                    .toThrow('Default state must be set before first usage through bootstrap(defaultState, () => { yourRenderCallback(); }).');
            });
        });

        describe('with booting', () => {
            beforeEach(() => {
                s.bootstrap({ some: { nested: { state: 'value' } } });
            });

            it('returns nested state by cursor', () => {
                givenStore({ some: { nested: { state: 'value' } } });

                let state = s.getState({ key: 'some.nested.state' });

                expect(state).toBe('value');
            });

            it('returns nested state by cursor when current value of sub state is empty string', () => {
                givenStore({ some: { nested: { state: '' } } });

                let state = s.getState({ key: 'some.nested.state' });

                expect(state).toBe('');
            });

            it('throws if key does not exist', () => {
                expect(() => s.getState<s.IState>({ key: 'not.existing.key' }))
                    .toThrow('State for cursor key (not.existing.key) does not exist.');
            });

            it('throws if cursor key is null', () => {
                expect(() => s.getState<s.IState>({ key: null }))
                    .toThrow('Cursor key cannot be null.');
            });
        });

        describe('with booting and dynamic/array cursor', () => {
            beforeEach(() => {
                s.bootstrap(tds.default());
            });

            it('returns nested state in the array on specified index', () => {
                givenTodoStore({ todos: [{ done: false, name: 'First Todo' }, { done: false, name: 'Second Todo' }] });

                let state = s.getState<tds.ITodosState>({ key: 'todos.1.name' });

                expect(state).toBe('Second Todo');
            });

            it('returns full array when is as last key', () => {
                givenTodoStore({ todos: [{ done: false, name: 'First Todo' }] });

                let state = s.getState<tds.ITodosState>(tds.todosCursor);

                expect(state[0].done).toBeFalsy();
            });

            function givenTodoStore(state: tds.ITodosState) {
                s.setState(s.rootCursor, state);
            }
        });
    });

    describe('setState', () => {
        describe('without booting', () => {
            it('throws if key does not exist', () => {
                expect(() => s.setState(s.rootCursor, {}))
                    .toThrow('Default state must be set before first usage through bootstrap(defaultState, () => { yourRenderCallback(); }).');
            });
        });

        describe('with booting', () => {
            let rootCursorTestFixture: s.ICursor<IStateTestFixture> = {
                key: ''
            }

            beforeEach(() => {
                s.bootstrap({ key: null });
            });

            it('throws if cursor key is null', () => {
                expect(() => s.setState({ key: null }, {}))
                    .toThrow('Cursor key cannot be null.');
            });

            it('throws if cursor has not existing key', () => {
                expect(() => s.setState({ key: 'invalid' }, {}))
                    .toThrow('State for cursor key (invalid) does not exist.');
            });

            it('throws if cursor has nested not existing key', () => {
                expect(() => s.setState({ key: 'not.existing.key' }, {}))
                    .toThrow('State for cursor key (not.existing.key) does not exist.');
            });

            it('sets nested state by cursor', () => {
                givenStore({ some: { nested: { state: 'value' } } });

                s.setState({ key: 'some' }, { nested: { state: 'newValue' } });

                expect((s.getState(rootCursorTestFixture)).some.nested.state).toBe('newValue');
            });

            it('sets nested state by cursor when current value of sub state is empty string', () => {
                givenStore({ some: { nested: { state: '' } } });

                s.setState({ key: 'some' }, { nested: { state: 'newValue' } });

                expect((s.getState(rootCursorTestFixture)).some.nested.state).toBe('newValue');
            });

            it('sets new instance of root state', () => {
                let initState = { some: { nested: { state: 'value' } } };
                givenStore(initState);

                s.setState({ key: 'some' }, { nested: { state: 'newValue' } });

                expect(s.getState(s.rootCursor)).not.toBe(initState);
            });

            it('logs new global state when debuging has been enabled', () => {
                let debugCallback = jasmine.createSpy('debugCallback');
                d.bootstrap(debugCallback);
                givenStore({ some: { nested: { state: 'value' } } });
                s.setState({ key: 'some' }, { nested: { state: 'newValue' } });

                expect(debugCallback).toHaveBeenCalledWith('Current state:', s.getState(s.rootCursor));
            });

            it('sets new instances of nodes which is in the path to root state', () => {
                let initState = { some: { nested: { state: 'value' } } };
                givenStore(initState);

                s.setState({ key: 'some.nested.state' }, 'newValue');

                let newState = s.getState(rootCursorTestFixture);
                expect(newState).not.toBe(initState);
                expect(newState.some).not.toBe(initState.some);
                expect(newState.some.nested).not.toBe(initState.some.nested);
            });
        });

        describe('with booting and dynamic/array cursor', () => {
            beforeEach(() => {
                s.bootstrap(tds.default());
            });

            it('sets nested state into array on specified index', () => {
                givenTodoStore({ todos: [{ done: false, name: 'First Todo' }, { done: false, name: 'Second Todo' }] });

                s.setState({ key: 'todos.1.name' }, 'New Todo Name');

                expect(s.getState({ key: 'todos.1.name' })).toBe('New Todo Name');
            });

            it('sets new state into array on specified index', () => {
                givenTodoStore({ todos: [{ done: false, name: 'First Todo' }] });

                s.setState({ key: 'todos.0' }, { done: false, name: 'Second Todo' });

                expect(s.getState({ key: 'todos.0' })).toEqual({ done: false, name: 'Second Todo' });
            });

            it('sets new instance of array when nested item has been changed', () => {
                let storedTodos = [{ done: false, name: 'First Todo' }, { done: false, name: 'Second Todo' }];
                givenTodoStore({ todos: storedTodos });

                s.setState({ key: 'todos.1.name' }, 'New Todo Name');

                expect(s.getState(tds.todosCursor)).not.toBe(storedTodos);
            });

            it('sets full array', () => {
                givenTodoStore({ todos: [{ done: false, name: 'First Todo' }] });

                s.setState(tds.todosCursor, [{ done: false, name: 'Second Todo' }, { done: false, name: 'Third Todo' }]);

                expect(s.getState(tds.todosCursor).length).toBe(2);
                expect(s.getState(tds.todosCursor)[0].name).toBe('Second Todo');
                expect(s.getState(tds.todosCursor)[1].name).toBe('Third Todo');
            });

            function givenTodoStore(state: tds.ITodosState) {
                s.setState(s.rootCursor, state);
            }
        });
    });

    function givenStore(state: IStateTestFixture) {
        s.setState(s.rootCursor, state);
    }

    function resetStore() {
        s.bootstrap(null);
    }
});

interface IStateTestFixture extends s.IState {
    some: {
        nested: {
            state: string;
        }
    }
}
