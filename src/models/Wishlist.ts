import mongoose, { Schema, models, model } from "mongoose";

export interface IWishlistDocument extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  products: mongoose.Types.ObjectId[];
}

const WishlistSchema = new Schema<IWishlistDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Wishlist =
  models.Wishlist || model<IWishlistDocument>("Wishlist", WishlistSchema);
export default Wishlist;
