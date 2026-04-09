import mongoose, { Schema, models, model } from "mongoose";

export interface IOrderItemSubDoc {
  productId: mongoose.Types.ObjectId;
  title: string;
  price: number;
  quantity: number;
  imageURL: string;
}

export interface IShippingAddressSubDoc {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface IOrderDocument extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  items: IOrderItemSubDoc[];
  shippingAddress: IShippingAddressSubDoc;
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed";
  paymentMethod: string;
  createdAt: Date;
}

const OrderItemSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    imageURL: { type: String, required: true },
  },
  { _id: false }
);

const ShippingAddressSchema = new Schema(
  {
    fullName: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true, default: "US" },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrderDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: {
      type: [OrderItemSchema],
      required: true,
      validate: {
        validator: (v: IOrderItemSubDoc[]) => v.length > 0,
        message: "Order must have at least one item",
      },
    },
    shippingAddress: {
      type: ShippingAddressSchema,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: [0, "Total amount cannot be negative"],
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      default: "mock",
    },
  },
  {
    timestamps: true,
  }
);

OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });

const Order = models.Order || model<IOrderDocument>("Order", OrderSchema);
export default Order;
