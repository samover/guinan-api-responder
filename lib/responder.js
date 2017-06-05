/**
 * index.js
 * .
 *
 * Created by samover on 05/06/2017.
 */

const JSONAPIError = require("guinan-api-serializer").Error;
const apiErrors = require("guinan-api-errors");
const httpStatus = require("http-status");

module.exports = {
    error: function errorResponder(res, errorObject) {
        let error = errorObject;
        const errorStatus = error.status || httpStatus.INTERNAL_SERVER_ERROR;
        const errorCode = error.code || 0;

        if (!apiErrors.isParentOf(error)) {
            error = apiErrors.internalServer(
                0,
                (error && error.message) || "Unknown error"
            );
        }

        const err = new JSONAPIError({
            id: error.id,
            code: errorCode.toString(),
            status: errorStatus,
            title: error.message,
            detail: error.detail,
            meta: {
                stack: error.stack,
            },
        });

        return res.status(errorStatus).json(err);
    },

    success: function succesResponder(res, { status, payload }) {
        res.status(status).json((payload));
    }
};
