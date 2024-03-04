import express from "express";
import { handleLogout } from "../controllers";

const router = express.Router();

router.post("/logout", handleLogout);

export default router;
