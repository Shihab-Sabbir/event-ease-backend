"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = __importDefault(require("./user.model"));
const createUserDB = async (userInfo) => {
    const { email, password } = userInfo;
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    const createdUser = await user_model_1.default.create({
        email,
        password: hashedPassword,
    });
    if (!createdUser) {
        throw new Error('Failed to create user!');
    }
    return createdUser;
};
const verifyPassword = async (password, hashedPassword) => {
    try {
        const isMatch = await bcryptjs_1.default.compare(password, hashedPassword);
        if (!isMatch) {
            throw new Error('Incorrect password!');
        }
        return isMatch;
    }
    catch (error) {
        throw new Error('Error verifying password!');
    }
};
exports.UserService = {
    createUserDB,
    verifyPassword,
};
