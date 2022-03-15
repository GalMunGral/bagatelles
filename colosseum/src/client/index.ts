import { ChunkLoader } from "./loader.js";
import { getStreamInfo } from "./manifest.js";

type Options = {
  manifest: string;
  bufferSize: number;
};

export function initPlayer(video: HTMLVideoElement, options: Options) {
  const source = new MediaSource();

  source.onsourceopen = async () => {
    const streamInfo = await getStreamInfo(options.manifest);
    const mimeCodecs = `${streamInfo.mimeType}; codecs="${streamInfo.codecs}"`;
    const sourceBuffer = source.addSourceBuffer(mimeCodecs);
    const loader = new ChunkLoader(streamInfo, sourceBuffer);

    video.onplay = video.ontimeupdate = async () => {
      const t = video.currentTime;
      const st = streamInfo.segDuration;
      const start = Math.floor(t / st);
      const end = Math.floor((t + options.bufferSize) / st) + 1;
      for (let i = start; i <= end; i++) await loader.load(i);
    };

    return loader.load(0);
  };

  video.src = URL.createObjectURL(source);
}
