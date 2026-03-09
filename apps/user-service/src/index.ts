import express from "express";
import { createServer } from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import authRouter from "./routes/auth";
import usersRouter from "./routes/users";
import friendsRouter from "./routes/friends";

const PORT = process.env.PORT ? Number(process.env.PORT) : 8531;
const CLIENT_URL = process.env.CLIENT_URL ?? "http://localhost:3000";

const app = express();
const httpServer = createServer(app);

app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

app.get("/health", (_req, res) => {
    res.json({ success: true, data: { service: "user-service", status: "ok" } });
});

app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/friends", friendsRouter);

app.use((_req, res) => {
    res.status(404).json({ success: false, error: "Route not found" });
});

httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ user-service ready on http://localhost:${PORT}`);
});