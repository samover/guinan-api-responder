/**
 * responder.test.js
 * __test__
 *
 * Created by samover on 05/06/2017.
 */

const MockExpressResponse = require("mock-express-response");
const apiError = require("guinan-api-errors");
const responder = require("../lib/responder");

const customErrors = {
    0: {
        message: "Default Error",
        url: "http://example.com/errors/0"
    },
    9999: {
        message: "Custom error",
        url: "http://example.com/errors/9999"
    }
};

describe("Responder", () => {
    describe("#success", () => {
        it("Responds with a json success object", () => {
            const res = new MockExpressResponse();
            const payload = { data: { users: { id: 123, firstName: "Josh" } } };
            responder.success(res, { status: 200, payload });
            const result = res._getJSON();
            expect(res.statusCode).toBe(200);
            expect(result).toEqual(payload);
        });
    });

    describe("#error", () => {
        beforeAll(() => apiError.config(customErrors));

        it("Responds with a json error object made from apiError", () => {
            const res = new MockExpressResponse();
            const newError = apiError.notFound(9999, "Account does not exist");
            responder.error(res, newError);
            const result = res._getJSON();

            expect(result).toHaveProperty("errors");
            expect(result.errors).toHaveLength(1);
            expect(result.errors[0].id).toBe(newError.id);
            expect(result.errors[0].status).toBe(newError.status);
            expect(result.errors[0].code).toBe(newError.code.toString());
            expect(result.errors[0].title).toBe(newError.message);
            expect(result.errors[0].detail).toBe(newError.detail);
            expect(result.errors[0]).toHaveProperty("meta");
            expect(result.errors[0].meta).toHaveProperty("stack");
        });

        it("Responds with a 500 InternalServerError when passed error is not apiError", () => {
            const res = new MockExpressResponse();
            const newError = new Error("Something went wrong");
            responder.error(res, newError);
            const result = res._getJSON();

            expect(result).toHaveProperty("errors");
            expect(result.errors).toHaveLength(1);
            expect(typeof result.errors[0].id).toBe("string");
            expect(result.errors[0].status).toBe(500);
            expect(result.errors[0].code).toBe("0");
            expect(result.errors[0].title).toBe("Internal Server error");
            expect(result.errors[0].detail).toBe("Something went wrong");
            expect(result.errors[0]).toHaveProperty("meta");
            expect(result.errors[0].meta).toHaveProperty("stack");
        });

        it("Responds with a 500 InternalServerError when passed parameter is not an error object", () => {
            const res = new MockExpressResponse();
            const newError = "Something went wrong";
            responder.error(res, newError);
            const result = res._getJSON();

            expect(result).toHaveProperty("errors");
            expect(result.errors).toHaveLength(1);
            expect(typeof result.errors[0].id).toBe("string");
            expect(result.errors[0].status).toBe(500);
            expect(result.errors[0].code).toBe("0");
            expect(result.errors[0].title).toBe("Internal Server error");
            expect(result.errors[0].detail).toBe("Unknown error");
            expect(result.errors[0]).toHaveProperty("meta");
            expect(result.errors[0].meta).toHaveProperty("stack");
        });
    });
});

