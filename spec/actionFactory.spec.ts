/// <reference path="./jasmine"/>
import * as s from '../src/store';
import { createAction, bootstrap } from '../src/actionFactory';
import { IState, ICursor } from '../src/store';

describe('actionFactory', () => {

    beforeEach(() => {
        resetStore();
    });

    describe('createAction', () => {
        describe('when renderCallback has not been set', () => {
            it('does not throw if action has been only declared.', () => {
                let testAction = createAction(CursorTestFixture, (state: INestedState) => {
                    return state;
                });
                expect(testAction).not.toBeUndefined();
            });
            it('throws if key does not exist', () => {
                expect(() => {
                    let testAction = createAction(CursorTestFixture, (state: INestedState) => {
                        return { state: 'new nested state'};
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

            describe('createAction', () => {

                it('does not call render callback when state has not been changed', () => {
                    givenStore({ some: { nested: { state: 'value' } } });

                    let testAction = createAction(CursorTestFixture, (state: INestedState) => {
                        return state;
                    });
                    testAction();

                    expect(renderCallback).not.toHaveBeenCalled();
                });

                it('calls render callback when state has been changed', () => {
                    givenStore({ some: { nested: { state: 'value' } } });

                    let testAction = createAction(CursorTestFixture, (state: INestedState) => {
                        return { state: 'newValue' };
                    })();

                    expect(renderCallback).toHaveBeenCalled();
                });
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

interface IStateTestFixture extends IState {
    some: {
        nested: INestedState;
    }
}

interface INestedState extends IState {
    state: string;
}

var CursorTestFixture: ICursor<INestedState> = {
    key: 'some.nested'
}
