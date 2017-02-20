import * as s from '../src/store';
import * as tds from './todosState';
import * as af from '../src/actionFactory';
import * as d from '../src/debug';

describe('actionFactory', () => {
    let debugCallback: d.debugCallbackType

    beforeEach(() => {
        resetStore();
        af.bootstrap(null);
        debugCallback = jasmine.createSpy('debugCallback');
        d.bootstrap(debugCallback);
    });

    describe('bootstrap', () => {
        it('reports initialization when debug has been enabled.', () => {
            af.bootstrap(null);

            expect(debugCallback).toHaveBeenCalledWith('Action factory has been initialized.', undefined);
        });
    });

    describe('array by cursor factory', () => {
        let renderCallback: () => void;

        beforeEach(() => {
            renderCallback = jasmine.createSpy('render');
            af.bootstrap(renderCallback);
        });

        it('changes state in array', () => {
            givenTodosStore({
                todos: [{ done: false, name: 'First todo' }, { done: false, name: 'Second todo' }]
            });

            let testAction = af.createAction<tds.ITodo, tds.ITodoParams>(
                {
                    create: (params) => {
                        return { key: `todos.${params.index}` };
                    }
                },
                (state, params) => { return params.todo }
            );
            testAction({ index: 1, todo: { done: false, name: 'New second todo' } });

            expect(getTodos()[1].done).toBeFalsy();
            expect(getTodos()[1].name).toBe('New second todo');
        });

        it('changes nested state on existing index', () => {
            givenTodosStore({
                todos: [{ done: false, name: 'First todo' }, { done: false, name: 'Second todo' }]
            });

            let testAction = af.createAction<boolean, number>({ create: (index) => { return { key: `todos.${index}.done` } } }, (state) => { return true; });
            testAction(1);

            expect(getTodos()[1].done).toBeTruthy();
        });

        function givenTodosStore(state: tds.ITodosState) {
            s.setState(s.rootCursor, state);
        }

        function getTodos(): tds.ITodo[] {
            return s.getState(tds.todosCursor);
        }
    });

    describe('createAction', () => {
        describe('when renderCallback has not been set', () => {
            it('does not throw if action has been only declared.', () => {
                let testAction = af.createAction(NestedCursorTestFixture, (state: INestedState) => state);
                expect(testAction).not.toBeUndefined();
            });

            it('throws if key does not exist', () => {
                expect(() => {
                    let testAction = af.createAction(NestedCursorTestFixture, (state: INestedState) => { return { state: 'new nested state' }; });
                    testAction();
                }).toThrow('Render callback must be set before first usage through bootstrap(defaultState, () => { yourRenderCallback(); }).');
            });
        });

        describe('when renderCallback has been set', () => {
            let renderCallback: () => void;

            beforeEach(() => {
                renderCallback = jasmine.createSpy('render');
                af.bootstrap(renderCallback);
            });

            it('does not report current state when state has not been changed.', () => {
                givenStore(aState('nestedStateValue'));

                af.createAction(NestedCursorTestFixture, (state: INestedState) => state)();

                expect(debugCallback).not.toHaveBeenCalledWith('Global state has been changed.', undefined);
            });

            it('reports state changed when debug has been enabled.', () => {
                let newState = { state: 'newValue' };
                givenStore(aState('nestedStateValue'));

                af.createAction(NestedCursorTestFixture, (state: INestedState) => newState)();

                expect(debugCallback).toHaveBeenCalledWith('Global state has been changed.', undefined);
            });

            it('does not call render callback when state has not been changed', () => {
                givenStore(aState('nestedStateValue'));

                let testAction = af.createAction(NestedCursorTestFixture, (state: INestedState) => state);
                testAction();

                expect(renderCallback).not.toHaveBeenCalled();
            });

            it('calls render callback when state has been changed', () => {
                givenStore(aState('nestedStateValue'));

                let testAction = af.createAction(NestedCursorTestFixture, (state: INestedState) => { return { state: 'newValue' }; })
                testAction();

                expect(renderCallback).toHaveBeenCalled();
            });

            it('calls nested actions', () => {
                givenStore(aState('value'));

                const nestedAction2 = af.createAction(NestedCursorTestFixture, (state: INestedState) => {
                    return { state: `${state.state} -> newValueFromNestedAction2` };
                });

                const nestedAction = af.createAction(NestedCursorTestFixture, (state: INestedState) => {
                    nestedAction2();
                    return { state: `${state.state} -> newValueFromNestedAction` };
                });

                af.createAction(NestedCursorTestFixture, (state: INestedState) => {
                    nestedAction();
                    return { state: 'newValue' };
                })();

                expect(s.getState(NestedCursorTestFixture).state)
                    .toBe('newValue -> newValueFromNestedAction -> newValueFromNestedAction2');
            });

            it('throws on immutability violation', () => {
                givenStore(aState('nestedStateValue'));
                const testAction = af.createAction(SomeCursorTestFixture, (state: ISomeState) => {
                    state.nested.state = state.nested.state + 'newValue';
                    return state;
                });

                expect(() => {
                    testAction();
                }).toThrow();
            });

            it('does not throw on immutability violation in no debug mode', () => {
                d.bootstrap(undefined);
                givenStore(aState('nestedStateValue'));
                const testAction = af.createAction(SomeCursorTestFixture, (state: ISomeState) => {
                    state.nested.state = state.nested.state + 'newValue';
                    return state;
                });

                expect(() => {
                    testAction();
                }).not.toThrow();
            });
        });
    });

    describe('createActions', () => {
        describe('when renderCallback has not been set', () => {
            it('throws if key does not exist', () => {
                expect(() => {
                    let testAction = af.createActions({
                        cursor: NestedCursorTestFixture,
                        handler: (state: INestedState): INestedState => state
                    });
                    testAction();
                }).toThrow('Render callback must be set before first usage through bootstrap(defaultState, () => { yourRenderCallback(); }).');
            });
        });

        describe('when renderCallback has been set', () => {
            let renderCallback: () => void;

            beforeEach(() => {
                renderCallback = jasmine.createSpy('render');
                af.bootstrap(renderCallback);
            });

            it('does not call render callback when all states have not been changed', () => {
                givenStore(aState('nestedStateValue'));

                let testAction = af.createActions(
                    {
                        cursor: NestedCursorTestFixture,
                        handler: (state: INestedState): INestedState => state
                    }, {
                        cursor: NestedCursorTestFixture,
                        handler: (state: INestedState): INestedState => state
                    });
                testAction();

                expect(renderCallback).not.toHaveBeenCalled();
            });

            it('calls render callback when one of states has been changed', () => {
                givenStore(aState('nestedStateValue'));

                let testAction = af.createActions(
                    {
                        cursor: SomeCursorTestFixture,
                        handler: (state: ISomeState): ISomeState => { return { nested: state.nested, state: 'newStateValue' } }
                    },
                    {
                        cursor: NestedCursorTestFixture,
                        handler: (state: INestedState): INestedState => { return { state: 'newNestedStateValue' }; }
                    });
                testAction();

                expect(renderCallback).toHaveBeenCalled();
            });
        });
    });

    describe('createAsyncAction', () => {
        beforeEach(() => {
            jasmine.clock().install();
        });

        describe('when renderCallback has not been set', () => {
            it('does not throw if action has been only declared.', () => {
                let testAction = af.createAsyncAction(NestedCursorTestFixture, (state: INestedState) => state);
                expect(testAction).not.toBeUndefined();
            });

            it('throws if key does not exist', () => {
                expect(() => {
                    let testAction = af.createAsyncAction(NestedCursorTestFixture, (state: INestedState) => { return { state: 'new nested state' }; });
                    testAction();
                    jasmine.clock().tick(1);
                }).toThrow('Render callback must be set before first usage through bootstrap(defaultState, () => { yourRenderCallback(); }).');
            });
        });

        describe('when renderCallback has been set', () => {
            let renderCallback: () => void;

            beforeEach(() => {
                renderCallback = jasmine.createSpy('render');
                af.bootstrap(renderCallback);
            });

            it('does not report current state when state has not been changed.', () => {
                givenStore(aState('nestedStateValue'));

                let testAction = af.createAsyncAction(NestedCursorTestFixture, (state: INestedState) => state);
                testAction();
                jasmine.clock().tick(1);

                expect(debugCallback).not.toHaveBeenCalledWith('Global state has been changed.', undefined);
            });

            it('reports state changed when debug has been enabled.', () => {
                let newState = { state: 'newValue' };
                givenStore(aState('nestedStateValue'));

                let testAction = af.createAsyncAction(NestedCursorTestFixture, (state: INestedState) => newState);
                testAction();
                jasmine.clock().tick(1);

                expect(debugCallback).toHaveBeenCalledWith('Global state has been changed.', undefined);
            });

            it('does not call render callback when state has not been changed', () => {
                givenStore(aState('nestedStateValue'));

                let testAction = af.createAsyncAction(NestedCursorTestFixture, (state: INestedState) => state);
                testAction();
                jasmine.clock().tick(1);

                expect(renderCallback).not.toHaveBeenCalled();
            });

            it('calls render callback when state has been changed', () => {
                givenStore(aState('nestedStateValue'));

                let testAction = af.createAsyncAction(NestedCursorTestFixture, (state: INestedState) => { return { state: 'newValue' }; });
                testAction();
                jasmine.clock().tick(1);

                expect(renderCallback).toHaveBeenCalled();
            });

            it('returns new state in resolve', (done) => {
                givenStore(aState('nestedStateValue'));
                let newState = { state: 'newValue' };

                let testAction = af.createAsyncAction(NestedCursorTestFixture, (state: INestedState) => newState);
                testAction()
                    .then(r => {
                        expect(r).toBe(newState);
                        done();
                    });
                jasmine.clock().tick(1);
            });
        });

        afterEach(() => {
            jasmine.clock().uninstall();
        });
    });
});

function givenStore(state: IStateTestFixture) {
    s.setState(s.rootCursor, state);
}

function resetStore() {
    s.bootstrap({ some: { nested: { state: null } } });
}

function aState(nestedState: string = 'aNestedState', state: string = 'aState'): IStateTestFixture {
    return { some: { nested: { state: nestedState }, state: state } };
}

interface IStateTestFixture extends s.IState {
    some: ISomeState;
}

interface ISomeState extends s.IState {
    nested: INestedState
    state: string;
}

interface INestedState extends s.IState {
    state: string;
}

var NestedCursorTestFixture: s.ICursor<INestedState> = {
    key: 'some.nested'
}

var SomeCursorTestFixture: s.ICursor<ISomeState> = {
    key: 'some'
}
