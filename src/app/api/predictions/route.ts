import Replicate from "replicate";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getAuth } from "@clerk/nextjs/server";

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {

    // Get current logged-in user ID via Clerk
    const { userId } = getAuth(req)

    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { userID: userId } })

    if (!user || user.credits <= 0) {
        return NextResponse.json({ message: "No credits left. Please upgrade." }, { status: 403 });
    }

    const formData = await req.formData()
    const image = formData.get("file") as File | null

    if (!image) {
        return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Deduct 1 credit
    await prisma.user.update({ where: { userID: userId }, data: { credits: user.credits - 1 } })

    // API for prediction
    const replicate = new Replicate({
        auth: process.env.REPLICATE_API_TOKEN,
    });

    const input = {
        image: image,
        prompt: "GHBLI anime style photo",
        go_fast: true,
        guidance_scale: 10,
        prompt_strength: 0.75
    };

    const prediction = await replicate.predictions.create({
        version: "166efd159b4138da932522bc5af40d39194033f587d9bdbab1e594119eae3e7f", // Your model version
        input
    });

    return NextResponse.json({ id: prediction.id });
}
