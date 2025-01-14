"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = exports.errorLogger = exports.logger = void 0;
/* eslint-disable no-undef */
const winston_1 = require("winston");
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const path_1 = __importDefault(require("path"));
const { combine, label, prettyPrint, printf } = winston_1.format;
//custom log format
const myFormat = printf(({ level, message, label }) => {
    const date = new Date();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    return `${date.toDateString()} ${hour}:${minute}:${second} [${label}] ${level}: ${message}`;
});
const logger = (0, winston_1.createLogger)({
    level: 'info',
    format: combine(label({ label: 'Event Ease' }), prettyPrint(), myFormat),
    transports: [
        new winston_1.transports.Console(),
        new winston_daily_rotate_file_1.default({
            filename: path_1.default.join(process.cwd(), 'logs', 'winston', 'success', '%DATE%.log'),
            // this will create a folder name logs then inside that there will be a folder name winstone then inside that there will be folder called success and inside that new files will be automatically created in every 1 hour. and after 14 days old files will be removed
            datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: false,
            maxSize: '20m',
            maxFiles: '14d',
        }),
        // new transports.File({
        //   filename: path.join(process.cwd(), 'logs', 'winston', 'success.log'),
        //   level: 'info',
        // }),
    ],
});
exports.logger = logger;
const errorLogger = (0, winston_1.createLogger)({
    level: 'error',
    format: combine(label({ label: 'Event Ease' }), prettyPrint(), myFormat),
    transports: [
        new winston_1.transports.Console(),
        new winston_daily_rotate_file_1.default({
            filename: path_1.default.join(process.cwd(), 'logs', 'winston', 'error', '%DATE%.log'),
            datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: true,
            maxSize: '30m',
            maxFiles: '1d',
        }),
    ],
});
exports.errorLogger = errorLogger;
const apiLogger = (0, winston_1.createLogger)({
    level: 'info',
    format: combine(label({ label: 'Event Ease' }), prettyPrint(), myFormat),
    transports: [
        new winston_1.transports.Console(),
        new winston_daily_rotate_file_1.default({
            filename: path_1.default.join(process.cwd(), 'logs', 'winston', 'apiRequest', '%DATE%.log'),
            datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: true,
            maxSize: '30m',
            maxFiles: '1d',
        }),
    ],
});
const requestLogger = (req, res, next) => {
    apiLogger.info(`[${req.method}] ${req.originalUrl}`);
    next();
};
exports.requestLogger = requestLogger;
