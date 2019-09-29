"use strict";

const rule = require("../../../lib/rules/map.js");
const RuleTester = require("eslint").RuleTester;

const ruleTester = new RuleTester({
});

ruleTester.run("map", rule, {
  valid: [
    // '_.map()',
    // '(Array.isArray(arr)) ? arr.map(fn) : _.map(arr, fn);'
    // '_.notMap()',
    // '_.map(123)',
    // '_.map([1, 2, 3])',
    // 'var a = []; _.map();',
    // {
    //   code: '_.map()',
    // }
  ],

  invalid: [
    {
      code: "_.map([1, 2, 3], function() {}); _ = fn(); _.map(arr, fn);",
      errors: 1,
      // output: "123;"
    }
    // {
    //   code: "var invalidVariable = true",
    //   errors: [{ message: "Unexpected invalid variable." }]
    // },
    // {
    //   code: "var invalidVariable = true",
    //   errors: [{ message: /^Unexpected.+variable/ }]
    // }
  ]
});