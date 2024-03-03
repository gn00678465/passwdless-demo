import express from "express";
import { handlePasskeysStart, handlePasskeysFinish } from "../controllers";

const router = express.Router();

router.post("/passkeys", handlePasskeysStart);

router.put("/passkeys", handlePasskeysFinish);

export default router;
