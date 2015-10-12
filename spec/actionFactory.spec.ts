/// <reference path="./jasmine"/>
import * as s from '../src/store';
import { createAction, createActions, bootstrap } from '../src/actionFactory';
import { IState, ICursor } from '../src/store';

describe('actionFactory', () => {

    beforeEach(() => {
        resetStore();
        bootstrap(null);
    });

    describe('createAction', () => {
        describe('when renderCallback has not been set', () => {
            it('does not throw if action has been only declared.', () => {
                let testAction = createAction(NestedCursorTestFixture, (state: INestedState) => state);
                expect(testAction).not.toBeUndefined();
            });

            it('throws if key does not exist', () => {
                expect(() => {
                    let testAction = createAction(NestedCursorTestFixture, (state: INestedState) => { return { state: 'new nested state' }; });
                    testAction();
                }).toThrow('Render callback must be set before first usage through bootstrap(defaultState, () => { yourRenderCallback(); }).');
            });
        });

        describe('when renderCallback has been set', () => {
            let renderCallback: () => void;

            beforeEach(() => {
                renderCallback = jasmine.createSpy('render');
                bootstrap(renderCallback);
            });

            it('does not call render callback when state has not been changed', () => {
                givenStore(aState('nestedStateValue'));

                let testAction = createAction(NestedCursorTestFixture, (state: INestedState) => state);
                testAction();

                expect(renderCallback).not.toHaveBeenCalled();
            });

            it('calls render callback when state has been changed', () => {
                givenStore(aState('nestedStateValue'));

                let testAction = createAction(NestedCursorTestFixture, (state: INestedState) => { return { state: 'newValue' }; })
                testAction();

                expect(renderCallback).toHaveBeenCalled();
            });
        });
    });

    describe('createActions', () => {
        describe('when renderCallback has not been set', () => {
            it('throws if key does not exist', () => {
                expect(() => {
                    let testAction = createActions({
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
                bootstrap(renderCallback);
            });

            it('does not call render callback when all states have not been changed', () => {
                givenStore(aState('nestedStateValue'));

                let testAction = createActions(
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

                let testAction = createActions(
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

interface IStateTestFixture extends IState {
    some: ISomeState;
}

interface ISomeState extends IState {
    nested: INestedState
    state: string;
}

interface INestedState extends IState {
    state: string;
}

var NestedCursorTestFixture: ICursor<INestedState> = {
    key: 'some.nested'
}

var SomeCursorTestFixture: ICursor<INestedState> = {
    key: 'some.nested'
}
