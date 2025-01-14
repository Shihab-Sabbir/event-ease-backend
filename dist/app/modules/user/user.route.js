"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const user_validation_1 = require("./user.validation");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const userRoutes = express_1.default.Router();
userRoutes.post('/create-user', (0, validateRequest_1.default)(user_validation_1.userZodSchema), user_controller_1.UserController.createUser);
userRoutes.post('/login', (0, validateRequest_1.default)(user_validation_1.userZodSchema), user_controller_1.UserController.loginUser);
exports.default = userRoutes;
