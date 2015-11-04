/// <reference path="./jasmine"/>
import * as s from '../src/store';
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
                        cursor: NestedCursorTestFixture,
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

var SomeCursorTestFixture: s.ICursor<INestedState> = {
    key: 'some.nested'
}
