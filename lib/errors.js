'use strict';

/**
 * An error thrown when an ordery.Order instance is passed to convert()
 * containing a black-listed field target.
 *
 * @extends {Error}
 */
class DeniedFieldError extends Error {
  /** @private */
  constructor(target) {
    super('A sort field was encountered that has been explicitly disallowed');
    this.data = target;
    this.name = 'DeniedFieldError';
  }
}


/**
 * An error thrown when an ordery.Order instance is passed to convert()
 * containing a field target that has not been white-listed.
 *
 * @extends {Error}
 */
class UnallowedFieldError extends Error {
  /** @private */
  constructor(target) {
    super('A sort field was encountered that is not explicitly allowed');
    this.data = target;
    this.name = 'UnallowedFieldError';
  }
}


/**
 * An error throw when an ordery.Order instance is passed to convert() missing a
 * required field.
 *
 * @extends {Error}
 */
class RequiredFieldError extends Error {
  /** @private */
  constructor(fields, requireAll) {
    const msg = (requireAll)
      ? 'The sort expression does not include all required fields'
      : 'The sort expression does not have at least one required field';

    super(msg);

    this.data = fields;
    this.name = 'RequiredFieldError';
  }
}


module.exports = {
  DeniedFieldError,
  UnallowedFieldError,
  RequiredFieldError,
};
