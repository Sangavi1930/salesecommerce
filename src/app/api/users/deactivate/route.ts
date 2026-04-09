import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    // Deactivate the user
    await User.findByIdAndUpdate(session.user.id, { isActive: false });

    return NextResponse.json(
      { success: true, message: "Account deactivated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Deactivate error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to deactivate account" },
      { status: 500 }
    );
  }
}
