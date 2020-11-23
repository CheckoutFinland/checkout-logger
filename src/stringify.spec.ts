// tslint:disable: no-any
import { expect } from 'chai';
import { stringify } from './stringify';

describe('Stringify', () => {
    it('works like JSON.stringify for objects with no circular references', () => {
        const foo: { [key: string]: any } = {
            foo: 'bar',
            more: {
                bar: 'foo'
            }
        };
        expect(stringify(foo)).to.equal(JSON.stringify(foo));
    });
    it('removes circular references', () => {
        const circular: { [key: string]: any } = {
            foo: 'bar',
            itself: {}
        };
        circular.itself = circular;
        expect(stringify(circular)).to.equal('{"foo":"bar","itself":"[Circular]"}');
    });
    it('removes circular references deeper in the hierarchy', () => {
        const circular: { [key: string]: any } = {
            foo: 'bar',
            more: {
                bar: 'foo'
            }
        };
        circular.more.itself = circular;
        expect(stringify(circular)).to.equal('{"foo":"bar","more":{"bar":"foo","itself":"[Circular]"}}');
    });
});
