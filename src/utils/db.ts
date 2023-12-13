import pgPromise, { IDatabase, IMain } from "pg-promise";
import { User } from "types/user";

const pgp: IMain = pgPromise();
const connectionString =process.env.DB_URL!;
export const db: IDatabase<User> = pgp(connectionString);
