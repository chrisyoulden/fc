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
describe('Issue #158 - https://github.com/C2FO/fast-csv/issues/158', () => {
    class Place {
        constructor(id, name) {
            this.id = id;
            this.name = name;
            this.calculatedValue = 0;
        }
        calculateSomething() {
            this.calculatedValue = this.id * 2;
            return this;
        }
    }
    it('should not write prototype methods in csv', next => {
        const rs = new __fixtures__1.RecordingStream();
        csv.write([
            new Place(1, 'a').calculateSomething(),
            new Place(2, 'b').calculateSomething(),
            new Place(3, 'c').calculateSomething(),
        ], { headers: true })
            .pipe(rs)
            .on('error', next)
            .on('finish', () => {
            expect(rs.data.join('')).toBe('id,name,calculatedValue\n1,a,2\n2,b,4\n3,c,6');
            next();
        });
    });
});
//# sourceMappingURL=issue158.spec.js.map