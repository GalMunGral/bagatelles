import { initPlayer } from "colosseum-player/dist/client";

window.onload = () => {
  initPlayer(document.querySelector("video"), {
    manifest: "assets/test.mpd",
    bufferSize: 90,
  });
};
