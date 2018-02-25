'use strict';

const elv = require('elv');
const ordery = require('ordery');

const errors = require('./errors');
const Strategy = require('./strategy');


//
// ERROR MESSAGES
//


const msg = {
  argExp: 'Argument "expression" must be a string or instance of ordery.Order',
  argStrategy: 'Argument "strategy" must be an instance of Strategy',
};


//
// KNOWN VALUES
//


const ASC = 1;
const DESC = -1;
const DEFAULT_STRATEGY = new Strategy();


//
// ASSERTION HELPERS
//


const assertExpression = (expression) => {
  if (typeof expression === 'string') {
    const result = ordery.parse(expression);
    if (elv(result.error)) throw result.error;
    return result.value;
  }

  if (expression instanceof ordery.Order) return expression;

  throw new TypeError(msg.argExp);
}


const assertStrategy = (strategy) => {
  if (!elv(strategy)) return DEFAULT_STRATEGY;

  if (!(strategy instanceof Strategy)) {
    throw new TypeError(msg.argStrategy);
  }

  return strategy;
}


//
// CONVERT METHODS
//


/**
 * @typedef {object} Target
 * A field target.
 *
 * @prop {string[]} path
 * @prop {string} value
 */


/**
 * @typedef {object} OrderClause
 * A sort clause in an instance of ordery.Order.
 *
 * @prop {'asc'|'desc'} direction
 * @prop {Target} target
 */


/**
 * @typedef {object} Order
 * An instance of ordery.Order.
 *
 * @prop {OrderClause[]} value
 */


/**
 * @name convert
 * Converts a given Ordery Expression into a MongoDB sort document.
 *
 * @param {string|Order} expression
 * @param {Strategy} [strategy]
 *
 * @returns {object}
 */
module.exports = (expression, strategy) => {
  const exp = assertExpression(expression);
  const strat = assertStrategy(strategy);

  const doc = {};
  const fields = [];

  for (let i = 0; i < exp.value.length; i++) {
    const clause = exp.value[i];

    strat.assertAllowed(clause.target);

    const key = clause.target.path.join('.');
    const value = (clause.direction === ordery.Direction.DESC) ? DESC : ASC;
    doc[key] = value;

    fields.push(clause.target.value);
  }

  strat.assertMeetsRequired(fields);

  return doc;
};
