import * as h from '../src/helpers';
import { bootstrap } from '../src/debug';

describe('helpers', () => {
    describe('shallowCopy', () => {
        let aState: IDummyState;

        beforeEach(() => {
            aState = {
                id: 'anId',
                list: [1, 2, 3],
                subObject: {
                    id: 'anSubId'
                }
            };
        });

        describe('on object', () => {
            it('copies all values', () => {
                let newState = h.shallowCopy(aState);

                expect(newState.id).toBe(aState.id);
                expect(newState.subObject.id).toBe(aState.subObject.id);
                expect(newState.list.length).toBe(aState.list.length);
            });

            it('returns new object', () => {
                let newState = h.shallowCopy(aState);

                expect(newState).not.toBe(aState);
            });

            it('returns original sub objects', () => {
                let newState = h.shallowCopy(aState);

                expect(newState.subObject).toBe(aState.subObject);
                expect(newState.list).toBe(aState.list);
            });

            it('sets properties in callback without return', () => {
                let newState = h.shallowCopy(aState, s => {
                    s.id = 'newId';
                    s.subObject = { id: 'newSubId' };
                });

                expect(newState.id).toBe('newId');
                expect(newState.subObject).toEqual({ id: 'newSubId' });
            });

            it('sets properties in nested shallowCopy', () => {
                let newState = h.shallowCopy(aState, s => h.shallowCopy(s, a => {
                    a.id = 'newId';
                    a.subObject = { id: 'newSubId' };
                    return a;
                }));

                expect(newState.id).toBe('newId');
                expect(newState.subObject).toEqual({ id: 'newSubId' });
            });

            it('sets properties in inline style', () => {
                let newState = h.shallowCopy(aState, s => {
                    s.id = 'newId';
                    s.subObject = { id: 'newSubId' };
                });

                expect(newState.id).toBe('newId');
                expect(newState.subObject).toEqual({ id: 'newSubId' });
            });
        });

        describe('on array', () => {
            let newState: IDummyState;

            beforeEach(() => {
                newState = h.shallowCopy(aState, ns => {
                    ns.list = h.shallowCopy(ns.list);
                });
            });

            it('creates instance of array', () => {
                expect(Array.isArray(newState.list)).toBeTruthy();
            });

            it('has same length', () => {
                expect(newState.list.length).toBe(aState.list.length);
            });

            it('has all own properties/values', () => {
                for (let key in newState.list) {
                    if (newState.list.hasOwnProperty(key) && typeof key !== 'function') {
                        expect(newState.list[key]).toBe(aState.list[key]);
                    }
                }
            })
        });

        describe('on primitive', () => {
            it('calls callback', () => {
                const callback = jasmine.createSpy('callback');
                h.shallowCopy('test', callback);

                expect(callback).toHaveBeenCalledWith('test');
            });

            it('calls debug because of wrong usage', () => {
                const debug = jasmine.createSpy('debug');
                bootstrap(debug);
                h.shallowCopy('test');
                expect(debug).toHaveBeenCalled();
            });

            it('returns value when no callback provided', () => {
                const returnValue = h.shallowCopy('test');

                expect(returnValue).toBe('test');
            });

            it('respects returned value', () => {
                const returnValue = h.shallowCopy('test', (_original: string) => 'changed value');

                expect(returnValue).toBe('changed value');
            });
        });
    });

    describe('deepFreeze', () => {
        let state: IDummyState;

        beforeEach(() => {
            state = {
                id: 'anId',
                list: [1, 2, 3],
                subObject: {
                    id: 'anSubId'
                }
            };
            h.deepFreeze(state);
        })

        it('freezes root object', () => {
            expect(Object.isFrozen(state)).toBeTruthy();
        });

        it('freezes nested object', () => {
            expect(Object.isFrozen(state.subObject)).toBeTruthy();
        });

        it('freezes nested array', () => {
            expect(Object.isFrozen(state.list)).toBeTruthy();
        });
    })
});

interface IDummyState {
    id: string
    list: number[]
    subObject: any
}