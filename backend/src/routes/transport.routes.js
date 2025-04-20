import express from "express" ;
import {
    getTransports, getTransport, getTransportsByFirm, createTransport, updateTransport, deleteTransport
  } from "../controllers/transport.controllers.js";

const router=express.Router();

router.get("", getTransports);
router.get("/:id", getTransport);
router.get("/firm/:firmId", getTransportsByFirm);
router.post("", createTransport);
router.put("/:id", updateTransport);
router.delete("/:id", deleteTransport);


export default router;