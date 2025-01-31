import * as ts from 'typescript'
import { FileNode } from '@/src/types'

interface ReactHook {
  name: string;
  dependencies: string[];
}

interface ParsedNode extends FileNode {
  hooks: ReactHook[];
  hocs: string[];
  props: {
    from: string;  // Component passing the prop
    to: string;    // Component receiving the prop
    propName: string;
  }[];
}

interface NodeWithExports {
  path: string;
  exports: {
    functions: string[];
    components: string[];
    variables: string[];
  };
  imports: {
    source: string;
    items: string[];
  }[];
  hooks: ReactHook[];
  hocs: string[];
  props: {
    from: string;
    to: string;
    propName: string;
  }[];
}

function getNodeName(node: ts.Node): string | undefined {
  if (ts.isIdentifier(node)) {
    return node.text;
  }
  if ('name' in node && ts.isIdentifier((node as any).name)) {
    return (node as any).name.text;
  }
  return undefined;
}

const parseProps = (node: ts.Node): Array<{ from: string; to: string; propName: string }> => {
  const props: Array<{ from: string; to: string; propName: string }> = [];

  // Look for JSX elements with props
  if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) {
    const tagName = ts.isJsxElement(node)
      ? node.openingElement.tagName.getText()
      : node.tagName.getText();

    // Only track props for component references (starting with uppercase)
    if (/^[A-Z]/.test(tagName)) {
      const attributes = ts.isJsxElement(node)
        ? node.openingElement.attributes.properties
        : node.attributes.properties;

      // Get the containing function/component name
      let parentComponent = '';
      let current: ts.Node | undefined = node;
      while (current) {
        if (ts.isFunctionDeclaration(current) || ts.isArrowFunction(current)) {
          parentComponent = getNodeName(current) || '';
          break;
        }
        current = current.parent;
      }

      if (parentComponent) {
        attributes.forEach(attr => {
          if (ts.isJsxAttribute(attr) && attr.name) {
            props.push({
              from: parentComponent,
              to: tagName,
              propName: attr.name.getText()
            });
          }
        });
      }
    }
  }

  // Recursively check children
  node.forEachChild(child => {
    props.push(...parseProps(child));
  });

  return props;
}

