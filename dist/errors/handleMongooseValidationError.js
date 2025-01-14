"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleMongooseValidationError = (err) => {
    const error = Object.values(err.errors).map((er) => {
        return {
            path: er.path,
            message: er.message,
        };
    });
    return {
        statusCode: 400,
        message: 'Something went wrong',
        errorMessages: error,
    };
};
exports.default = handleMongooseValidationError;
