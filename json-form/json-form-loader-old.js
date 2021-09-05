const path = require("path");
const t = require("@babel/types");
const { default: generate } = require("@babel/generator");

const fieldCompRegistry = require("./fields.json");

function importDefault(local, source) {
  return t.importDeclaration(
    [t.importDefaultSpecifier(t.identifier(local))],
    t.stringLiteral(source)
  );
}

function setReactDisplayName(local, displayName) {
  return t.expressionStatement(
    t.assignmentExpression(
      "=",
      t.memberExpression(t.identifier(local), t.identifier("displayName")),
      t.stringLiteral(displayName)
    )
  );
}

function importFieldComp(fieldCompMeta) {
  const { name, modulePath } = fieldCompMeta;
  const importDeclaration = importDefault(
    name,
    "./" + path.relative(this.importContext, require.resolve(modulePath))
  );
  const setup = setReactDisplayName(name, name);
  this.imports.push(importDeclaration);
  this.body.push(setup);
}

function commentSourceJSON(itemConfig, fieldCompMeta) {
  const node = t.nullLiteral();
  node.trailingComments = [
    {
      type: "CommentBlock",
      value:
        (
          "\nRendered from JSON config:\n" +
          JSON.stringify(itemConfig, null, 2) +
          `\nby this component registered in \`field.json\`:\n` +
          JSON.stringify(fieldCompMeta, null, 2)
        ).replace(/\n/g, "\n*** ") + "\n",
    },
  ];
  return t.jsxExpressionContainer(node);
}

function renderReactField(itemConfig) {
  const { type, label } = itemConfig;
  const fieldCompMeta = fieldCompRegistry[type];

  importFieldComp.call(this, fieldCompMeta);

  const jsonSource = commentSourceJSON(itemConfig, fieldCompMeta);

  const reactElement = t.jsxElement(
    t.jsxOpeningElement(t.jsxIdentifier("div"), []),
    t.jsxClosingElement(t.jsxIdentifier("div")),
    (label
      ? [
          t.jsxElement(
            t.jsxOpeningElement(t.jsxIdentifier("label"), []),
            t.jsxClosingElement(t.jsxIdentifier("label")),
            [t.jsxText(label)],
            false
          ),
        ]
      : []
    ).concat(
      t.jsxElement(
        t.jsxOpeningElement(
          t.jsxIdentifier(fieldCompMeta.name),
          Object.entries(itemConfig).map(([key, value]) => {
            return t.jsxAttribute(t.jsxIdentifier(key), t.stringLiteral(value));
          }),
          true
        ),
        null,
        [],
        true
      )
    ),
    true
  );

  return [jsonSource, reactElement];
}

function renderReactForm(formConfig) {
  const renderField = renderReactField.bind(this);
  const reactCompDeclaration = t.variableDeclaration("const", [
    t.variableDeclarator(
      t.identifier("Form"),
      t.arrowFunctionExpression(
        [],
        t.jsxElement(
          t.jsxOpeningElement(t.jsxIdentifier("form"), []),
          t.jsxClosingElement(t.jsxIdentifier("form")),
          formConfig.fields.flatMap(renderField),
          false
        )
      )
    ),
  ]);
  const exportDeclaration = t.exportDefaultDeclaration(t.identifier("Form"));
  this.body.push(reactCompDeclaration, exportDeclaration);
}

module.exports = function (src) {
  const formConfig = JSON.parse(src);
  const program = {
    importContext: this.context, // directory of the current module
    imports: [importDefault("React", "react")],
    body: [],
  };

  renderReactForm.call(program, formConfig);

  const ast = t.program([...program.imports, ...program.body]);
  const output = generate(ast);
  return output.code;
};
