"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const csv = __importStar(require("../../src"));
describe('Issue #77 - https://github.com/C2FO/fast-csv/issues/77', () => {
    it('should sort columns by order of headers defined when formatting a csv', next => {
        const writable = fs.createWriteStream(path.resolve(__dirname, '__fixtures__/test.csv'), { encoding: 'utf8' });
        const csvStream = csv.format({ headers: ['second', 'first'] }).on('error', next);
        writable.on('finish', () => {
            expect(fs.readFileSync(path.resolve(__dirname, '__fixtures__', 'test.csv'))).toEqual(Buffer.from('second,first\n2,1'));
            fs.unlinkSync(path.resolve(__dirname, '__fixtures__', 'test.csv'));
            next();
        });
        csvStream.pipe(writable);
        [{ first: '1', second: '2' }].forEach(item => csvStream.write(item));
        csvStream.end();
    });
    it('should write headers even with no data when formatting a csv', next => {
        const writable = fs.createWriteStream(path.resolve(__dirname, '__fixtures__/test.csv'), { encoding: 'utf8' });
        const csvStream = csv.format({ headers: ['first', 'second'] }).on('error', next);
        writable.on('finish', () => {
            expect(fs.readFileSync(path.resolve(__dirname, '__fixtures__/test.csv'))).toEqual(Buffer.from('first,second\n,'));
            fs.unlinkSync(path.resolve(__dirname, '__fixtures__/test.csv'));
            next();
        });
        csvStream.pipe(writable);
        [{}].forEach(item => csvStream.write(item));
        csvStream.end();
    });
});
//# sourceMappingURL=issue77.spec.js.map