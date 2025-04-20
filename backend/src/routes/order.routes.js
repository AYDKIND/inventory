import express from "express";
import {
    createOrder,getDispatchedOrders,getOrderById,getOrders,getOrdersByFirmIdAndStatus,getOrdersByQualityIdAndStatus,getPendingOrders,dispatchOrder,
    getDispachSummary,updateOrder
  } from "../controllers/order.controllers.js";


const router = express.Router();


router.get("/", getOrders);
router.get("/pending", getPendingOrders);
router.get("/dispatched", getDispatchedOrders);
router.get("/dispatch-summary",getDispachSummary)
router.get("/:id",getOrderById)
router.get("/quality/:status/:id",getOrdersByQualityIdAndStatus)
router.get("/firm/:status/:id",getOrdersByFirmIdAndStatus)
router.post("", createOrder);
router.patch("/dispatch/:id", dispatchOrder);
router.patch("/update/:id",updateOrder)


export default router;