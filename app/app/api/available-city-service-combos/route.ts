import { NextResponse } from "next/server";
import prisma from "@/lib/db"; // Adjust if your prisma client path is different

export async function GET() {
  try {
    const combos = await prisma.provider.findMany({
      select: {
        city: true,
        service: true,
      },
      distinct: ["city", "service"],
    });

    return NextResponse.json(combos);
  } catch (error) {
    console.error("Error fetching available city-service combos:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
