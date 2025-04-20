import Quality from "../models/quality.model.js";
import mongoose from "mongoose";

export const getAllQuality = async (req, res) => {
  try {
    const qualityItems = await Quality.find();
    res.status(200).json(qualityItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getQualityById = async (req, res) => {
  try {
    const qualityItem = await Quality.findById(req.params.id);
    if (!qualityItem) {
      return res.status(404).json({ message: "Quality item not found" });
    }
    res.status(200).json(qualityItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createQuality = async (req, res) => {
  try {

    
    const { name, description, inStock, produced, dispatched, history } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const newQuality = new Quality({
      name,
      description,
      inStock: inStock || 0,
      produced: produced || 0,
      dispatched: dispatched || 0,
      history: history && Array.isArray(history) ? history : [],
    });

    await newQuality.save();
    res.status(201).json(newQuality);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateQuality = async (req, res) => {
  try {
    const { name, description, inStock, produced, dispatched, history } = req.body;
    const updatedQuality = await Quality.findByIdAndUpdate(
      req.params.id,
      { name, description, inStock, produced, dispatched, history },
      { new: true }
    );

    if (!updatedQuality) {
      return res.status(404).json({ message: "Quality item not found" });
    }

    res.status(200).json(updatedQuality);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const newPackage = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { quantity } = req.body;
    const { id } = req.params;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be a positive number." });
    }

    session.startTransaction();

    const updatedQuality = await Quality.findByIdAndUpdate(
      id,
      {
        $inc: { inStock: quantity, produced: quantity },
        $push: { history: { action: "produced", quantity, timestamp: new Date() } }, 
      },
      { new: true, session }
    );

    if (!updatedQuality) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Quality item not found" });
    }

    await session.commitTransaction();
    session.endSession(); 

    res.status(200).json(updatedQuality);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: error.message });
  }
};

export const getlastProducedSummary=async (req, res) => {
  try {
    const lastProduced = await Quality.aggregate([
      { $unwind: "$history" }, 
      { $match: { "history.action": "produced" } },
      { $sort: { "history.date": -1 } }, 
      { $limit: 10 },
      {
        $project: {
          _id: 0,
          name: "$name",
          inStock: "$inStock",
          dispatched: "$dispatched",
          produced: "$history.quantity",
          date: "$history.date",
        },
      },
    ]);

    res.json(lastProduced);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteQuality = async (req, res) => {
  try {
    const deletedQuality = await Quality.findByIdAndDelete(req.params.id);
    if (!deletedQuality) {
      return res.status(404).json({ message: "Quality item not found" });
    }
    res.status(200).json({ message: "Quality item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
