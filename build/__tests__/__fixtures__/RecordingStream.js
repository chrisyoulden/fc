"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("stream");
class RecordingStream extends stream_1.Writable {
    constructor() {
        super({
            write: (data, enc, cb) => {
                this.data.push(data.toString());
                cb();
            },
        });
        this.data = [];
    }
}
exports.RecordingStream = RecordingStream;
//# sourceMappingURL=RecordingStream.js.map