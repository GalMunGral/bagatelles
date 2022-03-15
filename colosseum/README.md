# Colosseum

A simple video stream player that secures your content.

## Usage

Suppose you have an MP4 file `my-video.mp4`. First you need to generate encrypted video segments:

```bash
npx colosseum my-video.mp4 YOUR-PASSWORD-HERE
```

On the server side (Express):

```js
import express from "express";
import cookieParser from "cookie-parser";
import { colosseum } from "colosseum/dist/server/index.js";

const app = express();

app.use(cookieParser());
app.use(colosseum("YOUR-PASSWORD-HERE"));
app.use(express.static(join(cwd(), "public")));
```

On the client side:

```js
import { initPlayer } from "colosseum/dist/client";

window.onload = () => {
  initPlayer(document.querySelector("#video"), {
    manifest: "path/to/my-video.mpd",
    bufferSize: 5, // seconds;
  });
};
```
