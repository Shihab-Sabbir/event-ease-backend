"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("./user.service");
const user_model_1 = __importDefault(require("./user.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createUser = async (req, res, next) => {
    var _a;
    try {
        const { user } = req.body;
        const result = await user_service_1.UserService.createUserDB(user);
        res.status(200).send({
            success: true,
            message: 'User created successfully!',
            data: result,
        });
    }
    catch (error) {
        if (error.code === 11000 && ((_a = error.keyPattern) === null || _a === void 0 ? void 0 : _a.email)) {
            return res
                .status(400)
                .json({ message: 'Email already taken! Please login.' });
        }
        next(error);
    }
};
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body.user;
        const user = await user_model_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found!' });
        }
        const isPasswordValid = await user_service_1.UserService.verifyPassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials!' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '24h',
        });
        res.status(200).json({
            success: true,
            message: 'Login successful!',
            token,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.UserController = {
    createUser,
    loginUser,
};
