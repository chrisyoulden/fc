/// <reference types="node" />
import { Writable } from 'stream';
export declare class RecordingStream extends Writable {
    readonly data: string[];
    constructor();
}
