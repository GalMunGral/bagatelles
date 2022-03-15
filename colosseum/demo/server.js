import { join } from "path";
import { cwd } from "process";
import express from "express";
import cookieParser from "cookie-parser";
import { colosseum } from "colosseum-player/dist/server/index.js";

const app = express();

app.use(cookieParser());
app.use(colosseum("blade-runner-2049"));

app.use(express.static(join(cwd(), "public")));
app.get("/", (_, res) => res.redirect("/index.html"));
app.listen(5000, () => console.log("running"));
