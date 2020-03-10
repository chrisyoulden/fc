"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../../src");
const formatter_1 = require("../../src/formatter");
describe('RowFormatter', () => {
    const createFormatter = (formatterOptions = {}) => new formatter_1.RowFormatter(new src_1.FormatterOptions(formatterOptions));
    const formatRow = (row, formatter) => new Promise((res, rej) => {
        formatter.format(row, (err, formatted) => {
            if (err) {
                return rej(err);
            }
            return res(formatted);
        });
    });
    const finish = (formatter) => new Promise((res, rej) => {
        formatter.finish((err, formatted) => {
            if (err) {
                return rej(err);
            }
            return res(formatted);
        });
    });
    describe('#format', () => {
        describe('with array', () => {
            const headerRow = ['a', 'b'];
            const columnsRow = ['a1', 'b1'];
            const syncTransform = (row) => row.map(col => col.toUpperCase());
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const syncError = () => {
                throw new Error('Expected Error');
            };
            const asyncTransform = (row, cb) => {
                setImmediate(() => cb(null, row.map(col => col.toUpperCase())));
            };
            const asyncErrorTransform = (row, cb) => {
                setImmediate(() => cb(new Error('Expected Error')));
            };
            it('should format an array', async () => {
                const formatter = createFormatter({ headers: true });
                await expect(formatRow(headerRow, formatter)).resolves.toEqual(['a,b']);
            });
            it('should should append a new line if a second row is written', async () => {
                const formatter = createFormatter({ headers: true });
                await expect(formatRow(headerRow, formatter)).resolves.toEqual(['a,b']);
                await expect(formatRow(columnsRow, formatter)).resolves.toEqual(['\na1,b1']);
            });
            it('should support a sync transform', async () => {
                const formatter = createFormatter({ headers: true, transform: syncTransform });
                await expect(formatRow(headerRow, formatter)).resolves.toEqual(['A,B']);
            });
            it('should catch a sync transform thrown error', async () => {
                const formatter = createFormatter({ headers: true, transform: syncError });
                await expect(formatRow(headerRow, formatter)).rejects.toThrowError('Expected Error');
            });
            it('should support an async transform', async () => {
                const formatter = createFormatter({ headers: true, transform: asyncTransform });
                await expect(formatRow(headerRow, formatter)).resolves.toEqual(['A,B']);
            });
            it('should support an async transform with error', async () => {
                const formatter = createFormatter({ headers: true, transform: asyncErrorTransform });
                await expect(formatRow(headerRow, formatter)).rejects.toThrowError('Expected Error');
            });
            describe('headers option', () => {
                describe('with headers=false', () => {
                    it('should still write the first row', async () => {
                        const formatter = createFormatter({ headers: false });
                        await expect(formatRow(headerRow, formatter)).resolves.toEqual([headerRow.join(',')]);
                    });
                });
                describe('with headers=true', () => {
                    it('should only write the first row', async () => {
                        const formatter = createFormatter({ headers: true });
                        await expect(formatRow(headerRow, formatter)).resolves.toEqual([headerRow.join(',')]);
                    });
                });
                describe('with headers provided', () => {
                    it('should only write the first row', async () => {
                        const formatter = createFormatter({ headers: headerRow });
                        await expect(formatRow(columnsRow, formatter)).resolves.toEqual([
                            headerRow.join(','),
                            `\n${columnsRow.join(',')}`,
                        ]);
                    });
                    it('should append an additional column for new fields', async () => {
                        const formatter = createFormatter({ headers: ['A', 'B', 'no_field'] });
                        await expect(formatRow(columnsRow, formatter)).resolves.toEqual(['A,B,no_field', '\na1,b1,']);
                    });
                    it('should exclude columns that do not have a header', async () => {
                        const formatter = createFormatter({ headers: ['A'] });
                        await expect(formatRow(columnsRow, formatter)).resolves.toEqual(['A', '\na1']);
                    });
                });
            });
            describe('rowDelimiter option', () => {
                it('should support specifying an alternate row delimiter', async () => {
                    const formatter = createFormatter({ headers: true, rowDelimiter: '\r\n' });
                    await expect(formatRow(headerRow, formatter)).resolves.toEqual(['a,b']);
                    await expect(formatRow(columnsRow, formatter)).resolves.toEqual(['\r\na1,b1']);
                });
            });
        });
        describe('with multi-dimensional arrays', () => {
            const row = [
                ['a', 'a1'],
                ['b', 'b1'],
            ];
            const syncTransform = (rowToTransform) => rowToTransform.map(([header, col]) => [header, col.toUpperCase()]);
            const syncError = () => {
                throw new Error('Expected Error');
            };
            const asyncTransform = (rowToTransform, cb) => {
                const transformed = rowToTransform.map(([header, col]) => [header, col.toUpperCase()]);
                setImmediate(() => cb(null, transformed));
            };
            const asyncErrorTransform = (rowToTransform, cb) => setImmediate(() => cb(new Error('Expected Error')));
            it('should format a multi-dimensional array with headers true', async () => {
                const formatter = createFormatter({ headers: true });
                await expect(formatRow(row, formatter)).resolves.toEqual(['a,b', '\na1,b1']);
            });
            it('should not include headers if headers is false', async () => {
                const formatter = createFormatter({ headers: false });
                await expect(formatRow(row, formatter)).resolves.toEqual(['a1,b1']);
            });
            it('should support a sync transform', async () => {
                const formatter = createFormatter({ headers: true, transform: syncTransform });
                await expect(formatRow(row, formatter)).resolves.toEqual(['a,b', '\nA1,B1']);
            });
            it('should catch a sync transform thrown error', async () => {
                const formatter = createFormatter({ headers: true, transform: syncError });
                await expect(formatRow(row, formatter)).rejects.toThrowError('Expected Error');
            });
            it('should support an async transform', async () => {
                const formatter = createFormatter({ headers: true, transform: asyncTransform });
                await expect(formatRow(row, formatter)).resolves.toEqual(['a,b', '\nA1,B1']);
            });
            it('should support an async transform with error', async () => {
                const formatter = createFormatter({ headers: true, transform: asyncErrorTransform });
                await expect(formatRow(row, formatter)).rejects.toThrowError('Expected Error');
            });
            describe('headers option', () => {
                describe('with headers=false', () => {
                    it('should still write the first row', async () => {
                        const formatter = createFormatter({ headers: false });
                        await expect(formatRow(row, formatter)).resolves.toEqual(['a1,b1']);
                    });
                });
                describe('with headers=true', () => {
                    it('should only write the first row', async () => {
                        const formatter = createFormatter({ headers: true });
                        await expect(formatRow(row, formatter)).resolves.toEqual(['a,b', '\na1,b1']);
                    });
                });
                describe('with headers provided', () => {
                    it('should write the headers and first row', async () => {
                        const formatter = createFormatter({ headers: ['A', 'B'] });
                        await expect(formatRow(row, formatter)).resolves.toEqual(['A,B', '\na1,b1']);
                    });
                    it('should append an additional column for new fields', async () => {
                        const formatter = createFormatter({ headers: ['A', 'B', 'no_field'] });
                        await expect(formatRow(row, formatter)).resolves.toEqual(['A,B,no_field', '\na1,b1,']);
                    });
                    it('should exclude columns that do not have a header', async () => {
                        const formatter = createFormatter({ headers: ['A'] });
                        await expect(formatRow(row, formatter)).resolves.toEqual(['A', '\na1']);
                    });
                });
            });
            describe('rowDelimiter option', () => {
                it('should support specifying an alternate row delimiter', async () => {
                    const formatter = createFormatter({ headers: true, rowDelimiter: '\r\n' });
                    await expect(formatRow(row, formatter)).resolves.toEqual(['a,b', '\r\na1,b1']);
                });
            });
        });
        describe('with objects', () => {
            const row = { a: 'a1', b: 'b1' };
            const syncTransform = (rowToTransform) => ({
                a: rowToTransform.a.toUpperCase(),
                b: rowToTransform.b.toUpperCase(),
            });
            const syncError = () => {
                throw new Error('Expected Error');
            };
            const asyncTransform = (rowToTransform, cb) => setImmediate(() => cb(null, syncTransform(rowToTransform)));
            const asyncErrorTransform = (rowToTransform, cb) => setImmediate(() => cb(new Error('Expected Error')));
            it('should return a headers row with when headers true', async () => {
                const formatter = createFormatter({ headers: true });
                await expect(formatRow(row, formatter)).resolves.toEqual(['a,b', '\na1,b1']);
            });
            it('should not include headers if headers is false', async () => {
                const formatter = createFormatter({ headers: false });
                await expect(formatRow(row, formatter)).resolves.toEqual(['a1,b1']);
            });
            it('should support a sync transform', async () => {
                const formatter = createFormatter({ headers: true, transform: syncTransform });
                await expect(formatRow(row, formatter)).resolves.toEqual(['a,b', '\nA1,B1']);
            });
            it('should catch a sync transform thrown error', async () => {
                const formatter = createFormatter({ headers: true, transform: syncError });
                await expect(formatRow(row, formatter)).rejects.toThrowError('Expected Error');
            });
            it('should support an async transform', async () => {
                const formatter = createFormatter({ headers: true, transform: asyncTransform });
                await expect(formatRow(row, formatter)).resolves.toEqual(['a,b', '\nA1,B1']);
            });
            it('should support an async transform with error', async () => {
                const formatter = createFormatter({ headers: true, transform: asyncErrorTransform });
                await expect(formatRow(row, formatter)).rejects.toThrowError('Expected Error');
            });
            describe('headers option', () => {
                describe('with headers=false', () => {
                    it('should still write the first row', async () => {
                        const formatter = createFormatter({ headers: false });
                        await expect(formatRow(row, formatter)).resolves.toEqual(['a1,b1']);
                    });
                });
                describe('with headers=true', () => {
                    it('should only write the first row', async () => {
                        const formatter = createFormatter({ headers: true });
                        await expect(formatRow(row, formatter)).resolves.toEqual(['a,b', '\na1,b1']);
                    });
                    it('should not write the first row if writeHeaders is false', async () => {
                        const formatter = createFormatter({ headers: true, writeHeaders: false });
                        await expect(formatRow(row, formatter)).resolves.toEqual(['a1,b1']);
                    });
                });
                describe('with headers provided', () => {
                    it('should write the provided headers and the row', async () => {
                        const formatter = createFormatter({ headers: ['a', 'b'] });
                        await expect(formatRow(row, formatter)).resolves.toEqual(['a,b', '\na1,b1']);
                    });
                    it('should not write the header row if writeHeaders is false', async () => {
                        const formatter = createFormatter({ headers: ['a', 'b'], writeHeaders: false });
                        await expect(formatRow(row, formatter)).resolves.toEqual(['a1,b1']);
                    });
                    it('should respect the order of the columns', async () => {
                        const formatter = createFormatter({ headers: ['b', 'a'] });
                        await expect(formatRow(row, formatter)).resolves.toEqual(['b,a', '\nb1,a1']);
                    });
                    it('should append an additional column for new fields', async () => {
                        const formatter = createFormatter({ headers: ['a', 'b', 'no_field'] });
                        await expect(formatRow(row, formatter)).resolves.toEqual(['a,b,no_field', '\na1,b1,']);
                    });
                    it('should respect the order of the columns and not write the headers if writeHeaders is false', async () => {
                        const formatter = createFormatter({ headers: ['b', 'a'], writeHeaders: false });
                        await expect(formatRow(row, formatter)).resolves.toEqual(['b1,a1']);
                    });
                });
            });
            describe('rowDelimiter option', () => {
                it('should support specifying an alternate row delimiter', async () => {
                    const formatter = createFormatter({ headers: true, rowDelimiter: '\r\n' });
                    await expect(formatRow(row, formatter)).resolves.toEqual(['a,b', '\r\na1,b1']);
                });
            });
        });
    });
    describe('#finish', () => {
        describe('alwaysWriteHeaders option', () => {
            it('should return a headers row if no rows have been written', async () => {
                const headers = ['h1', 'h2'];
                const formatter = createFormatter({ headers, alwaysWriteHeaders: true });
                await expect(finish(formatter)).resolves.toEqual([headers.join(',')]);
            });
            it('should not return a headers row if rows have been written', async () => {
                const headers = ['h1', 'h2'];
                const formatter = createFormatter({ headers, alwaysWriteHeaders: true });
                await expect(formatRow(['c1', 'c2'], formatter)).resolves.toEqual(['h1,h2', '\nc1,c2']);
                await expect(finish(formatter)).resolves.toEqual([]);
            });
            it('should reject if headers are not specified', async () => {
                const formatter = createFormatter({ alwaysWriteHeaders: true });
                await expect(finish(formatter)).rejects.toThrowError('`alwaysWriteHeaders` option is set to true but `headers` option not provided.');
            });
        });
        describe('includeEndRowDelimiter option', () => {
            it('should write the endRowDelimiter if ', async () => {
                const formatter = createFormatter({ includeEndRowDelimiter: true });
                await expect(finish(formatter)).resolves.toEqual(['\n']);
            });
        });
    });
    describe('#rowTransform', () => {
        it('should throw an error if the transform is set and is not a function', () => {
            const formatter = createFormatter();
            expect(() => {
                // @ts-ignore
                formatter.rowTransform = 'foo';
            }).toThrow('The transform should be a function');
        });
    });
});
//# sourceMappingURL=RowFormatter.spec.js.map