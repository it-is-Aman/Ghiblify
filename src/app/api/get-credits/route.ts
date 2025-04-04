import { getAuth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    const { userId } = getAuth(req);

    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    let user = await prisma.user.findUnique({ where: { userID: userId } });

    if (!user) {
        user = await prisma.user.create({
            data: { userID: userId },     //credits and id is default
        });
    }
    return NextResponse.json({ credits: user.credits });
}
