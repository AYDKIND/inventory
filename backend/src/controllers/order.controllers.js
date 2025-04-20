import Order from "../models/order.model.js";
import Quality from "../models/quality.model.js"; 
import mongoose from "mongoose";

export const createOrder = async (req, res) => {
  try {
    const {
      selectedAgent: agent,
      selectedFirm: firm,
      selectedTransport: transport,
      selectedQuality: quality,
      quantity: pendingQuantity,
      rate,
      poNumber: PoNumber,
      remark,
      dispatchDate,
    } = req.body;
    if (
      !agent ||
      !firm ||
      !transport ||
      !quality ||
      !pendingQuantity ||
      !rate
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided." });
    }

    if (pendingQuantity <= 0) {
      return res
        .status(400)
        .json({ message: "Quantity must be greater than zero." });
    }

    if (
      !mongoose.Types.ObjectId.isValid(agent) ||
      !mongoose.Types.ObjectId.isValid(firm) ||
      !mongoose.Types.ObjectId.isValid(transport) ||
      !mongoose.Types.ObjectId.isValid(quality)
    ) {
      return res
        .status(400)
        .json({
          message: "Invalid ID format for agent, firm, transport, or quality.",
        });
    }

    const newOrder = new Order({
      agent,
      firm,
      transport,
      quality,
      orderQuantity:pendingQuantity,
      pendingQuantity,
      rate: rate,
      PoNumber: PoNumber || "",
      remark: remark || "",
      dispatchDate: dispatchDate || null,
    });

    await newOrder.save();
    res
      .status(201)
      .json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getOrders = async (req, res) => {
  

  try {
    const orders = await Order.find().populate(
      "agent firm transport quality"
    );
console.log("hehey")
    const formattedOrders = orders.map((order) => ({
      _id: order._id,
      agent: order.agent?.name || "Unknown Agent",
      firm: order.firm?.name || "Unknown Firm", 
      transport: order.transport?.name || "Unknown Transport",
      quality: order.quality?.name || "Unknown Quality", 
      pendingQuantity: order.pendingQuantity,
      dispatchedQuantity:order.dispatchedQuantity,
      status: order.status,
      dispatchDate: order.dispatchDate,
      date: order.createdAt,
    }));
    return res.status(200).json(formattedOrders);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getOrderById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid order ID format" });
  }

  try {
    const order = await Order.findById(id).populate(
      "agent firm transport quality"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const formattedOrder = {
      _id: order._id,
      agent: order.agent?.name || "Unknown Agent", 
      agentId:order.agent?._id,
      firm: order.firm?.name || "Unknown Firm",
      firmId: order.firm._id,
      transport: order.transport?.name || "Unknown Transport", 
      transportId: order.transport?._id,
      quality: order.quality?.name || "Unknown Quality", 
      qualityId: order.quality?._id,
      quantity:order.orderQuantity,
      pendingQuantity: order.pendingQuantity,
      rate: order.rate,
      PoNumber: order.PoNumber,
      invoiceNumber: order.invoiceNumber,
      remark: order.remark,
      status: order.status,
      dispatchDate: order.dispatchDate,
      date: order.createdAt,
    };

    return res.status(200).json(formattedOrder);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getPendingOrders = async (req, res) => {
  try {
    const orders = await Order.find({ status: "pending" }).populate(
      "agent firm transport quality"
    ); 

    const formattedOrders = orders.map((order) => ({
      _id: order._id,
      agent: order.agent?.name || "Unknown Agent", 
      firm: order.firm?.name || "Unknown Firm",
      firmId: order.firm._id,
      transport: order.transport?.name || "Unknown Transport",
      quality: order.quality?.name || "Unknown Quality", 
      qualityId: order.quality?._id,
      pendingQuantity: order.pendingQuantity,
      rate: order.rate,
      PoNumber: order.PoNumber,
      remark: order.remark,
      status: order.status,
      dispatchDate: order.dispatchDate,
      date: order.createdAt,
    }));
    return res.status(200).json(formattedOrders);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getDispatchedOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("agent firm transport quality");

    let dispatchHistory = [];

    for (const order of orders) {
      if (order.dispatches && order.dispatches.length > 0) {
        order.dispatches.forEach((dispatch) => {
          dispatchHistory.push({
            dispatchedDate: dispatch.dispatchDate, 
            agent: order.agent?.name || "Unknown Agent", 
            rate: order.rate, 
            firm: order.firm?.name || "Unknown Firm", 
            firmId: order.firm._id, 
            quality: order.quality?.name || "Unknown Quality", 
            qualityId: order.quality?._id, 
            quantity: dispatch.quantity, 
            invoiceNumber: dispatch.invoiceNumber,
            remark: dispatch.remark,
          });
        });
      }
    }
    return res.status(200).json(dispatchHistory);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



export const getOrdersByQualityIdAndStatus = async (req, res) => {
  const { status: orderStatus, id } = req.params;

  try {
    const orders = await Order.find({
      quality: id,
      status: orderStatus,
    }).populate("agent firm transport quality");
    const formattedOrders = orders.map((order) => ({
      _id: order._id,
      agent: order.agent?.name || "Unknown Agent", 
      firm: order.firm?.name || "Unknown Firm", 
      firmId: order.firm._id,
      transport: order.transport?.name || "Unknown Transport", 
      quality: order.quality?.name || "Unknown Quality",
      qualityId: order.firm?._id,
      quantity: order.pendingQuantity,
      rate: order.rate,
      PoNumber: order.PoNumber,
      remark: order.remark,
      status: order.status,
      dispatchDate: order.dispatchDate,
      date: order.createdAt,
    }));
    return res.status(200).json(formattedOrders);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getOrdersByFirmIdAndStatus = async (req, res) => {
  const { status: orderStatus, id } = req.params; 

  try {
    const orders = await Order.find({ firm: id, status: orderStatus }).populate(
      "agent firm transport quality"
    );
    const formattedOrders = orders.map((order) => ({
      _id: order._id,
      agent: order.agent?.name || "Unknown Agent", 
      firm: order.firm?.name || "Unknown Firm",
      firmId: order.firm._id,
      transport: order.transport?.name || "Unknown Transport", 
      quality: order.quality?.name || "Unknown Quality", 
      qualityId: order.firm?._id,
      quantity: order.pendingQuantity,
      rate: order.rate,
      PoNumber: order.PoNumber,
      remark: order.remark,
      status: order.status,
      dispatchDate: order.dispatchDate,
      date: order.createdAt,
    }));
    return res.status(200).json(formattedOrders);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



export const dispatchOrder = async (req, res) => {
  const { id } = req.params;
  const { dispatchQuantity, invoiceNumber, remark } = req.body;

  if (dispatchQuantity == null ) {
    return res.status(400).json({ error: "Dispatch quantity is required." });
  }

  const session = await mongoose.startSession();
  session.startTransaction(); 

  try {
    const order = await Order.findById(id).session(session);
    if (!order) {
      await session.abortTransaction();
      return res.status(404).json({ error: "Order not found." });
    }

    if (dispatchQuantity > order.pendingQuantity) {
      await session.abortTransaction();
      return res.status(400).json({ error: "Dispatch quantity can't exceed pending quantity." });
    }


    const quality = await Quality.findById(order.quality).session(session);
    if (!quality) {
      await session.abortTransaction();
      return res.status(404).json({ error: "Quality data not found." });
    }


    if (quality.inStock < dispatchQuantity) {
      await session.abortTransaction();
      return res.status(400).json({ error: "Not enough quantities in stock." });
    }
    order.dispatchedQuantity += dispatchQuantity;
    order.pendingQuantity -= dispatchQuantity;
    order.dispatches.push({
      invoiceNumber,
      quantity: dispatchQuantity,
      remark,
      dispatchDate: new Date(),
    });
    quality.inStock -= dispatchQuantity;
    quality.dispatched += dispatchQuantity;
    quality.history.push({
      action: "dispatched",
      quantity: dispatchQuantity,
      date: new Date(),
    });

    await order.save({ session });
    await quality.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json(order);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({ error: "Failed to update order and quality." });
  }
};



export const getDispachSummary = async (req, res) => {
  try {
    const pastWeek = new Date();
    pastWeek.setDate(pastWeek.getDate() - 7);

    const summary = await Order.aggregate([
      { $unwind: "$dispatches" },
      { $match: { "dispatches.dispatchDate": { $gte: pastWeek } } },
      {
        $group: {
          _id: {
            $dayOfWeek: "$dispatches.dispatchDate", 
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const dayMap = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    res.json(summary.map(entry => ({ day: dayMap[entry._id - 1], count: entry.count })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const updateOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { selectedAgent, selectedQuality, selectedFirm, selectedTransport, quantity, rate, poNumber, remark } = req.body;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    // Fetch the existing order inside the session
    const existingOrder = await Order.findById(id).session(session);
    if (!existingOrder) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Order not found" });
    }

    // Calculate pending quantity
    const pendingQuantity = quantity - existingOrder.dispatchedQuantity;

    // Update order within transaction
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        agent: selectedAgent,
        quality: selectedQuality,
        firm: selectedFirm,
        transport: selectedTransport,
        orderQuantity: quantity,
        pendingQuantity,
        rate,
        poNumber,
        remark,
      },
      { new: true, session }
    );

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: "Order updated successfully", order: updatedOrder });

  } catch (error) {
    // Rollback transaction on error
    await session.abortTransaction();
    session.endSession();

    console.error("Update Order Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

