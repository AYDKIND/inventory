import mongoose from "mongoose";

const transportSchema = new mongoose.Schema({
  name: { type: String, required: true },
  firm: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Firm', 
    required: true 
  }, 
}, { timestamps: true });

const Transport = mongoose.model("Transport", transportSchema);

export default Transport;
