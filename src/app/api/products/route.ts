import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import { auth } from "@/lib/auth";

// GET /api/products — List products with filtering, search, pagination
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "newest";
    const featured = searchParams.get("featured");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    // Build filter
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {};

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (featured === "true") {
      filter.featured = true;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Build sort
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let sortOption: any = {};
    switch (sort) {
      case "price-asc":
        sortOption = { price: 1 };
        break;
      case "price-desc":
        sortOption = { price: -1 };
        break;
      case "rating":
        sortOption = { rating: -1 };
        break;
      case "newest":
      default:
        sortOption = { createdAt: -1 };
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortOption).skip(skip).limit(limit).lean(),
      Product.countDocuments(filter),
    ]);

    // Get unique categories for filter options
    const categories = await Product.distinct("category");

    return NextResponse.json({
      success: true,
      data: {
        items: products,
        total,
        page,
        totalPages: Math.ceil(total / limit),
        categories,
      },
    });
  } catch (error) {
    console.error("Products GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST /api/products — Create product (admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    await dbConnect();
    const body = await req.json();

    // Generate slug from title
    const slug = body.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const product = await Product.create({ ...body, slug });

    return NextResponse.json(
      { success: true, data: product },
      { status: 201 }
    );
  } catch (error) {
    console.error("Products POST error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create product" },
      { status: 500 }
    );
  }
}
