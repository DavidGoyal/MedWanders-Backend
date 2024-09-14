import { NextFunction, Request, Response } from "express";
import { sheets } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { connectDB } from "../utils/connectDB.js";
import ErrorHandler from "../utils/errorHandler.js";
import axios from "axios";

type UserData = {
	id: string;
	name: string;
	country_code: string;
	phone: string;
	form: string;
};

export const newUser = TryCatch(
	async (req: Request, res: Response, next: NextFunction) => {
		const { form, name, country_code, phone } = req.body;

		if (!form || !name || !country_code || !phone) {
			return next(new ErrorHandler(400, "Please fill all the fields"));
		}

		const q =
			"INSERT INTO user_data (name, country_code, phone, form) VALUES (?, ?, ?, ?)";

		const connection = await connectDB();

		await connection.query(q, [name, country_code, phone, form]);

		return res.status(201).json({
			success: true,
			message: "User created successfully",
		});
	}
);

export const updateExcel = TryCatch(
	async (req: Request, res: Response, next: NextFunction) => {
		const connection = await connectDB();
		const [rows] = await connection.query("SELECT * FROM user_data");

		const response = await axios.post(
			process.env.GOOGLE_SCRIPT_URL as string,
			rows,
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		);

		res.status(200).json({
			success: true,
			message: response.data.message,
		});
	}
);
