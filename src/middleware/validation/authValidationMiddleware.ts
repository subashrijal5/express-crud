import { body } from "express-validator";

export const loginValidation = [
    body("email")
        .isEmail()
        .withMessage("Email must be a valid email")
        .notEmpty()
        .withMessage("Email is required"),
    body("password")
        .isString()
        .withMessage("password must be a string")
        .notEmpty()
        .withMessage("password is required"),
];
