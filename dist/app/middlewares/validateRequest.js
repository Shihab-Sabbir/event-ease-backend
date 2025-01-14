"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validateRequest = (schema) => async (req, res, next) => {
    try {
        await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
            cookies: req.cookies,
        });
        // parseAsync for async operations , for sync operation parse is enough !
        return next();
    }
    catch (error) {
        next(error);
    }
};
exports.default = validateRequest;
