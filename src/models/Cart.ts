import mongoose, { Schema, models, model } from "mongoose";

export interface ICartItemSubDoc {
  productId: mongoose.Types.ObjectId;
  quantity: number;
}

export interface ICartDocument extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  items: ICartItemSubDoc[];
}

const CartItemSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"],
      default: 1,
    },
  },
  { _id: false }
);

const CartSchema = new Schema<ICartDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: {
      type: [CartItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Cart = models.Cart || model<ICartDocument>("Cart", CartSchema);
export default Cart;
