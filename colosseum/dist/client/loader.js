import { memo } from "../common/memo.js";
import { decryptChunk } from "./decrypt.js";
export class ChunkLoader {
    constructor(streamInfo, sourceBuffer) {
        this.streamInfo = streamInfo;
        this.sourceBuffer = sourceBuffer;
        this.getChunk = memo((index) => {
            return this.fetchChunk(this.toChunkUrl(index));
        });
    }
    async load(index) {
        if (this.outOfBounds(index))
            return;
        return this.appendBuffer(await this.getChunk(index));
    }
    outOfBounds(index) {
        const played = (index - 1) * this.streamInfo.segDuration;
        return index < 0 || played >= this.streamInfo.duration;
    }
    async fetchChunk(url) {
        const base64 = await (await fetch(url)).text();
        return decryptChunk(base64.replace(/\n/g, ""));
    }
    toChunkUrl(index) {
        const filename = index === 0
            ? this.streamInfo.initSegName
            : this.streamInfo.segNameTmpl.replace(/\$Number\$/g, String(index));
        return "/assets/" + filename;
    }
    async appendBuffer(buffer) {
        return new Promise(async (resolve, reject) => {
            let timeout = 200;
            while (this.sourceBuffer.updating) {
                await backoff(timeout);
                timeout *= 2;
            }
            this.sourceBuffer.addEventListener("update", onUpdate);
            this.sourceBuffer.addEventListener("abort", onAbort);
            this.sourceBuffer.appendBuffer(buffer);
            function backoff(ms) {
                return new Promise((resolve) => setTimeout(resolve, ms));
            }
            function onUpdate() {
                if (this.updating)
                    return;
                this.removeEventListener("update", onUpdate);
                resolve("loaded");
            }
            function onAbort() {
                if (this.updating)
                    return;
                this.removeEventListener("abort", onAbort);
                reject("aborted");
            }
        });
    }
}
