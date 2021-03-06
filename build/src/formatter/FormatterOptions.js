"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FormatterOptions {
    constructor(opts = {}) {
        var _a, _b, _c, _d;
        this.objectMode = true;
        this.delimiter = ',';
        this.rowDelimiter = '\n';
        this.quote = '"';
        this.escape = this.quote;
        this.quoteColumns = false;
        this.quoteHeaders = this.quoteColumns;
        this.headers = null;
        this.includeEndRowDelimiter = false;
        this.transform = null;
        this.writeBOM = false;
        this.BOM = '\ufeff';
        this.alwaysWriteHeaders = false;
        this.highWaterMark = 16;
        Object.assign(this, opts || {});
        if (typeof ((_a = opts) === null || _a === void 0 ? void 0 : _a.quoteHeaders) === 'undefined') {
            this.quoteHeaders = this.quoteColumns;
        }
        if (((_b = opts) === null || _b === void 0 ? void 0 : _b.quote) === true) {
            this.quote = '"';
        }
        else if (((_c = opts) === null || _c === void 0 ? void 0 : _c.quote) === false) {
            this.quote = '';
        }
        if (typeof ((_d = opts) === null || _d === void 0 ? void 0 : _d.escape) !== 'string') {
            this.escape = this.quote;
        }
        this.shouldWriteHeaders = !!this.headers;
        this.headers = Array.isArray(this.headers) ? this.headers : null;
        this.escapedQuote = `${this.escape}${this.quote}`;
    }
}
exports.FormatterOptions = FormatterOptions;
//# sourceMappingURL=FormatterOptions.js.map