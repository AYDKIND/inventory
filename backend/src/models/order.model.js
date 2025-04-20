import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    agent: { type: mongoose.Schema.Types.ObjectId, ref: "Agent", required: true },
    firm: { type: mongoose.Schema.Types.ObjectId, ref: "Firm", required: true },
    transport: { type: mongoose.Schema.Types.ObjectId, ref: "Transport", required: true },
    quality: { type: mongoose.Schema.Types.ObjectId, ref: "Quality", required: true },
    orderQuantity: { type: Number, required: true }, // Total quantity ordered
    pendingQuantity: { type: Number, default: 0, }, // Total quantity ordered
    dispatchedQuantity: { type: Number, default: 0, min: 0 }, // Tracks dispatched quantity
    rate: { type: Number, default: 0 },
    PoNumber: { type: String, default: "" },
    status: { 
      type: String, 
      enum: ["pending", "dispatched"], 
      default: "pending" 
    },
    dispatches: [
      {
        invoiceNumber:{type:String,default:""},
        quantity: { type: Number, required: true, min: 1 }, // Dispatched quantity
        remark: { type: String, default: "" },
        dispatchDate: { type: Date, required: true, default: Date.now },
      }
    ],
  },
  { timestamps: true }
);


//middlew
orderSchema.pre("save", function (next) {
  if (this.pendingQuantity==0) {
    this.status = "dispatched";
  } else {
    this.status = "pending";
  }
  next();
});


const Order = mongoose.model("Order", orderSchema);

export default Order;
