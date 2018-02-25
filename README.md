# ordery-mongodb

Convert [`ordery.Order`](https://www.npmjs.com/package/ordery#orderyorder) instances into [MongoDB sort documents](https://docs.mongodb.com/manual/reference/method/cursor.sort/).

__Table of Contents__

* [Usage](#usage)
* [API](#api)

## Usage

Install `ordery-mongodb` as a dependency in your application:

```sh
$ npm install order-mongodb -S
```

Use it in  your application:

```js
const ordery = require('ordery');
const ordongo = require('ordery-mongo');

const sort = order.parse('/foo:asc,/bar/baz:desc,/qux');
const mongoSort = ordongo.convert(sort);

console.log(mongoSort);
// {
//   "foo": 1,
//   "bar.baz": -1,
//   "qux": 1
// }
```

## API

The `ordery-mongodb` library provides a set of methods and classes for converting Ordery Expressions.

### `ordongo.convert(expression [, strategy])`

Converts a given Ordery Expression into a [MongoDB sort document](https://docs.mongodb.com/manual/reference/method/cursor.sort/).

__Parameters__

* `expression`: _(required)_ an instance of [`ordery.Order`](https://www.npmjs.com/package/ordery#orderyorder), or a string that can be parsed by `ordery`.

* `strategy`: _(optional)_ an instance of [`Strategy`](#ordongostrategy).

__Returns__

An object that represents the given Order Expression as a MongoDB sort document.

### `ordongo.errors.DeniedFieldError`

An error thrown when an [`ordery.Order`](https://www.npmjs.com/package/ordery#orderyorder) instance is passed to [`convert()`](#ordongoconvertexpression-strategy) containing a black-listed field target.

### `ordongo.errors.UnallowedFieldError`

An error thrown when an [`ordery.Order`](https://www.npmjs.com/package/ordery#orderyorder) instance is passed to [`convert()`](#ordongoconvertexpression-strategy) containing a field target that has not been white-listed.

### `ordongo.errors.RequiredFieldError`

An error throw when an [`ordery.Order`](https://www.npmjs.com/package/ordery#orderyorder) instance is passed to [`convert()`](#ordongoconvertexpression-strategy) missing a required field.

### `ordongo.Strategy`

A class that represents a converstion stratgy.  Instances are meant to be cached in memory to prevent having to recompute this information with every call to [`convert()`](#ordongoconvertexpression-strategy).

#### `Strategy.prototype.constructor([options])`

Create a new instance of `Strategy`.

__Parameters__

* `options`: _(optional)_ an object that provides conversion options.  This object can have the keys:

  + `allow`: _(optional)_ an array of strings in [RFC 6901 JSON Pointer](https://tools.ietf.org/html/rfc6901) format specifying the field targets that are allowed to participate in an MongoDB sort.  This functions as a white list of allowable fields, and can only be present if `deny` is absent or empty.

  + `deny`: _(optional)_ an array of strings in RFC 6901 JSON Pointer format specifying the field targets that are restricted from participating in an MongoDB sort.  This functions as a black list of allowable fields, and can only be present if `allow` is absent or empty.

  + `require`: _(optional)_ an object that specifies required field target behavior.  This object can have the following keys:

    - `fields`: _(optional)_ an array of strings in RFC 6901 JSON Pointer format specifying required fields targets in a given Ordery Expression.  If this key is ommitted or empty, there are assumed to be no required fields.

    - `which`: _(optional)_ a string specifying which `fields` are required to be in a given Ordery Expression.  This can be either `any` or `all`.  If ommitted, this value defaults to `any`.
