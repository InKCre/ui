import { readFileSync } from "node:fs";
import ts from "typescript";
import type { PropertyMeta } from "vue-component-meta";

// Vue resolves imported prop types, but does not evaluate this repository's prop factories.
// Read their call arguments without executing component modules or default factories.
export function propDefault(prop: PropertyMeta): string {
  if (prop.default !== undefined) return prop.default;
  for (const declaration of prop.getDeclarations()) {
    if (!declaration.file.endsWith(".ts")) continue;
    const source = ts.createSourceFile(
      declaration.file,
      readFileSync(declaration.file, "utf8"),
      ts.ScriptTarget.Latest,
      true,
    );
    let initializer: ts.Expression | undefined;
    function visit(node: ts.Node): void {
      if (ts.isPropertyAssignment(node) && node.getStart(source) === declaration.range[0]) {
        initializer = node.initializer;
      } else if (node.pos <= declaration.range[0] && node.end >= declaration.range[1]) {
        ts.forEachChild(node, visit);
      }
    }
    visit(source);
    if (!initializer) throw new Error(`Cannot locate prop declaration: ${prop.name}`);
    if (ts.isCallExpression(initializer)) {
      const helper = initializer.expression.getText(source);
      const supported = [
        "makeStringProp",
        "makeBooleanProp",
        "makeNumberProp",
        "makeNumericProp",
        "makeArrayProp",
        "makeObjectProp",
      ];
      const imported = source.statements.some(
        (statement) =>
          ts.isImportDeclaration(statement) &&
          ts.isStringLiteral(statement.moduleSpecifier) &&
          statement.moduleSpecifier.text.endsWith("/utils/vue-props") &&
          statement.importClause?.namedBindings &&
          ts.isNamedImports(statement.importClause.namedBindings) &&
          statement.importClause.namedBindings.elements.some(
            (item) => item.name.text === helper && !item.propertyName,
          ),
      );
      if (!supported.includes(helper) || !imported) {
        throw new Error(`Document the unsupported prop factory before publishing: ${helper}`);
      }
      const value =
        initializer.arguments[0]?.getText(source) ??
        (helper === "makeArrayProp" ? "[]" : "undefined");
      return helper === "makeArrayProp" || helper === "makeObjectProp" ? `() => (${value})` : value;
    }
    if (ts.isObjectLiteralExpression(initializer)) {
      // Explicit defaults are handled by Vue metadata. A Boolean runtime type casts absence to false.
      const type = initializer.properties.find(
        (item) => ts.isPropertyAssignment(item) && item.name.getText(source) === "type",
      );
      if (type && ts.isPropertyAssignment(type) && type.initializer.getText(source) === "Boolean") {
        return "false";
      }
      return "undefined";
    }
    throw new Error(`Unsupported prop declaration: ${prop.name}`);
  }
  throw new Error(`Cannot determine default for ${prop.name}; add source metadata support.`);
}

export function propType(prop: PropertyMeta): string {
  const schema = prop.schema;
  if (
    typeof schema !== "string" &&
    schema.kind === "enum" &&
    schema.schema?.every((entry) => typeof entry === "string")
  ) {
    return schema.schema.join(" | ").replace("false | true", "boolean");
  }
  return prop.type;
}

export function typeDeclarations(source: string, fileName: string): Map<string, string> {
  const file = ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest, true);
  return new Map(
    file.statements.flatMap((node) =>
      ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)
        ? [[node.name.text, node.getText(file)]]
        : [],
    ),
  );
}
