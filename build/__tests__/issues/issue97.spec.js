"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __fixtures__1 = require("../__fixtures__");
const src_1 = require("../../src");
describe('Issue #97 - https://github.com/C2FO/fast-csv/issues/97', () => {
    it('should keep the original row', next => {
        const rs = new __fixtures__1.RecordingStream();
        const data = [
            { field1: 'a1"a', field2: 'b1"b' },
            { field1: 'a2"a', field2: 'b2"b' },
        ];
        src_1.write(data, { quote: false, headers: true })
            .pipe(rs)
            .on('error', next)
            .on('finish', () => {
            expect(rs.data.join('')).toBe('field1,field2\na1"a,b1"b\na2"a,b2"b');
            next();
        });
    });
});
//# sourceMappingURL=issue97.spec.js.map