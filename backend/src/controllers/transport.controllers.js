import Transport from "../models/transport.model.js";

export const getTransports = async (req, res) => {
  try {
    const transports = await Transport.find().populate("firm");
    res.status(200).json(transports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTransport = async (req, res) => {
  try {
    const transport = await Transport.findById(req.params.id).populate("firm");
    if (!transport) {
      return res.status(404).json({ message: "Transport not found" });
    }
    res.status(200).json(transport);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTransportsByFirm = async (req, res) => {
  try {
    const transports = await Transport.find({ firm: req.params.firmId });
    res.status(200).json(transports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTransport = async (req, res) => {
  const { name, firm } = req.body;

  if (!name || !firm) {
    return res.status(400).json({ message: "Name and firm are required" });
  }

  const newTransport = new Transport({ name, firm });

  try {
    await newTransport.save();
    res.status(201).json(newTransport);
  } catch (error) {
    res.status(500).json({ message: "Failed to create transport" });
  }
};


export const updateTransport = async (req, res) => {
  try {
    const transport = await Transport.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!transport) {
      return res.status(404).json({ message: "Transport not found" });
    }
    res.status(200).json(transport);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTransport = async (req, res) => {
  try {
    const transport = await Transport.findByIdAndDelete(req.params.id);
    if (!transport) {
      return res.status(404).json({ message: "Transport not found" });
    }
    res.status(200).json({ message: "Transport deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
