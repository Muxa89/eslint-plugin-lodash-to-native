"use strict";

const rule = require("../../../lib/rules/map.js");
const RuleTester = require("eslint").RuleTester;

const ruleTester = new RuleTester({});

ruleTester.run("map", rule, {
  valid: [
    "_ = function() {}; _.map([1, 2, 3], fn);",
    "_.map({a: 1, b: 2}, fn);"
  ],

  invalid: [
    {
      code: "_.map(arr, fn);",
      errors: 1,
      output: "(Array.isArray(arr)) ? arr.map(fn) : _.map(arr, fn);"
    }, {
      code: "var _ = require('lodash'); _.map([1, 2, 3], fn);",
      errors: 1,
      output: "var _ = require('lodash'); [1, 2, 3].map(fn);"
    }, {
      code: "var _ = require('lodash'); _.map([1, 2, 3], fn); _ = function() {}; _.map([3, 4], fn2);",
      errors: 1,
      output: "var _ = require('lodash'); [1, 2, 3].map(fn); _ = function() {}; _.map([3, 4], fn2);"
    }, {
      code: "_.map([1, 2, 3], fn);",
      errors: 1,
      output: "[1, 2, 3].map(fn);"
    }
  ]
});