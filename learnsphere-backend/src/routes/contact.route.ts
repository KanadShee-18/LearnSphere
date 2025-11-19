import express, { Router } from "express";
import { contactUsHandler } from "../controllers/contact.controller.js";
const router: Router = express.Router();

// #swagger.tags = ['Contact']
router.post("/reach/contact", contactUsHandler);

export default router;
