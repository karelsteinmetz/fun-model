/// <reference path="./jasmine"/>
import * as s from '../src/store';

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

            it('throws if key does not exist', () => {
                expect(() => s.getState<s.IState>({ key: 'not.existing.key' }))
                    .toThrow('State for cursor key (not.existing.key) does not exist.');
            });

            it('throws if cursor key is null', () => {
                expect(() => s.getState<s.IState>({ key: null }))
                    .toThrow('Cursor key cannot be null.');
            });
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

            it('sets new instance of root state', () => {
                let initState = { some: { nested: { state: 'value' } } };
                givenStore(initState);

                s.setState({ key: 'some' }, { nested: { state: 'newValue' } });

                expect(s.getState(s.rootCursor)).not.toBe(initState);
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
