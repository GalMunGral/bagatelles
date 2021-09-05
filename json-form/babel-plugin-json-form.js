const path = require("path");
const t = require("@babel/types");
const fieldCompRegistry = require("./fields.json");
const { addDefault } = require("@babel/helper-module-imports");

module.exports = (args) => {
  console.log(args.loadOptionsSync());
  return {
    visitor: {
      Program(_path) {},
      ExportDefaultDeclaration(_path) {
        const formConfig = _path.get("declaration");
        const index = formConfig.node.properties.findIndex(
          (prop) => prop?.key?.name === "fields"
        );
        const fields = formConfig.get(`properties.${index}.value`);
        fields.node.properties.forEach((_, i) => {
          const fieldConfig = fields.get(`properties.${i}.value`);
          const index = fieldConfig.node.properties.findIndex(
            (prop) => prop?.key?.name === "type"
          );
          const fieldType = fieldConfig.get(`properties.${index}.value`);
          const fieldCompMeta = fieldCompRegistry[fieldType?.node?.value];
          if (!fieldCompMeta) return;
          const { name, modulePath } = fieldCompMeta;
          const context = path.dirname(this.filename);
          const absolutePath = require.resolve(modulePath);
          const relativePath = "./" + path.relative(context, absolutePath);
          const component = addDefault(_path, relativePath, {
            nameHint: name,
          });
          _path.insertBefore(
            t.expressionStatement(
              t.assignmentExpression(
                "=",
                t.memberExpression(component, t.identifier("displayName")),
                t.stringLiteral(name)
              )
            )
          );
          fieldType.replaceWith(component);
        });

        const form = addDefault(_path, "./runtime", { nameHint: "Form" });
        formConfig.replaceWith(t.callExpression(form, [formConfig.node]));
      },
    },
  };
};
