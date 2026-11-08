import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { getUsage, recordUsage } from "@/lib/usage";

// FLUX.2 [klein] 4B on Cloudflare Workers AI: free tier is 10,000 neurons/day
// (~100 conversions at the sizes used here). No credit card required.
const MODEL = "@cf/black-forest-labs/flux-2-klein-4b";

const PROMPT =
    "Redraw image 0 in the style of a Studio Ghibli anime film: hand-painted watercolor backgrounds, " +
    "soft warm natural lighting, clean cel-shaded characters with gentle expressive faces, lush pastel colors. " +
    "Keep the same people, pose, composition and background layout.";

const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

export const maxDuration = 60;

// Width/height must be multiples of 16 within the model's 256–1920 range.
function toDimension(value: FormDataEntryValue | null, fallback: number) {
    const n = Number(value);
    if (!Number.isFinite(n)) return fallback;
    return Math.min(1920, Math.max(256, Math.round(n / 16) * 16));
}

export async function POST(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ message: "Please sign in to convert images." }, { status: 401 });

    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;
    if (!accountId || !apiToken) {
        return NextResponse.json({ message: "Server is missing Cloudflare credentials." }, { status: 500 });
    }

    const usage = await getUsage(userId);
    if (usage.remaining <= 0) {
        return NextResponse.json(
            { message: `You've used all ${usage.limit} conversions for today. Come back tomorrow!` },
            { status: 429 },
        );
    }

    const formData = await req.formData();
    const image = formData.get("file");
    if (!(image instanceof Blob) || !image.type.startsWith("image/")) {
        return NextResponse.json({ message: "Please upload an image file." }, { status: 400 });
    }
    if (image.size > MAX_UPLOAD_BYTES) {
        return NextResponse.json({ message: "Image is too large." }, { status: 413 });
    }

    const cfForm = new FormData();
    cfForm.append("prompt", PROMPT);
    cfForm.append("input_image_0", image, "input.png");
    cfForm.append("width", String(toDimension(formData.get("width"), 1024)));
    cfForm.append("height", String(toDimension(formData.get("height"), 1024)));

    const cfRes = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${MODEL}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${apiToken}` },
        body: cfForm,
    });

    const data = await cfRes.json().catch(() => null);
    const base64: string | undefined = data?.result?.image;

    if (!cfRes.ok || !base64) {
        if (process.env.NODE_ENV === "development") console.error("Cloudflare AI error", cfRes.status, data?.errors);
        const message =
            cfRes.status === 429
                ? "The free AI capacity for today is used up. Please try again tomorrow."
                : "Conversion failed. Please try again with a different photo.";
        // No usage is recorded on failure.
        return NextResponse.json({ message }, { status: 502 });
    }

    await recordUsage(userId, usage.used);

    const mime = base64.startsWith("/9j/") ? "image/jpeg" : base64.startsWith("UklGR") ? "image/webp" : "image/png";

    return NextResponse.json({
        image: `data:${mime};base64,${base64}`,
        remaining: usage.remaining - 1,
        limit: usage.limit,
    });
}
