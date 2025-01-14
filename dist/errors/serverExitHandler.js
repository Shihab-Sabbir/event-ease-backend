"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverExitHandler = void 0;
const logger_1 = require("../shared/logger");
const serverExitHandler = (server, err) => {
    logger_1.errorLogger.error(err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    else {
        process.exit(1);
    }
};
exports.serverExitHandler = serverExitHandler;
