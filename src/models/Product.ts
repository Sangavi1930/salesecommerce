import mongoose, { Schema, models, model } from "mongoose";

export interface IProductDocument extends mongoose.Document {
  title: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  imageURL: string;
  images: string[];
  stock: number;
  rating: number;
  numReviews: number;
  featured: boolean;
  createdAt: Date;
}

const ProductSchema = new Schema<IProductDocument>(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    compareAtPrice: {
      type: Number,
      min: [0, "Compare at price cannot be negative"],
      default: undefined,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    imageURL: {
      type: String,
      required: [true, "Product image URL is required"],
    },
    images: {
      type: [String],
      default: [],
    },
    stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for search and filtering
ProductSchema.index({ title: "text", description: "text" });
ProductSchema.index({ category: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ featured: 1 });
ProductSchema.index({ slug: 1 });

const Product =
  models.Product || model<IProductDocument>("Product", ProductSchema);
export default Product;
