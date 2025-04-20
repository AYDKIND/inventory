import express from "express";
import {
    getFirms, getFirm, getFirmsByAgent, createFirm, updateFirm, deleteFirm
  } from "../controllers/firm.controllers.js";


const router = express.Router();



router.get("", getFirms);
router.get("/:id", getFirm);
router.get("/:agentId", getFirmsByAgent);
router.post("", createFirm);
router.put("/:id", updateFirm);
router.delete("/:id", deleteFirm);


export default router;