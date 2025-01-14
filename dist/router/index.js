"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_1 = __importDefault(require("../app/modules/user/user.route"));
const event_route_1 = __importDefault(require("../app/modules/event/event.route"));
const router = express_1.default.Router();
const defaultRoutes = [
    {
        path: '/auth',
        route: user_route_1.default,
    },
    {
        path: '/event',
        route: event_route_1.default,
    },
];
defaultRoutes.forEach(route => {
    router.use(route.path, route.route);
});
exports.default = router;
