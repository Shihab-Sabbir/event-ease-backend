"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, data) => {
    const { success, message = null, result = null, statusCode } = data;
    res.status(statusCode).send({
        success: success,
        message: message,
        data: result,
    });
};
exports.default = sendResponse;
