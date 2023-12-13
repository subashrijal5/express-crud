import express, { Request, Response } from "express";
import { authenticateUser } from "../controllers/authController";
import { errorResponse, successResponse } from "../utils/response";
import { validationResult } from "express-validator";
import { loginValidation } from "../middleware/validation/authValidationMiddleware";

const router = express.Router();

router.post("/auth", loginValidation, async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(422)
                .json(errorResponse("Request data is invalid", errors.array()));
        }
        const authToken = await authenticateUser(email, password);

        if (authToken) {
            res.json(successResponse({ token: authToken }));
        } else {
            res.status(401).json(
                errorResponse(
                    "Authentication failed. Please check your login details."
                )
            );
        }
    } catch (error) {
        console.error(error);
        res.status(500).json(errorResponse("Internal Server Error"));
    }
});

export default router;
