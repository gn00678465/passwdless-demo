import express from "express";
import { handleAuthStart, handleAuthFinish } from "../controllers";

const router = express.Router();

router.post("/authentication", handleAuthStart);

router.put("/authentication", handleAuthFinish);

export default router;
