import fs from "fs";
import path from "path";
import { MonadicJSON, ApplicativeJSON } from "./JSON";
import { ApplicativeScript, MonadicScript } from "./SimpleScript";
import { MonadicSXML, ApplicativeSXML } from "./SXML";

const OUTDIR = path.join(__dirname, "../output");

const scriptMonadic = MonadicScript.parse(`
  if ((a + c + d) * 5 < 0) {
    result = (a + c + d) % 2 == 0 ? "a" : "b";
    doSomething(result, a / c);
  } else {
    doSomethingElse(a ? 1 : 0);
    if (true) {
      a = 100;
      doMoreThings(100);
    }
  }
  `);

fs.writeFileSync(
  path.join(OUTDIR, "/test-script-monadic.json"),
  JSON.stringify(scriptMonadic, null, 2)
);

const scriptApplicative = ApplicativeScript.parse(`
  if ((a + c + d) * 5 < 0) {
    result = (a + c + d) % 2 == 0 ? "a" : "b";
    doSomething(result, a / c);
  } else {
    doSomethingElse(a ? 1 : 0);
    if (true) {
      a = 100;
      doMoreThings(100);
    }
  }
  `);

fs.writeFileSync(
  path.join(OUTDIR, "/test-script-applicative.json"),
  JSON.stringify(scriptApplicative, null, 2)
);

const sxmlMonadic = MonadicSXML.parse(`
  <screen a b="1" cde="test">
    <window1 key="abc123"/>
    <window2>
      <button red/>
    </window2>
    <window3 hidden/>
  </screen123>
 `);

fs.writeFileSync(
  path.join(OUTDIR, "/test-sxml-monadic.json"),
  JSON.stringify(sxmlMonadic, null, 2)
);

const sxmlApplicative = ApplicativeSXML.parse(`
  <screen a b="1" cde="test">
    <window1 key="abc123"/>
    <window2>
      <button red/>
    </window2>
    <window3 hidden/>
  </screen123>
 `);

fs.writeFileSync(
  path.join(OUTDIR, "/test-sxml-applicative.json"),
  JSON.stringify(sxmlApplicative, null, 2)
);

const jsonMonadic = MonadicJSON.parse(
  JSON.stringify({
    a: null,
    d: [
      "hello",
      {
        da: [12.34, false, "world"],
        db: null,
      },
    ],
    e: {
      ea: ["hello", "world", null],
      eb: {
        eba: null,
        ebb: [123, "test"],
      },
    },
  })
);

fs.writeFileSync(
  path.join(OUTDIR, "/test-json-monadic.json"),
  JSON.stringify(jsonMonadic, null, 2)
);

const jsonApplicative = ApplicativeJSON.parse(
  JSON.stringify({
    a: null,
    d: [
      "hello",
      {
        da: [12.34, false, "world"],
        db: null,
      },
    ],
    e: {
      ea: ["hello", "world", null],
      eb: {
        eba: null,
        ebb: [123, "test"],
      },
    },
  })
);

fs.writeFileSync(
  path.join(OUTDIR, "/test-json-applicative.json"),
  JSON.stringify(jsonApplicative, null, 2)
);
