import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import { auth } from "@/lib/auth";
import { z } from "zod";

const orderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      title: z.string(),
      price: z.number().min(0),
      quantity: z.number().min(1),
      imageURL: z.string(),
    })
  ).min(1, "Order must have at least one item"),
  shippingAddress: z.object({
    fullName: z.string().min(2),
    street: z.string().min(5),
    city: z.string().min(2),
    state: z.string().min(2),
    zip: z.string().min(3),
    country: z.string().default("US"),
  }),
  paymentMethod: z.string().default("mock"),
});

// GET /api/orders — Get current user's orders
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isAdmin = (session.user as any).role === "admin";

    const filter = isAdmin ? {} : { userId: session.user.id };
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error("Orders GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// POST /api/orders — Place a new order
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validation = orderSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    await dbConnect();

    const { items, shippingAddress, paymentMethod } = validation.data;
    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = await Order.create({
      userId: session.user.id,
      items,
      shippingAddress,
      totalAmount,
      paymentMethod,
      status: "pending",
      paymentStatus: "paid", // Mock payment
    });

    return NextResponse.json(
      { success: true, data: order, message: "Order placed successfully!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Orders POST error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to place order" },
      { status: 500 }
    );
  }
}
