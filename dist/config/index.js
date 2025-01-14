"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NODE_ENV = exports.DEFAULT_PASS = exports.DB_URL = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), '.env') });
//cwd meaning = current directory
//path: path.join(process.cwd(), ".env") meaning , join the current path and '.env' path. This way one can make full path for '.env file' .
// in node.js direct path outside of src(root directory) can not be called directly. so this join method is used !
_a = process.env, exports.PORT = _a.PORT, exports.DB_URL = _a.DB_URL, exports.DEFAULT_PASS = _a.DEFAULT_PASS, exports.NODE_ENV = _a.NODE_ENV;
