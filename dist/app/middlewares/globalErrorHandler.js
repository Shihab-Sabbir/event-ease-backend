"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../../config");
const handleMongooseValidationError_1 = __importDefault(require("../../errors/handleMongooseValidationError"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const logger_1 = require("../../shared/logger");
const zod_1 = require("zod");
const handleZodValidationError_1 = __importDefault(require("../../errors/handleZodValidationError"));
const globalErrorHandler = (err, req, res, next) => {
    config_1.NODE_ENV === 'development'
        ? console.log('Global error handler ~~ ', err)
        : logger_1.errorLogger.error('Global error handler ~~ ', err);
    let statusCode = 500;
    let message = 'Something went wrong';
    let errorMessages = [];
    if ((err === null || err === void 0 ? void 0 : err.name) === 'ValidationError') {
        const simplifyError = (0, handleMongooseValidationError_1.default)(err);
        statusCode = simplifyError.statusCode;
        message = simplifyError.message;
        errorMessages = simplifyError.errorMessages;
    }
    else if (err instanceof ApiError_1.default) {
        statusCode = err === null || err === void 0 ? void 0 : err.statusCode;
        message = err === null || err === void 0 ? void 0 : err.message;
        errorMessages = err.message
            ? [
                {
                    path: '',
                    message: err === null || err === void 0 ? void 0 : err.message,
                },
            ]
            : [];
    }
    else if (err instanceof zod_1.ZodError) {
        const simplifyError = (0, handleZodValidationError_1.default)(err);
        statusCode = simplifyError.statusCode;
        message = simplifyError.message;
        errorMessages = simplifyError.errorMessages;
    }
    else if (err instanceof Error) {
        message = err.message;
        errorMessages = (err === null || err === void 0 ? void 0 : err.message)
            ? [
                {
                    path: '',
                    message: err === null || err === void 0 ? void 0 : err.message,
                },
            ]
            : [];
    }
    // these if else condition and error modification are being done only for maintain a specific error response pattern from different error type origin like api error , mongoDb error or self created error.
    res.status(statusCode).json({
        success: false,
        message,
        errorMessages,
        stack: config_1.NODE_ENV !== 'production' ? err.stack : undefined,
    });
    next();
};
exports.default = globalErrorHandler;
