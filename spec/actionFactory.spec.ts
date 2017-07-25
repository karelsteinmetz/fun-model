import * as s from '../src/store';
import * as tds from './todosState';
import * as af from '../src/actionFactory';
import * as d from '../src/debug';

describe('actionFactory', () => {
    let debugCallback: d.debugCallbackType
    let renderCallback: () => void;

    beforeEach(() => {
        resetStore();
        af.bootstrap(null);
        renderCallback = jasmine.createSpy('render');
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
        beforeEach(() => {
            af.bootstrap(renderCallback);
        });

        it('changes state in array', () => {
            givenTodosStore({
                todos: [{ done: false, name: 'First todo' }, { done: false, name: 'Second todo' }],
                nullableNumber: null
            });

            let testAction = af.createAction<tds.ITodo, tds.ITodoParams>(
                {
                    create: (params: tds.ITodoParams) => {
                        return { key: `todos.${params.index}` };
                    }
                },
                (_state: tds.ITodo, params: tds.ITodoParams) => { return params.todo }
            );
            testAction({ index: 1, todo: { done: false, name: 'New second todo' } });

            expect(getTodos()[1].done).toBeFalsy();
            expect(getTodos()[1].name).toBe('New second todo');
        });

        it('changes nested state on existing index', () => {
            givenTodosStore({
                todos: [{ done: false, name: 'First todo' }, { done: false, name: 'Second todo' }],
                nullableNumber: null
            });

            let testAction = af.createAction<boolean, number>({ create: (index) => { return { key: `todos.${index}.done` } } }, () => { return true; });
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
        describe('when action threw during handling and catching have not been enabled', () => {
            let throwingAction: af.IParamLessAction;
            beforeEach(() => {
                af.bootstrap(renderCallback, false);
                throwingAction = af.createParamLessAction(NestedCursorTestFixture, () => {
                    throw 'MyDummyException';
                });
            });

            it('throws', () => {
                expect(throwingAction).toThrow();
            });
        });

        describe('when action threw during handling and catching have been enabled', () => {
            let throwingAction: af.IParamLessAction;
            beforeEach(() => {
                af.bootstrap(renderCallback, true);
                throwingAction = af.createParamLessAction(NestedCursorTestFixture, () => {
                    throw 'MyDummyException';
                });
            });

            it('does not throw', () => {
                expect(throwingAction).not.toThrow();
            });

            it('logs error', () => {
                throwingAction();

                expect(debugCallback).toHaveBeenCalledWith('Action factory has been initialized.', undefined);
            });
        });

        describe('when renderCallback has not been set', () => {
            it('does not throw if action has been only declared.', () => {
                let testAction = af.createAction(NestedCursorTestFixture, (state: INestedState) => state);
                expect(testAction).not.toBeUndefined();
            });

            it('throws if key does not exist', () => {
                expect(() => {
                    let testAction = af.createParamLessAction(NestedCursorTestFixture, () => { return { state: 'new nested state' }; });
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

                af.createParamLessAction(NestedCursorTestFixture, (state: INestedState) => state)();

                expect(debugCallback).not.toHaveBeenCalledWith('Global state has been changed.', undefined);
            });

            it('reports state changed when debug has been enabled.', () => {
                let newState = { state: 'newValue' };
                givenStore(aState('nestedStateValue'));

                af.createParamLessAction(NestedCursorTestFixture, () => newState)();

                expect(debugCallback).toHaveBeenCalledWith('Global state has been changed.', undefined);
            });

            it('does not call render callback when state has not been changed', () => {
                givenStore(aState('nestedStateValue'));

                let testAction = af.createParamLessAction(NestedCursorTestFixture, (state: INestedState) => state);
                testAction();

                expect(renderCallback).not.toHaveBeenCalled();
            });

            it('calls render callback when state has been changed', () => {
                givenStore(aState('nestedStateValue'));

                let testAction = af.createParamLessAction(NestedCursorTestFixture, () => { return { state: 'newValue' }; })
                testAction();

                expect(renderCallback).toHaveBeenCalled();
            });

            it('calls nested actions', () => {
                givenStore(aState('value'));

                const nestedAction2 = af.createParamLessAction(NestedCursorTestFixture, (state: INestedState) => {
                    return { state: `${state.state} -> newValueFromNestedAction2` };
                });

                const nestedAction = af.createParamLessAction(NestedCursorTestFixture, (state: INestedState) => {
                    nestedAction2();
                    return { state: `${state.state} -> newValueFromNestedAction` };
                });

                af.createParamLessAction(NestedCursorTestFixture, () => {
                    nestedAction();
                    return { state: 'newValue' };
                })();

                expect(s.getState(NestedCursorTestFixture).state)
                    .toBe('newValue -> newValueFromNestedAction -> newValueFromNestedAction2');
            });

            it('does not throw on immutability violation in no debug mode', () => {
                d.bootstrap(undefined);
                givenStore(aState('nestedStateValue'));
                const testAction = af.createParamLessAction(SomeCursorTestFixture, (state: ISomeState) => {
                    state.nested.state = state.nested.state + 'newValue';
                    return state;
                });

                expect(() => {
                    testAction();
                }).not.toThrow();
            });
        });
    });

    describe('createReplaceAction', () => {
        beforeEach(() => {
            af.bootstrap(renderCallback, false);
        });
        it('calls render callback if the state has not been same', () => {
            givenStore(aState('nestedStateValue'));
            const testAction = af.createReplaceAction<string>(NestedStateCursorTestFixture);

            testAction('newNestedStateValue');

            expect(renderCallback).toHaveBeenCalled();
        });
        it('does not call render callback for the same state', () => {
            givenStore(aState('nestedStateValue'));
            const testAction = af.createReplaceAction<string>(NestedStateCursorTestFixture);

            testAction('nestedStateValue');
            expect(renderCallback).not.toHaveBeenCalled();
        });
        it('replaces if the state has not been same', () => {
            givenStore(aState('nestedStateValue'));
            const testAction = af.createReplaceAction<string>(NestedStateCursorTestFixture);

            testAction('newNestedStateValue');

            expect(s.getState(NestedStateCursorTestFixture)).toBe('newNestedStateValue');
        });
        it('does not replace the same state', () => {
            givenStore(aState('nestedStateValue'));
            const testAction = af.createReplaceAction<string>(NestedStateCursorTestFixture);

            testAction('nestedStateValue');

            expect(s.getState(NestedStateCursorTestFixture)).toBe('nestedStateValue');
        });
    })

    describe('createActions', () => {
        describe('when renderCallback has not been set', () => {
            it('throws if key does not exist', () => {
                expect(() => {
                    let testAction = af.createParamLessActions({
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

                let testAction = af.createParamLessActions(
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

                let testAction = af.createParamLessActions(
                    {
                        cursor: SomeCursorTestFixture,
                        handler: (state: ISomeState): ISomeState => { return { nested: state.nested, state: 'newStateValue' } }
                    },
                    {
                        cursor: NestedCursorTestFixture,
                        handler: (): INestedState => { return { state: 'newNestedStateValue' }; }
                    });
                testAction();

                expect(renderCallback).toHaveBeenCalled();
            });
        });
    });
});

function givenStore(state: IStateTestFixture) {
    s.setState(s.rootCursor, state);
}

function resetStore(withFreezing: boolean = false) {
    s.bootstrap({ some: { nested: { state: null } } }, withFreezing);
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

var NestedStateCursorTestFixture: s.ICursor<string> = {
    key: 'some.nested.state'
}

var SomeCursorTestFixture: s.ICursor<ISomeState> = {
    key: 'some'
}
