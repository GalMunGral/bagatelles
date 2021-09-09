const React = require("react");
const ReactPDF = require("@react-pdf/renderer");
const { createServer } = require("http");
const { createReadStream } = require("fs");
const { exec } = require("child_process");
const path = require("path");

const Demo = require("./demo");

const Templates = {
  demo: Demo,
};

const TMP_PDF = path.resolve(__dirname, "../output/tmp.pdf");
const TMP_PNG_BASE = path.resolve(__dirname, "../output/tmp");
const TMP_PNG = TMP_PNG_BASE + "-1.png";

createServer((req, res) => {
  res.writeHead(200, {
    "Content-Type": "image/png",
    "Cache-Control": "no-store",
  });

  const params = new URL("https://_" + req.url).searchParams;
  const Template = Templates[params.get("template")];

  if (!Template) {
    res.writeHead(404).end("NO TEMPLATE FOUND");
    return;
  }

  let data;
  try {
    data = JSON.parse(params.get("data"));
  } catch {
    data = null;
  }

  if (!data) {
    res.writeHead(404).end("CANNOT PARSE DATA");
    return;
  }

  ReactPDF.render(<Template data={data} />, TMP_PDF, () => {
    exec(`pdftocairo -png ${TMP_PDF} ${TMP_PNG_BASE}`, () => {
      createReadStream(TMP_PNG).pipe(res);
    });
  });
}).listen(3000, () => {
  console.log("running");
});
