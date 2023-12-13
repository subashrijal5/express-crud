import { User } from "../types/user";
import { db } from "../utils/db";
import bcrypt from "bcrypt";

export const createUser = async (
    userData: Partial<User>
): Promise<User | undefined> => {
    const { name, email, password } = userData;

    try {
        const hashedPassword = bcrypt.hashSync(password!, 10);
        const result = await db.one(
            "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING name, email, id",
            [name, email, hashedPassword]
        );

        return result;
    } catch (error) {
        console.error(error);
        // TODO: Handle error appropriately (e.g., log the error, send an error response, etc.)
        throw new Error("Failed to create user");
    }
};

export const getUsers = async (): Promise<User[]> => {
    try {
        const users = await db.any("SELECT name, email, id FROM users");
        return users;
    } catch (error) {
        console.error(error);
        // TODO: Handle error appropriately (e.g., log the error, send an error response, etc.)
        throw new Error("Failed to retrieve users");
    }
};

export const getUserById = async (
    userId: string
): Promise<User | undefined> => {
    try {
        const user = await db.oneOrNone(
            "SELECT name, email, id FROM users WHERE id = $1",
            [userId]
        );

        return user;
    } catch (error) {
        console.error(error);
        // TODO: Handle error appropriately (e.g., log the error, send an error response, etc.)
        throw new Error("Failed to retrieve user by ID");
    }
};
export const getUserByEmail = async (
    email: string
): Promise<User | undefined> => {
    try {
        const user = await db.oneOrNone(
            "SELECT name, email, id FROM users WHERE email = $1",
            [email]
        );

        return user;
    } catch (error) {
        console.error(error);
        // TODO: Handle error appropriately (e.g., log the error, send an error response, etc.)
        throw new Error("Failed to retrieve user by ID");
    }
};

export const updateUser = async (
    userId: string,
    userData: Partial<User>
): Promise<User | undefined> => {
    const { name, email, password } = userData;

    try {
        const result = await db.oneOrNone(
            "UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING name, email, id",
            [name, email, password, userId]
        );

        return result;
    } catch (error) {
        console.error(error);
        // TODO: Handle error appropriately (e.g., log the error, send an error response, etc.)
        throw new Error("Failed to update user");
    }
};

export const deleteUser = async (userId: string): Promise<User | undefined> => {
    try {
        const result = await db.oneOrNone(
            "DELETE FROM users WHERE id = $1 RETURNING name, email, id",
            [userId]
        );
        return result;
    } catch (error) {
        console.error(error);
        // TODO: Handle error appropriately (e.g., log the error, send an error response, etc.)
        throw new Error("Failed to delete user");
    }
};
