import { memo } from "../common/memo.js";
import { decryptChunk } from "./decrypt.js";
import { StreamInfo } from "./types.js";

export class ChunkLoader {
  constructor(
    private streamInfo: StreamInfo,
    private sourceBuffer: SourceBuffer
  ) {}

  public async load(index: number) {
    if (this.outOfBounds(index)) return;
    return this.appendBuffer(await this.getChunk(index));
  }

  private getChunk = memo((index: number) => {
    return this.fetchChunk(this.toChunkUrl(index));
  });

  private outOfBounds(index: number) {
    const played = (index - 1) * this.streamInfo.segDuration;
    return index < 0 || played >= this.streamInfo.duration;
  }

  private async fetchChunk(url: string): Promise<BufferSource> {
    const base64 = await (await fetch(url)).text();
    return decryptChunk(base64.replace(/\n/g, ""));
  }

  private toChunkUrl(index: number) {
    const filename =
      index === 0
        ? this.streamInfo.initSegName
        : this.streamInfo.segNameTmpl.replace(/\$Number\$/g, String(index));
    return "/assets/" + filename;
  }

  private async appendBuffer(buffer: BufferSource) {
    return new Promise(async (resolve, reject) => {
      let timeout = 200;

      while (this.sourceBuffer.updating) {
        await backoff(timeout);
        timeout *= 2;
      }

      this.sourceBuffer.addEventListener("update", onUpdate);
      this.sourceBuffer.addEventListener("abort", onAbort);
      this.sourceBuffer.appendBuffer(buffer);

      function backoff(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }

      function onUpdate(this: SourceBuffer) {
        if (this.updating) return;
        this.removeEventListener("update", onUpdate);
        resolve("loaded");
      }

      function onAbort(this: SourceBuffer) {
        if (this.updating) return;
        this.removeEventListener("abort", onAbort);
        reject("aborted");
      }
    });
  }
}
