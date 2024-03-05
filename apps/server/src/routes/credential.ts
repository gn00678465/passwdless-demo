import express from "express";
import { handleCredential, handleDeleteCredential } from "../controllers/credentials";

const router = express.Router();

router.get("/", handleCredential);
router.delete("/:id", handleDeleteCredential);

export default router;
