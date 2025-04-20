// routes/qualityRoutes.js
import express from "express";
import {
  getAllQuality,
  getQualityById,
  createQuality,
  updateQuality,
  deleteQuality,
  newPackage,
  getlastProducedSummary
} from "../controllers/quality.controllers.js";

const router = express.Router();

router.get("/", getAllQuality);
router.get("/last-produced",getlastProducedSummary)
router.get("/:id", getQualityById);
router.post("", createQuality);
router.put("/:id", updateQuality);
router.delete("/:id", deleteQuality);
router.patch("/:id",newPackage)

export default router;
