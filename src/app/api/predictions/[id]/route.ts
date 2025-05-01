import Replicate from "replicate";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

    const id = (await params).id
    const prediction = await replicate.predictions.get(id);

    if (!prediction) {
        return NextResponse.json({ error: "Prediction not found" }, { status: 404 });
    }

    return NextResponse.json(prediction);
}