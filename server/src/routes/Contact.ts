import express, { Router } from "express";
import { contactUsHandler } from "../controllers/ContactUs.js";
const router: Router = express.Router();

router.post("/reach/contact", contactUsHandler);

export default router;
