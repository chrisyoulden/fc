"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const string_decoder_1 = require("string_decoder");
const stream_1 = require("stream");
const transforms_1 = require("./transforms");
const parser_1 = require("./parser");
class CsvParserStream extends stream_1.Transform {
    constructor(parserOptions) {
        super({ objectMode: parserOptions.objectMode });
        this.lines = '';
        this.rowCount = 0;
        this.parsedRowCount = 0;
        this.parsedLineCount = 0;
        this.endEmitted = false;
        this.parserOptions = parserOptions;
        this.parser = new parser_1.Parser(parserOptions);
        this.headerTransformer = new transforms_1.HeaderTransformer(parserOptions);
        this.decoder = new string_decoder_1.StringDecoder(parserOptions.encoding);
        this.rowTransformerValidator = new transforms_1.RowTransformerValidator();
    }
    get hasHitRowLimit() {
        return this.parserOptions.limitRows && this.rowCount >= this.parserOptions.maxRows;
    }
    get shouldEmitRows() {
        return this.parsedRowCount > this.parserOptions.skipRows;
    }
    get shouldSkipLine() {
        return this.parsedLineCount <= this.parserOptions.skipLines;
    }
    transform(transformFunction) {
        this.rowTransformerValidator.rowTransform = transformFunction;
        return this;
    }
    validate(validateFunction) {
        this.rowTransformerValidator.rowValidator = validateFunction;
        return this;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    emit(event, ...rest) {
        if (event === 'end') {
            if (!this.endEmitted) {
                this.endEmitted = true;
                super.emit('end', this.rowCount);
            }
            return false;
        }
        return super.emit(event, ...rest);
    }
    _transform(data, encoding, done) {
        // if we have hit our maxRows parsing limit then skip parsing
        if (this.hasHitRowLimit) {
            return done();
        }
        try {
            const { lines } = this;
            const newLine = lines + this.decoder.write(data);
            const rows = this.parse(newLine, true);
            return this.processRows(rows, done);
        }
        catch (e) {
            return this.destroy(e);
        }
    }
    _flush(done) {
        // if we have hit our maxRows parsing limit then skip parsing
        if (this.hasHitRowLimit) {
            return done();
        }
        try {
            const newLine = this.lines + this.decoder.end();
            const rows = this.parse(newLine, false);
            return this.processRows(rows, done);
        }
        catch (e) {
            return done(e);
        }
    }
    parse(data, hasMoreData) {
        if (!data) {
            return [];
        }
        const { line, rows } = this.parser.parse(data, hasMoreData);
        this.lines = line;
        return rows;
    }
    processRows(rows, cb) {
        const rowsLength = rows.length;
        const iterate = (i) => {
            const callNext = (err) => {
                if (err) {
                    return this.destroy(err);
                }
                if (i % 100 === 0) {
                    // incase the transform are sync insert a next tick to prevent stack overflow
                    setImmediate(() => iterate(i + 1));
                    return undefined;
                }
                return iterate(i + 1);
            };
            // if we have emitted all rows or we have hit the maxRows limit option
            // then end
            if (i >= rowsLength || this.hasHitRowLimit) {
                return cb();
            }
            this.parsedLineCount += 1;
            if (this.shouldSkipLine) {
                return callNext();
            }
            const row = rows[i];
            this.rowCount += 1;
            this.parsedRowCount += 1;
            const nextRowCount = this.rowCount;
            return this.transformRow(row, (err, transformResult) => {
                if (err) {
                    this.rowCount -= 1;
                    return callNext(err);
                }
                if (!transformResult) {
                    return callNext(new Error('expected transform result'));
                }
                if (!transformResult.isValid) {
                    this.emit('data-invalid', transformResult.row, nextRowCount, transformResult.reason);
                }
                else if (transformResult.row) {
                    return this.pushRow(transformResult.row, callNext);
                }
                return callNext();
            });
        };
        iterate(0);
    }
    transformRow(parsedRow, cb) {
        try {
            this.headerTransformer.transform(parsedRow, (err, withHeaders) => {
                if (err) {
                    return cb(err);
                }
                if (!withHeaders) {
                    return cb(new Error('Expected result from header transform'));
                }
                if (!withHeaders.isValid) {
                    return cb(null, { isValid: false, row: parsedRow });
                }
                if (withHeaders.row) {
                    if (this.shouldEmitRows) {
                        return this.rowTransformerValidator.transformAndValidate(withHeaders.row, cb);
                    }
                    // skipped because of skipRows option remove from total row count
                    this.rowCount -= 1;
                    return cb(null, { row: null, isValid: true });
                }
                // this is a header row dont include in the rowCount or parsedRowCount
                this.rowCount -= 1;
                this.parsedRowCount -= 1;
                return cb(null, { row: null, isValid: true });
            });
        }
        catch (e) {
            cb(e);
        }
    }
    pushRow(row, cb) {
        try {
            if (!this.parserOptions.objectMode) {
                this.push(JSON.stringify(row));
            }
            else {
                this.push(row);
            }
            cb();
        }
        catch (e) {
            cb(e);
        }
    }
}
exports.default = CsvParserStream;
//# sourceMappingURL=CsvParserStream.js.map