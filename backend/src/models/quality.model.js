import mongoose from "mongoose";

const qualitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, 
    description: { type: String, default: "" },
    inStock: { type: Number, default: 0 },
    produced: { type: Number, default: 0 },
    dispatched: { type: Number, default: 0 },
    history: [
      {
        action: { type: String, required: true }, 
        quantity: { type: Number, required: true, min: 1 },
        date: { type: Date, default: Date.now }, 
      },
    ],
  },
  { timestamps: true } 
);

const Quality = mongoose.model("Quality", qualitySchema);

export default Quality;
