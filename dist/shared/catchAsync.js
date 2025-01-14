"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync = (fn) => {
    return async (req, res, next) => {
        try {
            fn(req, res, next);
        }
        catch (error) {
            next(error);
        }
    };
};
exports.default = catchAsync;
// catchAsync(function) {
// --> taking a function as a parameter
// --> returning same function by adding it into a try catch block.
// return async function {
//     try {...........}
//     catch (error) {next(error)}
// }
