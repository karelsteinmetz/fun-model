/// <reference path="./jasmine"/>
import { shallowCopy } from '../src/helpers';

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

        it('copies all values', () => {
            let newState = shallowCopy(aState);

            expect(newState.id).toBe(aState.id);
            expect(newState.subObject.id).toBe(aState.subObject.id);
            expect(newState.list.length).toBe(aState.list.length);
        });

        it('returns new object', () => {
            let newState = shallowCopy(aState);

            expect(newState).not.toBe(aState);
        });

        it('returns original sub objects', () => {
            let newState = shallowCopy(aState);

            expect(newState.subObject).toBe(aState.subObject);
            expect(newState.list).toBe(aState.list);
        });

        it('sets properties in callback', () => {
            let newState = shallowCopy(aState, s => {
                s.id = 'newId';
                s.subObject = { id: 'newSubId' };
            });

            expect(newState.id).toBe('newId');
            expect(newState.subObject).toEqual({ id: 'newSubId'});
        });
    });
});

interface IDummyState {
    id: string
    list: number[]
    subObject: any
}