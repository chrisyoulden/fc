"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const src_1 = require("../src");
const __fixtures__1 = require("./__fixtures__");
describe('.writeToString', () => {
    it('should write an array of arrays', () => expect(src_1.writeToString(__fixtures__1.arrayRows, { headers: true })).resolves.toEqual('a,b\na1,b1\na2,b2'));
    it('should support transforming an array of arrays', () => expect(src_1.writeToString(__fixtures__1.arrayRows, {
        headers: true,
        transform(row) {
            return row.map(entry => entry.toUpperCase());
        },
    })).resolves.toEqual('A,B\nA1,B1\nA2,B2'));
    it('should write an array of multi-dimensional arrays', () => expect(src_1.writeToString(__fixtures__1.multiDimensionalRows, { headers: true })).resolves.toEqual('a,b\na1,b1\na2,b2'));
    it('should support transforming an array of multi-dimensional arrays', () => expect(src_1.writeToString(__fixtures__1.multiDimensionalRows, {
        headers: true,
        transform(row) {
            return row.map(col => [col[0], col[1].toUpperCase()]);
        },
    })).resolves.toEqual('a,b\nA1,B1\nA2,B2'));
    it('should write an array of objects', () => expect(src_1.writeToString(__fixtures__1.objectRows, {
        headers: true,
        transform(row) {
            return {
                A: row.a,
                B: row.b,
            };
        },
    })).resolves.toEqual('A,B\na1,b1\na2,b2'));
    describe('header option', () => {
        it('should write an array of objects without headers', () => expect(src_1.writeToString(__fixtures__1.objectRows, { headers: false })).resolves.toEqual('a1,b1\na2,b2'));
        it('should write an array of objects with headers', () => expect(src_1.writeToString(__fixtures__1.objectRows, { headers: true })).resolves.toEqual('a,b\na1,b1\na2,b2'));
        it('should write an array of arrays without headers', async () => {
            const rows = [
                ['a1', 'b1'],
                ['a2', 'b2'],
            ];
            await expect(src_1.writeToString(rows, { headers: false })).resolves.toEqual('a1,b1\na2,b2');
        });
        it('should write an array of arrays with headers', () => expect(src_1.writeToString(__fixtures__1.arrayRows, { headers: true })).resolves.toEqual('a,b\na1,b1\na2,b2'));
        it('should write an array of multi-dimensional arrays without headers', () => expect(src_1.writeToString(__fixtures__1.multiDimensionalRows, { headers: false })).resolves.toEqual('a1,b1\na2,b2'));
        it('should write an array of multi-dimensional arrays with headers', () => expect(src_1.writeToString(__fixtures__1.multiDimensionalRows, { headers: true })).resolves.toEqual('a,b\na1,b1\na2,b2'));
    });
    describe('rowDelimiter option', () => {
        it('should support specifying an alternate row delimiter', () => expect(src_1.writeToString(__fixtures__1.objectRows, { headers: true, rowDelimiter: '\r\n' })).resolves.toEqual('a,b\r\na1,b1\r\na2,b2'));
        it('should escape values that contain the alternate row delimiter', async () => {
            const rows = [
                { a: 'a\t1', b: 'b1' },
                { a: 'a\t2', b: 'b2' },
            ];
            await expect(src_1.writeToString(rows, { headers: true, rowDelimiter: '\t' })).resolves.toEqual('a,b\t"a\t1",b1\t"a\t2",b2');
        });
    });
    it('should add a final rowDelimiter if includeEndRowDelimiter is true', () => expect(src_1.writeToString(__fixtures__1.objectRows, { headers: true, includeEndRowDelimiter: true })).resolves.toEqual('a,b\na1,b1\na2,b2\n'));
});
describe('.writeToBuffer', () => {
    it('should write an array of arrays', () => expect(src_1.writeToBuffer(__fixtures__1.arrayRows, { headers: true })).resolves.toEqual(Buffer.from('a,b\na1,b1\na2,b2')));
    it('should support transforming an array of arrays', () => expect(src_1.writeToBuffer(__fixtures__1.arrayRows, {
        headers: true,
        transform(row) {
            return row.map(entry => entry.toUpperCase());
        },
    })).resolves.toEqual(Buffer.from('A,B\nA1,B1\nA2,B2')));
    it('should write an array of multi-dimensional arrays', () => expect(src_1.writeToBuffer(__fixtures__1.multiDimensionalRows, { headers: true })).resolves.toEqual(Buffer.from('a,b\na1,b1\na2,b2')));
    it('should support transforming an array of multi-dimensional arrays', () => expect(src_1.writeToBuffer(__fixtures__1.multiDimensionalRows, {
        headers: true,
        transform(row) {
            return row.map(col => [col[0], col[1].toUpperCase()]);
        },
    })).resolves.toEqual(Buffer.from('a,b\nA1,B1\nA2,B2')));
    it('should write an array of objects', () => expect(src_1.writeToBuffer(__fixtures__1.objectRows, {
        headers: true,
        transform(row) {
            return {
                A: row.a,
                B: row.b,
            };
        },
    })).resolves.toEqual(Buffer.from('A,B\na1,b1\na2,b2')));
    describe('header option', () => {
        it('should write an array of objects without headers', () => expect(src_1.writeToBuffer(__fixtures__1.objectRows, { headers: false })).resolves.toEqual(Buffer.from('a1,b1\na2,b2')));
        it('should write an array of objects with headers', () => expect(src_1.writeToBuffer(__fixtures__1.objectRows, { headers: true })).resolves.toEqual(Buffer.from('a,b\na1,b1\na2,b2')));
        it('should write an array of arrays without headers', async () => {
            const rows = [
                ['a1', 'b1'],
                ['a2', 'b2'],
            ];
            await expect(src_1.writeToBuffer(rows, { headers: false })).resolves.toEqual(Buffer.from('a1,b1\na2,b2'));
        });
        it('should write an array of arrays with headers', () => expect(src_1.writeToBuffer(__fixtures__1.arrayRows, { headers: true })).resolves.toEqual(Buffer.from('a,b\na1,b1\na2,b2')));
        it('should write an array of multi-dimensional arrays without headers', () => expect(src_1.writeToBuffer(__fixtures__1.multiDimensionalRows, { headers: false })).resolves.toEqual(Buffer.from('a1,b1\na2,b2')));
        it('should write an array of multi-dimensional arrays with headers', () => expect(src_1.writeToBuffer(__fixtures__1.multiDimensionalRows, { headers: true })).resolves.toEqual(Buffer.from('a,b\na1,b1\na2,b2')));
    });
    describe('rowDelimiter option', () => {
        it('should support specifying an alternate row delimiter', () => expect(src_1.writeToBuffer(__fixtures__1.objectRows, { headers: true, rowDelimiter: '\r\n' })).resolves.toEqual(Buffer.from('a,b\r\na1,b1\r\na2,b2')));
        it('should escape values that contain the alternate row delimiter', async () => {
            const rows = [
                { a: 'a\t1', b: 'b1' },
                { a: 'a\t2', b: 'b2' },
            ];
            await expect(src_1.writeToBuffer(rows, { headers: true, rowDelimiter: '\t' })).resolves.toEqual(Buffer.from('a,b\t"a\t1",b1\t"a\t2",b2'));
        });
    });
    it('should add a final rowDelimiter if includeEndRowDelimiter is true', () => expect(src_1.writeToBuffer(__fixtures__1.objectRows, { headers: true, includeEndRowDelimiter: true })).resolves.toEqual(Buffer.from('a,b\na1,b1\na2,b2\n')));
});
describe('.write', () => {
    const writeToRecordingStream = (rows, options = {}) => new Promise((res, rej) => {
        const rs = new __fixtures__1.RecordingStream();
        src_1.write(rows, options)
            .on('error', rej)
            .pipe(rs)
            .on('finish', () => {
            res(rs.data);
        });
    });
    it('should write an array of arrays', () => expect(writeToRecordingStream(__fixtures__1.arrayRows, { headers: true })).resolves.toEqual(['a,b', '\na1,b1', '\na2,b2']));
    it('should support transforming an array of arrays', () => expect(writeToRecordingStream(__fixtures__1.arrayRows, {
        headers: true,
        transform(row) {
            return row.map(entry => entry.toUpperCase());
        },
    })).resolves.toEqual(['A,B', '\nA1,B1', '\nA2,B2']));
    it('should write an array of multi-dimensional arrays', () => expect(writeToRecordingStream(__fixtures__1.multiDimensionalRows, { headers: true })).resolves.toEqual([
        'a,b',
        '\na1,b1',
        '\na2,b2',
    ]));
    it('should support transforming an array of multi-dimensional arrays', () => expect(writeToRecordingStream(__fixtures__1.multiDimensionalRows, {
        headers: true,
        transform(row) {
            return row.map(col => [col[0], col[1].toUpperCase()]);
        },
    })).resolves.toEqual(['a,b', '\nA1,B1', '\nA2,B2']));
    it('should write an array of objects', () => expect(writeToRecordingStream(__fixtures__1.objectRows, { headers: true })).resolves.toEqual(['a,b', '\na1,b1', '\na2,b2']));
    it('should support transforming an array of objects', () => expect(writeToRecordingStream(__fixtures__1.objectRows, {
        headers: true,
        transform(row) {
            return {
                A: row.a,
                B: row.b,
            };
        },
    })).resolves.toEqual(['A,B', '\na1,b1', '\na2,b2']));
    describe('rowDelimiter option', () => {
        it('should support specifying an alternate row delimiter', () => expect(writeToRecordingStream(__fixtures__1.objectRows, { headers: true, rowDelimiter: '\r\n' })).resolves.toEqual([
            'a,b',
            '\r\na1,b1',
            '\r\na2,b2',
        ]));
        it('should escape values that contain the alternate row delimiter', async () => {
            const rows = [
                { a: 'a\n1', b: 'b1' },
                { a: 'a\n2', b: 'b2' },
            ];
            await expect(writeToRecordingStream(rows, { headers: true, rowDelimiter: '\n' })).resolves.toEqual([
                'a,b',
                '\n"a\n1",b1',
                '\n"a\n2",b2',
            ]);
        });
    });
    it('should add a final rowDelimiter if includeEndRowDelimiter is true', () => expect(writeToRecordingStream(__fixtures__1.objectRows, { headers: true, includeEndRowDelimiter: true })).resolves.toEqual([
        'a,b',
        '\na1,b1',
        '\na2,b2',
        '\n',
    ]));
});
describe('.writeToPath', () => {
    const writeRowsToPath = (rows, options = {}) => new Promise((res, rej) => {
        const csvPath = path.resolve(__dirname, '__fixtures__', 'test_output.csv');
        src_1.writeToPath(csvPath, rows, options)
            .on('error', rej)
            .on('finish', () => {
            const content = fs.readFileSync(csvPath);
            fs.unlinkSync(csvPath);
            res(content);
        });
    });
    it('should write an array of arrays', () => expect(writeRowsToPath(__fixtures__1.arrayRows, { headers: true })).resolves.toEqual(Buffer.from('a,b\na1,b1\na2,b2')));
    it('should write an array of objects', () => expect(writeRowsToPath(__fixtures__1.objectRows, { headers: true })).resolves.toEqual(Buffer.from('a,b\na1,b1\na2,b2')));
    it('should write an array of multi-dimensional arrays', () => expect(writeRowsToPath(__fixtures__1.multiDimensionalRows, { headers: true })).resolves.toEqual(Buffer.from('a,b\na1,b1\na2,b2')));
    it('should support transforming an array of arrays', () => expect(writeRowsToPath(__fixtures__1.arrayRows, {
        headers: true,
        transform(row) {
            return row.map(entry => entry.toUpperCase());
        },
    })).resolves.toEqual(Buffer.from('A,B\nA1,B1\nA2,B2')));
    it('should transforming an array of objects', () => expect(writeRowsToPath(__fixtures__1.objectRows, {
        headers: true,
        transform(row) {
            return {
                A: row.a,
                B: row.b,
            };
        },
    })).resolves.toEqual(Buffer.from('A,B\na1,b1\na2,b2')));
    it('should transforming an array of multi-dimensional array', () => expect(writeRowsToPath(__fixtures__1.multiDimensionalRows, {
        headers: true,
        transform(row) {
            return row.map(col => [col[0], col[1].toUpperCase()]);
        },
    })).resolves.toEqual(Buffer.from('a,b\nA1,B1\nA2,B2')));
    describe('rowDelimiter option', () => {
        it('should support specifying an alternate row delimiter', () => expect(writeRowsToPath(__fixtures__1.objectRows, { headers: true, rowDelimiter: '\r\n' })).resolves.toEqual(Buffer.from('a,b\r\na1,b1\r\na2,b2')));
        it('should escape values that contain the alternate row delimiter', async () => {
            const rows = [
                { a: 'a\r\n1', b: 'b1' },
                { a: 'a\r\n2', b: 'b2' },
            ];
            await expect(writeRowsToPath(rows, { headers: true, rowDelimiter: '\r\n' })).resolves.toEqual(Buffer.from('a,b\r\n"a\r\n1",b1\r\n"a\r\n2",b2'));
        });
    });
    it('should add a final rowDelimiter if includeEndRowDelimiter is true', () => expect(writeRowsToPath(__fixtures__1.objectRows, { headers: true, includeEndRowDelimiter: true })).resolves.toEqual(Buffer.from('a,b\na1,b1\na2,b2\n')));
});
describe('.write', () => {
    const writeToRecordingStream = (rows, options = {}) => new Promise((res, rej) => {
        const rs = new __fixtures__1.RecordingStream();
        src_1.write(rows, options)
            .on('error', rej)
            .pipe(rs)
            .on('finish', () => {
            res(rs.data);
        });
    });
    it('should write an array of arrays', () => expect(writeToRecordingStream(__fixtures__1.arrayRows, { headers: true })).resolves.toEqual(['a,b', '\na1,b1', '\na2,b2']));
    it('should support transforming an array of arrays', () => expect(writeToRecordingStream(__fixtures__1.arrayRows, {
        headers: true,
        transform(row) {
            return row.map(entry => entry.toUpperCase());
        },
    })).resolves.toEqual(['A,B', '\nA1,B1', '\nA2,B2']));
    it('should write an array of multi-dimensional arrays', () => expect(writeToRecordingStream(__fixtures__1.multiDimensionalRows, { headers: true })).resolves.toEqual([
        'a,b',
        '\na1,b1',
        '\na2,b2',
    ]));
    it('should support transforming an array of multi-dimensional arrays', () => expect(writeToRecordingStream(__fixtures__1.multiDimensionalRows, {
        headers: true,
        transform(row) {
            return row.map(col => [col[0], col[1].toUpperCase()]);
        },
    })).resolves.toEqual(['a,b', '\nA1,B1', '\nA2,B2']));
    it('should write an array of objects', () => expect(writeToRecordingStream(__fixtures__1.objectRows, { headers: true })).resolves.toEqual(['a,b', '\na1,b1', '\na2,b2']));
    it('should support transforming an array of objects', () => expect(writeToRecordingStream(__fixtures__1.objectRows, {
        headers: true,
        transform(row) {
            return {
                A: row.a,
                B: row.b,
            };
        },
    })).resolves.toEqual(['A,B', '\na1,b1', '\na2,b2']));
    describe('rowDelimiter option', () => {
        it('should support specifying an alternate row delimiter', () => expect(writeToRecordingStream(__fixtures__1.objectRows, { headers: true, rowDelimiter: '\r\n' })).resolves.toEqual([
            'a,b',
            '\r\na1,b1',
            '\r\na2,b2',
        ]));
        it('should escape values that contain the alternate row delimiter', async () => {
            const rows = [
                { a: 'a\n1', b: 'b1' },
                { a: 'a\n2', b: 'b2' },
            ];
            await expect(writeToRecordingStream(rows, { headers: true, rowDelimiter: '\n' })).resolves.toEqual([
                'a,b',
                '\n"a\n1",b1',
                '\n"a\n2",b2',
            ]);
        });
    });
    it('should add a final rowDelimiter if includeEndRowDelimiter is true', () => expect(writeToRecordingStream(__fixtures__1.objectRows, { headers: true, includeEndRowDelimiter: true })).resolves.toEqual([
        'a,b',
        '\na1,b1',
        '\na2,b2',
        '\n',
    ]));
});
describe('.writeToStream', () => {
    const writeRowsToStream = (rows, options = {}) => new Promise((res, rej) => {
        const rs = new __fixtures__1.RecordingStream();
        src_1.writeToStream(rs, rows, options);
        rs.on('error', rej).on('finish', () => {
            res(rs.data);
        });
    });
    it('should write an array of arrays', () => expect(writeRowsToStream(__fixtures__1.arrayRows, { headers: true })).resolves.toEqual(['a,b', '\na1,b1', '\na2,b2']));
    it('should write an array of objects', () => expect(writeRowsToStream(__fixtures__1.objectRows, { headers: true })).resolves.toEqual(['a,b', '\na1,b1', '\na2,b2']));
    it('should write an array of multi-dimensional arrays', () => expect(writeRowsToStream(__fixtures__1.multiDimensionalRows, { headers: true })).resolves.toEqual([
        'a,b',
        '\na1,b1',
        '\na2,b2',
    ]));
    it('should support transforming an array of arrays', () => expect(writeRowsToStream(__fixtures__1.arrayRows, {
        headers: true,
        transform(row) {
            return row.map(entry => entry.toUpperCase());
        },
    })).resolves.toEqual(['A,B', '\nA1,B1', '\nA2,B2']));
    it('should transforming an array of objects', () => expect(writeRowsToStream(__fixtures__1.objectRows, {
        headers: true,
        transform(row) {
            return {
                A: row.a,
                B: row.b,
            };
        },
    })).resolves.toEqual(['A,B', '\na1,b1', '\na2,b2']));
    it('should transforming an array of multi-dimensional array', () => expect(writeRowsToStream(__fixtures__1.multiDimensionalRows, {
        headers: true,
        transform(row) {
            return row.map(col => [col[0], col[1].toUpperCase()]);
        },
    })).resolves.toEqual(['a,b', '\nA1,B1', '\nA2,B2']));
    describe('rowDelimiter option', () => {
        it('should support specifying an alternate row delimiter', () => expect(writeRowsToStream(__fixtures__1.objectRows, { headers: true, rowDelimiter: '\r\n' })).resolves.toEqual([
            'a,b',
            '\r\na1,b1',
            '\r\na2,b2',
        ]));
        it('should escape values that contain the alternate row delimiter', async () => {
            const rows = [
                { a: 'a\r\n1', b: 'b1' },
                { a: 'a\r\n2', b: 'b2' },
            ];
            await expect(writeRowsToStream(rows, { headers: true, rowDelimiter: '\r\n' })).resolves.toEqual([
                'a,b',
                '\r\n"a\r\n1",b1',
                '\r\n"a\r\n2",b2',
            ]);
        });
    });
    it('should add a final rowDelimiter if includeEndRowDelimiter is true', () => expect(writeRowsToStream(__fixtures__1.objectRows, { headers: true, includeEndRowDelimiter: true })).resolves.toEqual([
        'a,b',
        '\na1,b1',
        '\na2,b2',
        '\n',
    ]));
});
//# sourceMappingURL=format.spec.js.map