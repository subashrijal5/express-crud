import { User } from "../types/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../utils/db";

const generateAuthToken = (user: User): string => {
    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET!,
        {
            expiresIn: "1h", // Token expires in 1 hour, adjust as needed
        }
    );
    return token;
};

export const authenticateUser = async (
    email: string,
    password: string
): Promise<string | null> => {
    try {
        const user = await db.oneOrNone(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (user && bcrypt.compareSync(password, user.password)) {
            // Passwords match, generate and return an authentication token
            const authToken = generateAuthToken(user);
            return authToken;
        }
        // User not found or password doesn't match
        return null;
    } catch (error) {
        console.error(error);
        // TODO: Handle error appropriately (e.g., log th)
        throw new Error("Failed to authenticate user");
    }
};
