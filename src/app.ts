import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { google } from "googleapis";
import morgan from "morgan";
import { errorMiddleware } from "./middlewares/error.js";

import userRoute from "./routes/userRoute.js";

dotenv.config({ path: "./.env" });

export const envMode = process.env.NODE_ENV?.trim() || "DEVELOPMENT";
const port = process.env.PORT || 3000;

export const sheets = google.sheets({
	version: "v4",
	auth: process.env.API_KEY,
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
	cors({
		origin: ["http://localhost:5173", process.env.FRONTEND_URL as string],
		methods: ["GET", "POST", "PUT", "DELETE"],
	})
);
app.use(morgan("dev"));

app.get("/", (req, res) => {
	res.send("Hello, World!");
});

app.use("/api/v1/user", userRoute);

app.get("*", (req, res) => {
	res.status(404).json({
		success: false,
		message: "Page not found",
	});
});

app.use(errorMiddleware);

app.listen(port, () =>
	console.log("Server is working on Port:" + port + " in " + envMode + " Mode.")
);
