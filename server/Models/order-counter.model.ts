import mongoose, { Schema } from "mongoose";

const orderCounterSchema = new Schema({
  key: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 },
});

const OrderCounter = mongoose.model("OrderCounter", orderCounterSchema);

export default OrderCounter;
