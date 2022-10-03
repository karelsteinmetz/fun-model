import * as s from '../src/store';
import * as tds from './todosState';
import * as d from '../src/debug';

describe('store', () => {
    beforeEach(() => {
        resetStore();

        d.bootstrap(jasmine.createSpy('debugCallback'));
    });

    it('gets and sets root state if cursor key is rootStateKey', () => {
        s.bootstrap({ some: null });
        const state = { some: 'state' };

        s.setState(s.rootCursor, state);

        expect(s.getState(s.rootCursor)).toBe(state);
    });

    describe('rootCursor', () => {
        it('cursor has empty key', () => {
            expect(s.rootCursor.key).toBe('');
        });
    });

    describe('isExistingCursor', () => {
        describe('for Object', () => {
            beforeEach(() => {
                s.bootstrap({ some: { nested: { state: 'value' } } });
            });

            it('returns true when value exists in state through cursor', () => {
                const exists = s.isExistingCursor({ key: 'some.nested.state' });

                expect(exists).toBeTruthy();
            });

            it('returns false when value does not exist in state through cursor', () => {
                const exists = s.isExistingCursor({
                    key: 'some.nested.notExistingState',
                });

                expect(exists).toBeFalsy();
            });
        });
        describe('for Array', () => {
            beforeEach(() => {
                s.bootstrap({
                    some: { nested: { arrayState: ['value1', 'value2'] } },
                });
            });

            it('returns true when value exists in state through cursor', () => {
                const exists = s.isExistingCursor({
                    key: 'some.nested.arrayState.0',
                });

                expect(exists).toBeTruthy();
            });

            it('returns false when value does not exist in state through cursor', () => {
                const exists = s.isExistingCursor({
                    key: 'some.nested.arrayState.5',
                });

                expect(exists).toBeFalsy();
            });
        });
    });

    describe('getState', () => {
        describe('without booting', () => {
            it('throws if key does not exist', () => {
                expect(() => s.getState<s.IState>(s.rootCursor)).toThrowError(
                    'Default state must be set before first usage through bootstrap(defaultState, () => { yourRenderCallback(); }).'
                );
            });
        });

        describe('with booting', () => {
            beforeEach(() => {
                s.bootstrap({ some: { nested: { state: 'value' } } });
            });

            it('returns nested state by cursor', () => {
                givenStore({ some: { nested: { state: 'value' } } });

                const state = s.getState({ key: 'some.nested.state' });

                expect(state).toBe('value');
            });

            it('returns nested state by cursor when current value of sub state is empty string', () => {
                givenStore({ some: { nested: { state: '' } } });

                const state = s.getState({ key: 'some.nested.state' });

                expect(state).toBe('');
            });

            it('throws if key does not exist', () => {
                expect(() =>
                    s.getState<s.IState>({ key: 'notExistingKey' })
                ).toThrowError(
                    'State for cursor key (notExistingKey) does not exist.'
                );
            });

            it('returns udefined if cursor allows that', () => {
                givenStore({ some: { nested: { state: 'value' } } });

                const state = s.getState({
                    key: 'some.nested.optional',
                    isUndefinable: true,
                });

                expect(state).toBeUndefined();
            });
        });

        describe('with booting and dynamic/array cursor', () => {
            beforeEach(() => {
                s.bootstrap(tds.default());
            });

            it('returns nested state in the array on specified index', () => {
                givenTodoStore({
                    todos: [
                        { done: false, name: 'First Todo' },
                        { done: false, name: 'Second Todo' },
                    ],
                    nullableNumber: null,
                });

                const state = s.getState<string>({ key: 'todos.1.name' });

                expect(state).toBe('Second Todo');
            });

            it('returns full array when is as last key', () => {
                givenTodoStore({
                    todos: [{ done: false, name: 'First Todo' }],
                    nullableNumber: null,
                });

                const state = s.getState<tds.ITodo[]>(tds.todosCursor);

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
                expect(() => s.setState(s.rootCursor, {})).toThrowError(
                    'Default state must be set before first usage through bootstrap(defaultState, () => { yourRenderCallback(); }).'
                );
            });
        });

        describe('with booting', () => {
            const rootCursorTestFixture: s.ICursor<IStateTestFixture> = {
                key: '',
            };

            beforeEach(() => {
                s.bootstrap({ key: null }, true);
            });

            it('throws if cursor has not existing key', () => {
                const cursor = { key: 'invalid' };
                expect(() => s.setState(cursor, {})).toThrowError();
            });

            it('creates empty object if cursor has not existing key if told to', () => {
                const cursor = { key: 'invalid' };
                s.setState(cursor, {}, true);

                expect(s.getState(s.rootCursor)).toEqual({
                    key: null,
                    invalid: {},
                });
            });

            it('creates neseted empty objects if cursor has not existing key if told to', () => {
                const cursor = { key: 'not.existing.key' };
                s.setState(cursor, {}, true);

                expect(s.getState(s.rootCursor)).toEqual({
                    key: null,
                    not: { existing: { key: {} } },
                });
            });

            it('freezes state', () => {
                givenStore({ some: { nested: { state: 'value' } } });

                let state = { nested: { state: 'newValue' } };
                s.setState({ key: 'some' }, state);

                expect(Object.isFrozen(state)).toBeTruthy();
            });

            it('sets nested state by cursor', () => {
                givenStore({ some: { nested: { state: 'value' } } });

                s.setState({ key: 'some' }, { nested: { state: 'newValue' } });

                expect(
                    s.getState(rootCursorTestFixture).some.nested.state
                ).toBe('newValue');
            });

            it('sets nested state by cursor when current value of sub state is empty string', () => {
                givenStore({ some: { nested: { state: '' } } });

                s.setState({ key: 'some' }, { nested: { state: 'newValue' } });

                expect(
                    s.getState(rootCursorTestFixture).some.nested.state
                ).toBe('newValue');
            });

            it('sets new instance of root state', () => {
                const initState = { some: { nested: { state: 'value' } } };
                givenStore(initState);

                s.setState({ key: 'some' }, { nested: { state: 'newValue' } });

                expect(s.getState(s.rootCursor)).not.toBe(initState);
            });

            it('logs new global state when debuging has been enabled', () => {
                const debugCallback = jasmine.createSpy('debugCallback');
                d.bootstrap(debugCallback);
                givenStore({ some: { nested: { state: 'value' } } });
                s.setState({ key: 'some' }, { nested: { state: 'newValue' } });

                expect(debugCallback).toHaveBeenCalledWith(
                    'Current state:',
                    s.getState(s.rootCursor)
                );
            });

            it('sets new instances of nodes which is in the path to root state', () => {
                const initState = { some: { nested: { state: 'value' } } };
                givenStore(initState);

                s.setState({ key: 'some.nested.state' }, 'newValue');

                const newState = s.getState(rootCursorTestFixture);
                expect(newState).not.toBe(initState);
                expect(newState.some).not.toBe(initState.some);
                expect(newState.some.nested).not.toBe(initState.some.nested);
            });

            it('can replace undefined with correct cursor', () => {
                givenStore({ some: { nested: { state: 'value' } } });

                s.setState(
                    { key: 'some.nested.optional', isUndefinable: true },
                    'newValue'
                );

                const newState = s.getState(rootCursorTestFixture);
                expect(newState.some.nested.optional).toBe('newValue');
            });
        });

        describe('with booting and dynamic/array cursor', () => {
            beforeEach(() => {
                s.bootstrap(tds.default());
            });

            it('sets nested state into array on specified index', () => {
                givenTodoStore({
                    todos: [
                        { done: false, name: 'First Todo' },
                        { done: false, name: 'Second Todo' },
                    ],
                    nullableNumber: null,
                });

                s.setState({ key: 'todos.1.name' }, 'New Todo Name');

                expect(s.getState({ key: 'todos.1.name' })).toBe(
                    'New Todo Name'
                );
            });

            it('sets new state into array on specified index', () => {
                givenTodoStore({
                    todos: [{ done: false, name: 'First Todo' }],
                    nullableNumber: null,
                });

                s.setState(
                    { key: 'todos.0' },
                    { done: false, name: 'Second Todo' }
                );

                expect(s.getState({ key: 'todos.0' })).toEqual({
                    done: false,
                    name: 'Second Todo',
                });
            });

            it('sets new instance of array when nested item has been changed', () => {
                const storedTodos = [
                    { done: false, name: 'First Todo' },
                    { done: false, name: 'Second Todo' },
                ];
                givenTodoStore({
                    todos: storedTodos,
                    nullableNumber: null,
                });

                s.setState({ key: 'todos.1.name' }, 'New Todo Name');

                expect(s.getState(tds.todosCursor)).not.toBe(storedTodos);
            });

            it('sets full array', () => {
                givenTodoStore({
                    todos: [{ done: false, name: 'First Todo' }],
                    nullableNumber: null,
                });

                s.setState(tds.todosCursor, [
                    { done: false, name: 'Second Todo' },
                    { done: false, name: 'Third Todo' },
                ]);

                expect(s.getState(tds.todosCursor).length).toBe(2);
                expect(s.getState(tds.todosCursor)[0].name).toBe('Second Todo');
                expect(s.getState(tds.todosCursor)[1].name).toBe('Third Todo');
            });

            function givenTodoStore(state: tds.ITodosState) {
                s.setState(s.rootCursor, state);
            }
        });

        describe('with booting and nullableNumber cursor', () => {
            beforeEach(() => {
                s.bootstrap(tds.default());
            });

            it('read null from state', () => {
                const value = s.getState(tds.nullableNumberCursor);

                expect(value).toBeNull();
            });

            it('write value to state', () => {
                s.setState(tds.nullableNumberCursor, 10);

                expect(s.getState(tds.nullableNumberCursor)).toBe(10);
            });

            it('write null to state', () => {
                s.setState(s.rootCursor, <tds.ITodosState>{
                    todos: [{ done: false, name: 'First Todo' }],
                    nullableNumber: 10,
                });

                s.setState(tds.nullableNumberCursor, null);

                expect(s.getState(tds.nullableNumberCursor)).toBeNull();
            });
        });
    });

    function givenStore(state: IStateTestFixture) {
        s.setState(s.rootCursor, state);
    }

    function resetStore(withFreezing: boolean = false) {
        s.bootstrap(null, withFreezing);
    }
});

interface IStateTestFixture extends s.IState {
    some: {
        nested: {
            state: string;
            optional?: string;
        };
    };
}
