/**
 * @fileoverview Rule to propose use native map function instead of lodash one.
 * @author Mikhail Chepko
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Use Array#map instead of lodash#map",
      category: "Best Practices",
      recommended: true
    },
    fixable: "code",
    schema: [] // no options
  },
  create: function (context) {
    return {
      "CallExpression[callee.object.name='_'][callee.property.name='map'][arguments.length>1]": function (node) {
        const source = context.getSourceCode();
        const firstArgSource = source.getText(node.arguments[0]);

        // Check if _ was reassigned
        const tokensBefore = source.getTokensBefore(node, { filter: token => token.type === "Identifier" && token.value === "_" });
        for (let i = 0; i < tokensBefore.length; i++) {
          const tokenNode = source.getNodeByRangeIndex(source.getIndexFromLoc(tokensBefore[i].loc.start));
          if (tokenNode.parent.type === "AssignmentExpression") {
            return;
          }
        }

        // Prevent recursion
        if (node.parent.type === "ConditionalExpression") {
          if (source.getText(node.parent.test) === `Array.isArray(${firstArgSource})`) {
            return;
          }
        }

        // _.map({a: 1, b: 2}, fn)
        if (node.arguments[0].type === "ObjectExpression") {
          return;
        }

        const fixer = ((context, node) => (fixer) => {
          const source = context.getSourceCode();
          const firstArgSource = source.getText(node.arguments[0]);
          const secondArgSource = source.getText(node.arguments[1]);

          // _.map([1, 2, 3], fn) => [1, 2, 3].map(fn)
          if (node.arguments[0].type === "ArrayExpression") {
            return fixer.replaceText(node, `${firstArgSource}.map(${secondArgSource})`);
          }

          // _.map(arr, fn) => (Array.isArray(arr)) ? arr.map(fn) : _.map(arr, fn)
          return fixer.replaceText(node, [
            `(Array.isArray(${firstArgSource})) `,
            `? ${firstArgSource}.map(${secondArgSource}) `,
            `: _.map(${firstArgSource}, ${secondArgSource})`
          ].join(''));
        })(context, node);

        context.report({
          node: node,
          message: 'Use native Array#map method if possible.',
          fix: fixer
        });
      }
    };
  }
};