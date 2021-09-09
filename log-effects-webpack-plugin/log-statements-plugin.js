const ts = require('typescript');

function addLogs(code, id) {
  console.log(id);
  if (!/\.tsx?$/.test(id)) return;
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
    compilerOptions:{
      target: 'esnext',
      module: 'esnext',
      jsx: /\.tsx$/.test(id) ? ts.JsxEmit.Preserve : ts.JsxEmit.None
    }
  })
  // const res= ts.transform(ast, [transformerFactory]);
  // console.log(res);
  // console.log(res.outputText)
  console.log(res)
  return res.outputText
}

export default function LogStatementsPlugin() {
  return {
    name: 'log-statements',
    transform(code, id) {
      return addLogs(code, id);
    },
  };
}
