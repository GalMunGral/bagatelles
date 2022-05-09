const path = require('path')
var glob = require('glob');
const ts = require('typescript');
const package = process.env.PACKAGE;
const baseConfig = require('./tsconfig.json');
const base = path.join(__dirname, 'packages', package);
const config = require(path.join(base, 'tsconfig.json'));
const compilerOptions = {
  ...baseConfig.compilerOptions,
  ...config.compilerOptions
}
const fs = require('fs');

glob(path.join(base, 'src/**/*'), {
  ignore: [path.join(base, '**/__tests__/**')]
}, (err, files) => {
  const outDir = path.join(base, 'dist');
  if (!fs.existsSync(path.join(outDir, 'Chart'))) {
    fs.mkdirSync(path.join(outDir, 'Chart'), {
      recursive: true
    })
  }

  files.forEach(f => {
    if (!/\.tsx?$/.test(f)) return
    const src = fs.readFileSync(f, { encoding: 'utf-8' });
    const out = transform(src, f);
    const outPath = f.replace('src', 'dist').replace('.ts', '.js')
    if (!fs.existsSync(path.dirname(outPath))) {
      fs.mkdirSync(path.dirname(outPath), {
        recursive: true 
      })
    }
    fs.writeFileSync(outPath, out);
  })
})

function transform(code, id) {
  if (!/\.tsx?$/.test(id)) return code;
  const ast = ts.createSourceFile(
    /* filename */ 'dummy.ts',
    /* sourceText */ code,
    ts.ScriptTarget.Latest
  );

  const transformerFactory = (context) => {
    return function visitor(node) {
      try {

      
      node = ts.visitEachChild(node, visitor, context)
      if (ts.isExpressionStatement(node)) {
        
        if (node.getSourceFile()) {
          const log = ts.createExpressionStatement(
          ts.createCall(
            ts.createPropertyAccess(
              ts.createIdentifier('console'),
              ts.createIdentifier('debug')
            ),
            undefined, [
              ts.createStringLiteral(
                node.getSourceFile().text.slice(node.getStart(), node.getEnd()) + '\n' + id + '\n'
              )
            ])
          );
          // console.log('log')
          return [log, node];
        }
        // return log;
        // return node;
      }
      return node;
    } catch (e) {
      console.log(e)
    }
    }
  };

  const res = ts.transpileModule(code, {
    transformers: {
      before: [transformerFactory]
    },
    compilerOptions,
  })
  // const res= ts.transform(ast, [transformerFactory]);
  // console.log(res);
  // console.log(res.outputText)
  // console.log(res)
  return res.outputText
}

