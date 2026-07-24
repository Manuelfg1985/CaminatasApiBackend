import express from "express";
import {
  startWalk,
  addPoint,
  finishWalk,
  getWalks,
  getWalkById,
} from "../controllers/walkController.js";

const router = express.Router();

router.post("/start", startWalk);
router.patch("/:id/point", addPoint);
router.patch("/:id/finish", finishWalk);
router.get("/", getWalks);
router.get("/:id", getWalkById);

export default router;