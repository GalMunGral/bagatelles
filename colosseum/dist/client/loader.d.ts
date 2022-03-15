import { StreamInfo } from "./types.js";
export declare class ChunkLoader {
    private streamInfo;
    private sourceBuffer;
    constructor(streamInfo: StreamInfo, sourceBuffer: SourceBuffer);
    load(index: number): Promise<unknown>;
    private getChunk;
    private outOfBounds;
    private fetchChunk;
    private toChunkUrl;
    private appendBuffer;
}
