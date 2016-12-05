import * as h from '../src/helpers';

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
});

interface IDummyState {
    id: string
    list: number[]
    subObject: any
}