import express from "express";
import {
  getAgents, getAgent, createAgent, updateAgent, deleteAgent
} from "../controllers/agent.controllers.js";


const router = express.Router();

router.get("", getAgents);
router.get("/:id", getAgent);
router.post("", createAgent);
router.put("/:id", updateAgent);
router.delete("/:id", deleteAgent);

export default router;