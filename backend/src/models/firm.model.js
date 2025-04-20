import mongoose from "mongoose";

const firmSchema = new mongoose.Schema({
  name: { type: String, required: true },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true },  // References the Agent
});

const Firm = mongoose.model("Firm", firmSchema);

export default Firm;

