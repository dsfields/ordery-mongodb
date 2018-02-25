'use strict';

const { assert } = require('chai');
const ordery = require('ordery');

const convert = require('../../lib/convert');
const errors = require('../../lib/errors');
const Strategy = require('../../lib/strategy');


describe('#convert', function() {
  it('throws if expression not string or Ordery', function() {
    assert.throws(() => {
      convert(42);
    }, TypeError);
  });

  it('throws if expression is invalid string', function() {
    assert.throws(() => {
      convert('asdf');
    }, ordery.errors.ParserError);
  });

  it('does not throw if expression valid string', function() {
    assert.doesNotThrow(() => {
      convert('/foo:desc');
    });
  });

  it('does not throw if expression Order', function() {
    assert.doesNotThrow(() => {
      convert(ordery.Order.desc('/foo'));
    });
  });

  it('throws if strategy not Strategy', function() {
    assert.throws(() => {
      convert('/foo:desc', 42);
    }, TypeError);
  });

  it('converts json pointer to dot notation', function() {
    const result = convert('/foo/2/bar:asc');
    assert.property(result, 'foo.2.bar');
  });

  it('converts asc to 1', function() {
    const result = convert('/foo:asc');
    assert.strictEqual(result.foo, 1);
  });

  it('converts desc to -1', function() {
    const result = convert('/foo:desc');
    assert.strictEqual(result.foo, -1);
  });

  it('adds multiple concatonated fields', function() {
    const result = convert('/foo,/bar:desc,/baz:asc');
    assert.strictEqual(result.foo, 1);
    assert.strictEqual(result.bar, -1);
    assert.strictEqual(result.baz, 1);
  });

  it('adds multiple concatonated fields with dot notation', function() {
    const result = convert('/foo/bar,/baz/42:desc,/qux/3/quux:asc');
    assert.strictEqual(result['foo.bar'], 1);
    assert.strictEqual(result['baz.42'], -1);
    assert.strictEqual(result['qux.3.quux'], 1);
  });

  it('adds fields in order', function() {
    const doc = convert('/foo/bar,/baz/42:desc,/qux/3/quux:asc');
    const result = Object.keys(doc);
    assert.strictEqual(result[0], 'foo.bar');
    assert.strictEqual(result[1], 'baz.42');
    assert.strictEqual(result[2], 'qux.3.quux');
  });

  it('throws if using denied field', function() {
    assert.throws(() => {
      convert(
        '/foo,/bar',
        new Strategy({
          deny: ['/bar'],
        })
      );
    }, errors.DeniedFieldError);
  });

  it('does not throw if not using denied field', function() {
    assert.doesNotThrow(() => {
      convert(
        '/foo,/bar',
        new Strategy({
          deny: ['/qux'],
        })
      );
    }, errors.DeniedFieldError);
  });

  it('throws if using unallowed field', function() {
    assert.throws(() => {
      convert(
        '/foo,/bar:desc,/baz:asc',
        new Strategy({
          allow: ['/foo', '/bar'],
        })
      );
    }, errors.UnallowedFieldError);
  });

  it('does not throw if using all allowed fields', function() {
    assert.doesNotThrow(() => {
      convert(
        '/foo,/bar:desc,/baz:asc',
        new Strategy({
          allow: ['/foo', '/bar', '/baz'],
        })
      );
    }, errors.UnallowedFieldError);
  });

  it('throws if missing any required fields', function() {
    assert.throws(() => {
      convert(
        '/foo,/bar:desc,/baz:asc',
        new Strategy({
          require: {
            fields: ['/qux', '/quux'],
            which: 'any',
          },
        })
      );
    }, errors.RequiredFieldError);
  });

  it('does not throw if using at least one of any required field', function() {
    assert.doesNotThrow(() => {
      convert(
        '/foo,/bar:desc,/baz:asc',
        new Strategy({
          require: {
            fields: ['/foo', '/bar'],
            which: 'any',
          },
        })
      );
    }, errors.RequiredFieldError);
  });

  it('throws if missing all required fields', function() {
    assert.throws(() => {
      convert(
        '/foo,/bar:desc,/baz:asc',
        new Strategy({
          require: {
            fields: ['/foo', '/quux'],
            which: 'all',
          },
        })
      );
    }, errors.RequiredFieldError);
  });

  it('does not throw if using all required fields', function() {
    assert.doesNotThrow(() => {
      convert(
        '/foo,/bar:desc,/baz:asc',
        new Strategy({
          require: {
            fields: ['/foo', '/bar'],
            which: 'all',
          },
        })
      );
    }, errors.RequiredFieldError);
  });
});