export const parseTypeScript = (fileContent: string, filePath: string): ParsedNode => {
  const sourceFile = ts.createSourceFile(
    filePath,
    fileContent,
    ts.ScriptTarget.Latest,
    true
  )

  const parsedNode: NodeWithExports = {
    path: filePath,
    exports: {
      functions: [],
      components: [],
      variables: [],
    },
    imports: [],
    hooks: [],
    hocs: [],
    props: [],
  }

  function isReactComponent(node: ts.Node): boolean {
    // Check if it's a function that returns JSX
    if (ts.isFunctionDeclaration(node) || ts.isArrowFunction(node)) {
      const body = ts.isFunctionDeclaration(node) ? node.body : node;
      if (!body) return false;

      let containsJsx = false;
      const visitJsx = (node: ts.Node) => {
        if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) {
          containsJsx = true;
        }
        ts.forEachChild(node, visitJsx);
      };

      ts.forEachChild(body, visitJsx);
      return containsJsx;
    }
    return false;
  }

  function isHook(node: ts.Node): boolean {
    if (ts.isFunctionDeclaration(node) || ts.isVariableDeclaration(node)) {
      const name = getNodeName(node);
      return name?.startsWith('use') ?? false;
    }
    return false;
  }

  function isHOC(node: ts.Node): boolean {
    if (ts.isFunctionDeclaration(node)) {
      // Check if function takes a component as parameter and returns a component
      const params = node.parameters;
      return params.some(param => {
        const type = param.type;
        return type && ts.isTypeReferenceNode(type) &&
          (type.typeName.getText() === 'ComponentType' ||
            type.typeName.getText() === 'FC' ||
            type.typeName.getText() === 'FunctionComponent');
      });
    }
    return false;
  }

  function getHookDependencies(node: ts.Node): string[] {
    const dependencies: string[] = [];

    // Look for useEffect/useMemo/useCallback dependency arrays
    ts.forEachChild(node, child => {
      if (ts.isCallExpression(child) &&
        ts.isIdentifier(child.expression) &&
        ['useEffect', 'useMemo', 'useCallback'].includes(child.expression.text)) {
        const lastArg = child.arguments[child.arguments.length - 1];
        if (ts.isArrayLiteralExpression(lastArg)) {
          lastArg.elements.forEach(element => {
            if (ts.isIdentifier(element)) {
              dependencies.push(element.text);
            }
          });
        }
      }
    });

    return dependencies;
  }

  function visit(node: ts.Node) {
    if (ts.isExportDeclaration(node)) {
      const exportClause = node.exportClause;
      if (exportClause && ts.isNamedExports(exportClause)) {
        exportClause.elements.forEach(element => {
          const name = element.name.text;
          parsedNode.exports.variables.push(name);
        });
      }
    }

    else if (ts.isImportDeclaration(node)) {
      const importPath = (node.moduleSpecifier as ts.StringLiteral).text;
      const importClause = node.importClause;
      const importedItems: string[] = [];

      if (importClause) {
        if (importClause.name) {
          importedItems.push(importClause.name.text);
        }

        const namedBindings = importClause.namedBindings;
        if (namedBindings && ts.isNamedImports(namedBindings)) {
          namedBindings.elements.forEach(element => {
            importedItems.push(element.name.text);
          });
        }
      }

      if (importedItems.length > 0) {
        parsedNode.imports.push({
          source: importPath,
          items: importedItems
        });
      }
    }

    else if (ts.isFunctionDeclaration(node)) {
      const functionName = getNodeName(node);
      if (functionName) {
        if (isReactComponent(node)) {
          parsedNode.exports.components.push(functionName);
        } else {
          parsedNode.exports.functions.push(functionName);
        }
      }
    }

    else if (ts.isVariableStatement(node)) {
      node.declarationList.declarations.forEach(declaration => {
        const variableName = getNodeName(declaration);
        if (variableName) {
          if (declaration.initializer && isReactComponent(declaration.initializer)) {
            parsedNode.exports.components.push(variableName);
          } else {
            parsedNode.exports.variables.push(variableName);
          }
        }
      });
    }

    else if (ts.isExportAssignment(node)) {
      const expression = node.expression;
      const name = getNodeName(expression);
      if (name) {
        if (isReactComponent(expression)) {
          parsedNode.exports.components.push(name);
        } else {
          parsedNode.exports.variables.push(name);
        }
      }
    }

    if (isHook(node)) {
      const hookName = getNodeName(node);
      if (hookName) {
        const dependencies = getHookDependencies(node);
        parsedNode.hooks.push({
          name: hookName,
          dependencies
        });
      }
    }

    if (isHOC(node)) {
      const hocName = getNodeName(node);
      if (hocName) {
        parsedNode.hocs.push(hocName);
      }
    }

    if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) {
      parsedNode.props.push(...parseProps(node));
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  // Use Array.from instead of spread operator for Set
  parsedNode.exports.components = Array.from(new Set(parsedNode.exports.components));
  parsedNode.exports.functions = Array.from(new Set(parsedNode.exports.functions));
  parsedNode.exports.variables = Array.from(new Set(parsedNode.exports.variables));
  parsedNode.hocs = Array.from(new Set(parsedNode.hocs));

  return parsedNode as ParsedNode;
}

// Helper function to check if a file should be parsed
export const shouldParseFile = (filePath: string): boolean => {
  const validExtensions = ['.ts', '.tsx', '.js', '.jsx'];
  const invalidPaths = ['node_modules', 'dist', 'build', '.next'];

  const extension = filePath.slice(filePath.lastIndexOf('.'));
  const isValidExtension = validExtensions.includes(extension);
  const isValidPath = !invalidPaths.some(path => filePath.includes(path));

  return isValidExtension && isValidPath;
} 