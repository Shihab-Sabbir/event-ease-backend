"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = require("./shared/logger");
const router_1 = __importDefault(require("./router"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const handleNoRouteFound_1 = require("./errors/handleNoRouteFound");
const config_1 = require("./config");
const socket_1 = require("./socket");
const serverExitHandler_1 = require("./errors/serverExitHandler");
// Initialize Express App
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(logger_1.requestLogger);
// Routes
app.get('/', (req, res) => {
    res.send('Event Ease Auth Server Running !');
});
app.use('/api/v1', router_1.default);
app.get('/test', async (req, res, next) => {
    return res.send('Test is okay!');
});
// Error Handling
app.use(globalErrorHandler_1.default);
app.use(handleNoRouteFound_1.handleNoRouteFound);
// Server and Database Connection
let server;
process.on('uncaughtException', err => {
    logger_1.logger.error('Uncaught Exception:', err);
    process.exit(1);
});
async function connectDbAndStartServer() {
    try {
        // Connect to MongoDB
        await mongoose_1.default.connect(`${config_1.DB_URL}`);
        logger_1.logger.info('Database connection established!');
        // Start Server
        server = app.listen(config_1.PORT, () => {
            logger_1.logger.info(`App is listening on port ${config_1.PORT}`);
        });
        // Initialize WebSocket
        (0, socket_1.initSocket)(server);
    }
    catch (error) {
        logger_1.errorLogger.error('Failed to connect database', error);
    }
    // Handle Unhandled Promise Rejections
    process.on('unhandledRejection', err => {
        (0, serverExitHandler_1.serverExitHandler)(server, err);
    });
}
connectDbAndStartServer();
// Graceful Shutdown
process.on('SIGTERM', () => {
    if (server) {
        logger_1.logger.info('SIGTERM received. Closing server...');
        server.close(() => {
            logger_1.logger.info('Server closed gracefully.');
        });
    }
});
exports.default = app;
