/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * Database seed script — run with: npx tsx scripts/seed.ts
 * Creates sample products, an admin user, and a test user.
 */

const { loadEnvConfig } = require("@next/env");
loadEnvConfig(process.cwd());

const mongooseLib = require("mongoose");
const bcrypt = require("bcryptjs");

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://username:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority";

/* ── Schemas (inline to avoid path alias issues) ── */
const UserSchema = new mongooseLib.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: "user" },
    avatar: String,
  },
  { timestamps: true }
);

const ProductSchema = new mongooseLib.Schema(
  {
    title: String,
    slug: { type: String, unique: true },
    description: String,
    price: Number,
    compareAtPrice: Number,
    category: String,
    imageURL: String,
    images: [String],
    stock: Number,
    rating: Number,
    numReviews: Number,
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongooseLib.models.User || mongooseLib.model("User", UserSchema);
const Product =
  mongooseLib.models.Product || mongooseLib.model("Product", ProductSchema);

/* ── Sample data ── */
const products = [
  // Electronics
  {
    title: "Wireless Noise-Cancelling Headphones Pro",
    slug: "wireless-nc-headphones-pro",
    description:
      "Premium wireless headphones with adaptive noise cancellation, 40-hour battery life, and Hi-Res Audio support. Features memory foam ear cushions for all-day comfort.",
    price: 299.99,
    compareAtPrice: 399.99,
    category: "Electronics",
    imageURL: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=450&fit=crop",
    images: [],
    stock: 45,
    rating: 4.8,
    numReviews: 234,
    featured: true,
  },
  {
    title: "Ultra-Slim Laptop Stand",
    slug: "ultra-slim-laptop-stand",
    description:
      "Ergonomic aluminum laptop stand with adjustable height angles. Compatible with all laptops 10-17 inches. Foldable and portable design.",
    price: 49.99,
    category: "Electronics",
    imageURL: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=450&fit=crop",
    images: [],
    stock: 120,
    rating: 4.5,
    numReviews: 89,
    featured: false,
  },
  {
    title: "Smart Watch Series X",
    slug: "smart-watch-series-x",
    description:
      "Advanced smartwatch with health monitoring, GPS tracking, and 7-day battery life. Features AMOLED display with always-on functionality.",
    price: 249.99,
    compareAtPrice: 329.99,
    category: "Electronics",
    imageURL: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=450&fit=crop",
    images: [],
    stock: 78,
    rating: 4.6,
    numReviews: 156,
    featured: true,
  },
  {
    title: "Portable Bluetooth Speaker",
    slug: "portable-bluetooth-speaker",
    description:
      "Waterproof portable speaker with 360-degree sound, 24-hour battery, and built-in microphone. Perfect for outdoor adventures.",
    price: 79.99,
    category: "Electronics",
    imageURL: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=450&fit=crop",
    images: [],
    stock: 200,
    rating: 4.4,
    numReviews: 312,
    featured: false,
  },
  // Clothing
  {
    title: "Premium Merino Wool Sweater",
    slug: "premium-merino-wool-sweater",
    description:
      "Luxuriously soft 100% merino wool sweater in classic crew neck design. Temperature regulating and naturally odor-resistant.",
    price: 89.99,
    compareAtPrice: 129.99,
    category: "Clothing",
    imageURL: "https://images.unsplash.com/photo-1434389677669-e08b4cda3a89?w=600&h=450&fit=crop",
    images: [],
    stock: 65,
    rating: 4.7,
    numReviews: 178,
    featured: true,
  },
  {
    title: "Classic Denim Jacket",
    slug: "classic-denim-jacket",
    description:
      "Timeless denim jacket crafted from premium selvedge denim. Features a tailored fit with vintage-inspired wash.",
    price: 119.99,
    category: "Clothing",
    imageURL: "https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?w=600&h=450&fit=crop",
    images: [],
    stock: 42,
    rating: 4.3,
    numReviews: 67,
    featured: false,
  },
  {
    title: "Athletic Performance Tee",
    slug: "athletic-performance-tee",
    description:
      "Moisture-wicking performance t-shirt with four-way stretch fabric. Lightweight and breathable for intense workouts.",
    price: 34.99,
    category: "Clothing",
    imageURL: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=450&fit=crop",
    images: [],
    stock: 300,
    rating: 4.2,
    numReviews: 445,
    featured: false,
  },
  {
    title: "Premium Leather Belt",
    slug: "premium-leather-belt",
    description:
      "Handcrafted full-grain leather belt with brushed nickel buckle. Available in multiple sizes with lifetime warranty.",
    price: 59.99,
    category: "Clothing",
    imageURL: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=450&fit=crop",
    images: [],
    stock: 85,
    rating: 4.6,
    numReviews: 94,
    featured: false,
  },
  // Home & Living
  {
    title: "Minimalist Ceramic Vase Set",
    slug: "minimalist-ceramic-vase-set",
    description:
      "Set of 3 handcrafted ceramic vases in matte finish. Perfect for modern home décor. Available in Nordic-inspired colors.",
    price: 44.99,
    category: "Home",
    imageURL: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600&h=450&fit=crop",
    images: [],
    stock: 55,
    rating: 4.8,
    numReviews: 123,
    featured: true,
  },
  {
    title: "Organic Cotton Throw Blanket",
    slug: "organic-cotton-throw-blanket",
    description:
      "Ultra-soft organic cotton throw blanket with herringbone pattern. GOTS certified, machine washable, and comes in a reusable cotton bag.",
    price: 69.99,
    compareAtPrice: 89.99,
    category: "Home",
    imageURL: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=450&fit=crop",
    images: [],
    stock: 90,
    rating: 4.9,
    numReviews: 201,
    featured: true,
  },
  {
    title: "Scented Soy Candle Collection",
    slug: "scented-soy-candle-collection",
    description:
      "Hand-poured soy candles in elegant glass jars. Set of 4 seasonal scents including Lavender, Vanilla, Cedar, and Citrus. 50-hour burn time each.",
    price: 39.99,
    category: "Home",
    imageURL: "https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=600&h=450&fit=crop",
    images: [],
    stock: 140,
    rating: 4.7,
    numReviews: 289,
    featured: false,
  },
  {
    title: "Bamboo Desk Organizer",
    slug: "bamboo-desk-organizer",
    description:
      "Sustainable bamboo desk organizer with multiple compartments. Keeps your workspace tidy and eco-friendly.",
    price: 29.99,
    category: "Home",
    imageURL: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=450&fit=crop",
    images: [],
    stock: 75,
    rating: 4.3,
    numReviews: 56,
    featured: false,
  },
  // Sports
  {
    title: "Professional Yoga Mat",
    slug: "professional-yoga-mat",
    description:
      "Extra-thick 6mm yoga mat with alignment lines. Non-slip surface, eco-friendly TPE material. Includes carrying strap.",
    price: 54.99,
    category: "Sports",
    imageURL: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&h=450&fit=crop",
    images: [],
    stock: 160,
    rating: 4.5,
    numReviews: 378,
    featured: false,
  },
  {
    title: "Insulated Water Bottle",
    slug: "insulated-water-bottle",
    description:
      "Double-wall vacuum insulated stainless steel water bottle. Keeps drinks cold for 24 hours or hot for 12 hours. BPA-free, 32oz capacity.",
    price: 29.99,
    compareAtPrice: 39.99,
    category: "Sports",
    imageURL: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=450&fit=crop",
    images: [],
    stock: 250,
    rating: 4.6,
    numReviews: 567,
    featured: true,
  },
  {
    title: "Resistance Bands Set",
    slug: "resistance-bands-set",
    description:
      "Complete set of 5 resistance bands with varying tension levels. Includes door anchor, handles, and ankle straps. Perfect for home workouts.",
    price: 24.99,
    category: "Sports",
    imageURL: "https://images.unsplash.com/photo-1598632640487-6ea4a4e8b963?w=600&h=450&fit=crop",
    images: [],
    stock: 180,
    rating: 4.4,
    numReviews: 234,
    featured: false,
  },
  {
    title: "Running Shoes Elite",
    slug: "running-shoes-elite",
    description:
      "Lightweight running shoes with responsive cushioning and breathable mesh upper. Designed for long-distance comfort.",
    price: 139.99,
    compareAtPrice: 179.99,
    category: "Sports",
    imageURL: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=450&fit=crop",
    images: [],
    stock: 95,
    rating: 4.7,
    numReviews: 423,
    featured: true,
  },
  // Books
  {
    title: "The Art of Mindful Living",
    slug: "art-of-mindful-living",
    description:
      "A comprehensive guide to incorporating mindfulness into your daily routine. Includes practical exercises and guided meditations.",
    price: 19.99,
    category: "Books",
    imageURL: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=450&fit=crop",
    images: [],
    stock: 500,
    rating: 4.8,
    numReviews: 892,
    featured: false,
  },
  {
    title: "Modern Architecture Photo Book",
    slug: "modern-architecture-photo-book",
    description:
      "Stunning hardcover coffee table book featuring 200+ photographs of iconic modern architecture from around the world.",
    price: 54.99,
    category: "Books",
    imageURL: "https://images.unsplash.com/photo-1553729459-afe8f2e2882d?w=600&h=450&fit=crop",
    images: [],
    stock: 30,
    rating: 4.9,
    numReviews: 67,
    featured: false,
  },
  {
    title: "Cookbook: Global Flavors",
    slug: "cookbook-global-flavors",
    description:
      "Explore 150+ recipes from 30 different cuisines. Beautiful photography and step-by-step instructions make global cooking accessible.",
    price: 34.99,
    category: "Books",
    imageURL: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=600&h=450&fit=crop",
    images: [],
    stock: 110,
    rating: 4.6,
    numReviews: 145,
    featured: false,
  },
  {
    title: "Digital Photography Masterclass",
    slug: "digital-photography-masterclass",
    description:
      "From beginner to pro — master composition, lighting, and post-processing. Includes access to online video tutorials.",
    price: 42.99,
    compareAtPrice: 59.99,
    category: "Books",
    imageURL: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=450&fit=crop",
    images: [],
    stock: 70,
    rating: 4.5,
    numReviews: 203,
    featured: false,
  },
];

async function seed() {
  try {
    console.log("🌱 Connecting to MongoDB...");
    await mongooseLib.connect(MONGODB_URI);
    console.log("✅ Connected!\n");

    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await User.deleteMany({});
    await Product.deleteMany({});

    // Create users
    console.log("👤 Creating users...");
    const adminPassword = await bcrypt.hash("admin123", 12);
    const userPassword = await bcrypt.hash("user123", 12);

    await User.create([
      {
        name: "Admin User",
        email: "admin@store.com",
        password: adminPassword,
        role: "admin",
      },
      {
        name: "John Doe",
        email: "user@store.com",
        password: userPassword,
        role: "user",
      },
    ]);
    console.log("  ✅ Admin: admin@store.com / admin123");
    console.log("  ✅ User:  user@store.com / user123\n");

    // Create products
    console.log("📦 Creating products...");
    await Product.insertMany(products);
    console.log(`  ✅ Created ${products.length} products\n`);

    console.log("🎉 Seed completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

seed();
