"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/prefer-readonly-type */
/* eslint-disable functional/no-return-void */
const chai_1 = require("chai");
const stringify_1 = require("./stringify");
describe('Stringify', () => {
    it('works like JSON.stringify for objects with no circular references', () => {
        const foo = {
            foo: 'bar',
            more: {
                bar: 'foo'
            }
        };
        (0, chai_1.expect)((0, stringify_1.stringify)(foo)).to.equal(JSON.stringify(foo));
    });
    it('removes circular references', () => {
        const circular = {
            foo: 'bar',
            itself: {}
        };
        circular.itself = circular;
        (0, chai_1.expect)((0, stringify_1.stringify)(circular)).to.equal('{"foo":"bar","itself":"[Circular]"}');
    });
    it('removes circular references deeper in the hierarchy', () => {
        const circular = {
            foo: 'bar',
            more: {
                bar: 'foo'
            }
        };
        circular.more.itself = circular;
        (0, chai_1.expect)((0, stringify_1.stringify)(circular)).to.equal('{"foo":"bar","more":{"bar":"foo","itself":"[Circular]"}}');
    });
});
//# sourceMappingURL=stringify.spec.js.map