import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  startWalk,
  addPoint,
  finishWalk,
  getWalks,
  getWalkById,
} from "../controllers/walkController.js";

const router = express.Router();

router.post("/start", verifyToken, startWalk);
router.patch("/:id/point", verifyToken, addPoint);
router.patch("/:id/finish", verifyToken, finishWalk);
router.get("/", verifyToken, getWalks);
router.get("/:id", verifyToken, getWalkById);

export default router;