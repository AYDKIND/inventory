import Firm from "../models/firm.model.js";
import Agent from "../models/agent.model.js";

export const getFirms = async (req, res) => {
  try {
    const firms = await Firm.find().populate("agent");
    res.status(200).json(firms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFirm = async (req, res) => {
  try {
    const firm = await Firm.findById(req.params.id).populate("agent");
    if (!firm) {
      return res.status(404).json({ message: "Firm not found" });
    }
    res.status(200).json(firm);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFirmsByAgent = async (req, res) => {
  try {
    const firms = await Firm.find({ agent: req.params.agentId });
    res.status(200).json(firms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createFirm = async (req, res) => {
  const { name, agent:agentId } = req.body;

  try {
    const foundAgent = await Agent.findById(agentId);
    if (!foundAgent) {
      return res.status(400).json({ message: "Agent not found" });
    }

    const newFirm = new Firm({ name, agent:agentId });

    await newFirm.save();
    res.status(201).json(newFirm);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateFirm = async (req, res) => {
  try {
    const firm = await Firm.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!firm) {
      return res.status(404).json({ message: "Firm not found" });
    }
    res.status(200).json(firm);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteFirm = async (req, res) => {
  try {
    const firm = await Firm.findByIdAndDelete(req.params.id);
    if (!firm) {
      return res.status(404).json({ message: "Firm not found" });
    }
    res.status(200).json({ message: "Firm deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
