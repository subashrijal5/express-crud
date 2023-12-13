import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { errorResponse } from "../utils/response";

interface AuthenticatedRequest extends Request {
    user?: unknown;
}

export const authenticateJWT = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    const token = req.header("Authorization");
    if (!token) {
        return res
            .status(401)
            .json(errorResponse("Unauthorized- Missing Token"));
    }

    jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
        if (err) {
            return res
                .status(403)
                .json(errorResponse("Forbidden - Invalid token"));
        }
        req.user = user;
        next();
    });
};
