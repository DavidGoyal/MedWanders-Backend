import { Router } from "express";
import { newUser, updateExcel } from "../controllers/userController.js";

const app = Router();

app.post("/new", newUser);
app.get("/update", updateExcel);

export default app;
