import { User } from '../../src/types/user';


export const db = {
    async oneOrNone(query: string, values: any[]): Promise<User | null> {
        console.log(`Executing query: ${query} with values: ${values}`);
        // Simulating a user found in the database
        const user: User = {
            id: "fsdfbsdfsdf",
            name: "John Doe",
            email: "test@example.com",
            password:
                "$2a$10$Q6M.Dt2l6ecDzXVpGZzU2eUHuqKd4OV.N3vskEGMX4JkNqIa8ug9K", // Simulated hashed password
        };

        return user;
    },
};
