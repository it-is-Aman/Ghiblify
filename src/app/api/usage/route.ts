import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getUsage } from "@/lib/usage";

export async function GET() {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    return NextResponse.json(await getUsage(userId));
}
