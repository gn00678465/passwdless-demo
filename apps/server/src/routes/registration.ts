import express from "express";
import { handleRegisterStart, handleRegisterFinish } from "../controllers";

const router = express.Router();

router.post("/registration", handleRegisterStart);

router.put("/registration", handleRegisterFinish);

export default router;
