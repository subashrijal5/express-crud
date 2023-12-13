import { getUserByEmail } from "../../controllers/userController";
import { body } from "express-validator";
import { db } from "../../utils/db";

export const createUserValidation = [
    body("name")
        .isString()
        .withMessage("name should be string")
        .notEmpty()
        .withMessage("name is required."),
    body("email")
        .isEmail()
        .withMessage("Email must be a valid email")
        .notEmpty()
        .withMessage("Email is required"),
    body("password")
        .isString()
        .withMessage("password must be a string")
        .notEmpty()
        .withMessage("password is required")
        .isLength({
            min: 8,
        })
        .withMessage("Password should be min of 8 character"),
    body("email").custom(async (value) => {
        const user = await getUserByEmail(value);
        if (user) {
            throw new Error("E-mail already in use");
        }
    }),
];

export const updateUserValidation = [
    body("name")
        .isString()
        .withMessage("name should be string")
        .notEmpty()
        .withMessage("name is required."),
    body("email")
        .isEmail()
        .withMessage("Email must be a valid email")
        .notEmpty()
        .withMessage("Email is required"),
    body("password")
        .isString()
        .withMessage("password must be a string")
        .notEmpty()
        .withMessage("password is required")
        .isLength({
            min: 8,
        })
        .withMessage("Password should be min of 8 character"),
    body("email").custom(async (value, meta) => {
        const user = await db.oneOrNone(
            "SELECT name, email, id FROM users WHERE email = $1 and id <> $2",
            [value, meta.req.params?.id]
        );
        if (user) {
            throw new Error("E-mail already in use");
        }
    }),
];
