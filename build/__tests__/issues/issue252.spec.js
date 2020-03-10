"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const csv = __importStar(require("../../src"));
const __fixtures__1 = require("../__fixtures__");
describe('Issue #252 - https://github.com/C2FO/fast-csv/issues/252', () => {
    it('should keep the original row', next => {
        const rs = new __fixtures__1.RecordingStream();
        const data = [
            ['a', 'b', 'c'],
            ['d', 'e', 'f'],
        ];
        csv.write(data, {
            headers: ['header1', 'header2', 'header3'],
        })
            .pipe(rs)
            .on('error', next)
            .on('finish', () => {
            expect(rs.data.join('')).toBe('header1,header2,header3\na,b,c\nd,e,f');
            next();
        });
    });
});
//# sourceMappingURL=issue252.spec.js.map