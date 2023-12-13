import express, { Request, Response } from "express";
import {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
} from "../controllers/userController";
import { authenticateJWT } from "../middleware/authMiddleware";
import { errorResponse, successResponse } from "../utils/response";
import {
    createUserValidation,
    updateUserValidation,
} from "../middleware/validation/userValidationMiddleware";
import { validationResult } from "express-validator";
import { isUuid } from "../utils/helper";

const router = express.Router();

router.use(authenticateJWT);

router.post("/", createUserValidation, async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(422)
                .json(errorResponse("Request data is invalid", errors.array()));
        }
        const newUser = await createUser(req.body);
        res.status(201).json(successResponse(newUser));
    } catch (error) {
        console.error(error);
        res.status(500).json(errorResponse("Cannot create user."));
    }
});

router.get("/", async (req: Request, res: Response) => {
    try {
        const users = await getUsers();
        res.status(200).json(successResponse(users, "User fetched."));
    } catch (error) {
        console.error(error);
        res.status(500).json(errorResponse("Cannot fetch records."));
    }
});

router.get("/:id", async (req: Request, res: Response) => {
    const userId = req.params.id;

    try {
        const isvalidUuid = isUuid(userId);
        if (!isvalidUuid) {
            return invalidUuidResponse(res);
        }
        const user = await getUserById(userId);
        if (!user) {
            res.status(404).json(errorResponse("User not found"));
        } else {
            res.status(200).json(successResponse(user));
        }
    } catch (error) {
        console.error(error);
        res.status(500).json(errorResponse("Internal Server Error"));
    }
});

router.put(
    "/:id",
    updateUserValidation,
    async (req: Request, res: Response) => {
        const userId = req.params.id;
        try {
            const isvalidUuid = isUuid(userId);
            if (!isvalidUuid) {
                return res
                    .status(422)
                    .json(errorResponse("The provided id is not valid uuid"));
            }

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(422)
                    .json(
                        errorResponse("Request data is invalid", errors.array())
                    );
            }
            const updatedUser = await updateUser(userId, req.body);
            if (!updatedUser) {
                res.status(404).json(errorResponse("User not found"));
            } else {
                res.status(200).json(successResponse(updatedUser));
            }
        } catch (error) {
            console.error(error);
            res.status(500).json(errorResponse("Cannot update record"));
        }
    }
);

router.delete("/:id", async (req: Request, res: Response) => {
    const userId = req.params.id;
    try {
        const isvalidUuid = isUuid(userId);
        if (!isvalidUuid) {
            return invalidUuidResponse(res);
        }

        const deletedUser = await deleteUser(userId);
        if (!deletedUser) {
            res.status(404).json(errorResponse("User not found"));
        } else {
            res.status(204).send();
        }
    } catch (error) {
        console.error(error);
        res.status(500).json(errorResponse("Cannot delete", []));
    }
});

export default router;

const invalidUuidResponse = (res: Response) => {
    return res
        .status(422)
        .json(errorResponse("The provided id is not valid uuid"));
};
