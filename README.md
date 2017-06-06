# README

This module exposes a node/express response handler to be used consistently across all the iCapps API's.

## Installation

- `yarn add guinan-api-responder`
- `const Responder = require('guinan-api-responder')`

## Usage

### ErrorResponse

The Responder expects a `guinan-api-errors` object, otherwise it will transform it to an `InternalServerError`.
The errorHandler returns a json object following the [JSON API standards](http://jsonapi.org).

`Responder.error(res, error);`

### SuccessResponse

```
Responder.success(res, { 
  status: 200, 
  payload: { 
    response: "Success" 
  });
```

You can pass any payload you want, but it is recommended to use [jsonapi-serializer](https://github.com/seyz/jsonapi-serializer) or my wrapper [guinan-api-serializer](https://www.npmjs.com/package/guinan-api-serializer).

## Development

Clone the repo and install dependencies: `yarn`.
Run the tests with `yarn test`.
