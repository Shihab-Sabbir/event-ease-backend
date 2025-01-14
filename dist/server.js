"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const logger_1 = require("./shared/logger");
const router_1 = __importDefault(require("./router"));
const handleNoRouteFound_1 = require("./errors/handleNoRouteFound");
const serverExitHandler_1 = require("./errors/serverExitHandler");
const socket_1 = require("./socket");
const config_1 = require("./config");
const app = (0, express_1.default)();
// Middleware setup
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(logger_1.requestLogger);
// Health check route
app.get('/', (req, res) => {
    res.send('Event Ease Auth Server Running !');
});
// API routes
app.use('/api/v1', router_1.default);
// Test route
app.get('/test', async (req, res, next) => {
    return res.send('Test is okay!');
});
// Global error handler
app.use(globalErrorHandler_1.default);
// Handle no route found error
app.use(handleNoRouteFound_1.handleNoRouteFound);
let server;
process.on('uncaughtException', err => {
    logger_1.logger.error(err);
    process.exit(1);
});
async function connectDbAndStartServer() {
    try {
        await mongoose_1.default.connect(`${config_1.DB_URL}`);
        logger_1.logger.info('Database connection established !');
        server = app.listen(config_1.PORT, () => {
            logger_1.logger.info(`App is listening on port ${config_1.PORT}`);
        });
        (0, socket_1.initSocket)(server);
    }
    catch (error) {
        logger_1.errorLogger.error('Failed to connect database', error);
    }
    process.on('unhandledRejection', err => {
        (0, serverExitHandler_1.serverExitHandler)(server, err);
    });
}
connectDbAndStartServer();
process.on('SIGTERM', () => {
    if (server) {
        logger_1.logger.info('SIGTERM is received');
        server.close();
    }
});
