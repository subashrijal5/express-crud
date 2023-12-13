import express, { Application, Request, Response } from "express";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";

const app: Application = express();

// Middleware
app.use(express.json());

// Routes

app.use("/api", authRoutes);

app.use("/api/users", userRoutes);

// Default route
app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to the API!");
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response) => {
    console.error(err.stack);
    res.status(500).send({
        message: "Internal Server Error",
        code: "INTERNAL_SERVER_ERROR",
    });
});

export default app;
