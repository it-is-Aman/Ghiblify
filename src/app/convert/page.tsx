'use client';

import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Download, ImageIcon, Loader2, RefreshCw, Upload, Wand2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import Container from "@/components/Container";
import { cn } from "@/lib/utils";

type Usage = { remaining: number; limit: number };

// The model needs input images smaller than 512x512, so we downscale in the browser.
const MAX_INPUT_SIDE = 510;
// Output long side; width/height must be multiples of 16.
const OUTPUT_LONG_SIDE = 1024;

const roundTo16 = (n: number) => Math.max(256, Math.round(n / 16) * 16);

async function prepareImage(file: File) {
    const bitmap = await createImageBitmap(file);
    const { width, height } = bitmap;

    const scale = Math.min(1, MAX_INPUT_SIDE / Math.max(width, height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    const blob = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not process image"))), "image/png"),
    );

    const outScale = OUTPUT_LONG_SIDE / Math.max(width, height);
    return { blob, outWidth: roundTo16(width * outScale), outHeight: roundTo16(height * outScale) };
}

function Panel({ label, children, highlight }: { label: string; children: React.ReactNode; highlight?: boolean }) {
    return (
        <div className={cn("rounded-2xl border bg-card p-3 shadow-sm", highlight && "ring-2 ring-primary/20")}>
            <div className="flex items-center justify-between px-1 pb-3">
                <h2 className="text-sm font-semibold">{label}</h2>
            </div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted">{children}</div>
        </div>
    );
}

export default function Convert() {
    const { isLoaded, isSignedIn } = useAuth();
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);

    const [resultImage, setResultImage] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imgPreview, setImgPreview] = useState<string | null>(null);
    const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);
    const [isConverting, setIsConverting] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [usage, setUsage] = useState<Usage | null>(null);

    useEffect(() => {
        if (!isLoaded) return;
        if (!isSignedIn) {
            router.push("/signin");
            return;
        }
        fetch("/api/usage")
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => data && setUsage({ remaining: data.remaining, limit: data.limit }))
            .catch(() => {});
    }, [isLoaded, isSignedIn, router]);

    const selectFile = (file: File | undefined) => {
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            setMessage({ text: "Please choose an image file.", error: true });
            return;
        }
        if (imgPreview) URL.revokeObjectURL(imgPreview);
        setSelectedFile(file);
        setImgPreview(URL.createObjectURL(file));
        setResultImage(null);
        setMessage(null);
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        selectFile(e.target.files?.[0]);
        e.target.value = "";
    };

    const handleDrop = (e: DragEvent<HTMLElement>) => {
        e.preventDefault();
        setIsDragging(false);
        selectFile(e.dataTransfer.files?.[0]);
    };

    const handleConvert = async () => {
        if (!selectedFile) return;

        setMessage(null);
        setIsConverting(true);

        try {
            const { blob, outWidth, outHeight } = await prepareImage(selectedFile);
            const formData = new FormData();
            formData.append("file", blob, "input.png");
            formData.append("width", String(outWidth));
            formData.append("height", String(outHeight));

            const res = await fetch("/api/convert", { method: "POST", body: formData });
            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                setMessage({ text: data.message ?? "Conversion failed. Please try again.", error: true });
                if (res.status === 429 && usage) setUsage({ ...usage, remaining: 0 });
                return;
            }

            setResultImage(data.image);
            setUsage({ remaining: data.remaining, limit: data.limit });
            setMessage({ text: "Done! Your Ghibli artwork is ready.", error: false });
        } catch (error) {
            if (process.env.NODE_ENV === "development") console.error(error);
            setMessage({ text: "Something went wrong. Please try again.", error: true });
        } finally {
            setIsConverting(false);
        }
    };

    const handleDownload = () => {
        if (!resultImage) return;
        const ext = resultImage.startsWith("data:image/jpeg") ? "jpg" : resultImage.startsWith("data:image/webp") ? "webp" : "png";
        const link = document.createElement("a");
        link.href = resultImage;
        link.download = `ghiblify-converted.${ext}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!isLoaded) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">
                <Loader2 className="size-6 animate-spin" />
            </div>
        );
    }

    if (!isSignedIn) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
                <p>Sign in to convert your photos.</p>
                <Button asChild className="rounded-full"><Link href="/signin">Go to sign in</Link></Button>
            </div>
        );
    }

    const outOfConversions = usage?.remaining === 0;
    const usedPercent = usage ? ((usage.limit - usage.remaining) / usage.limit) * 100 : 0;

    return (
        <Container className="py-12 md:py-16">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Convert your photo</h1>
                    <p className="mt-2 text-muted-foreground">Upload a photo and turn it into Ghibli-style artwork.</p>
                </div>

                {usage && (
                    <div className="w-full rounded-2xl border bg-card px-4 py-3 shadow-sm md:w-64">
                        <div className="flex items-baseline justify-between text-sm">
                            <span className="text-muted-foreground">Left today</span>
                            <span className="font-semibold">
                                {usage.remaining} <span className="font-normal text-muted-foreground">/ {usage.limit}</span>
                            </span>
                        </div>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${100 - usedPercent}%` }} />
                        </div>
                    </div>
                )}
            </div>

            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

            <div className="mt-8 grid gap-6 md:grid-cols-2">
                <Panel label="Original">
                    {imgPreview ? (
                        <Image src={imgPreview} fill alt="Original" className="object-contain" unoptimized />
                    ) : (
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                            className={cn(
                                "absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-6 text-center transition-colors",
                                isDragging ? "border-primary bg-secondary" : "border-border hover:border-primary/50 hover:bg-secondary/50",
                            )}
                        >
                            <div className="flex size-14 items-center justify-center rounded-full bg-card text-primary shadow-sm">
                                <Upload className="size-6" />
                            </div>
                            <div>
                                <p className="font-medium">Drop your photo here</p>
                                <p className="mt-1 text-sm text-muted-foreground">or click to browse · JPG, PNG, WebP</p>
                            </div>
                        </button>
                    )}
                </Panel>

                <Panel label="Ghibli style" highlight={!!resultImage}>
                    {resultImage ? (
                        <Image src={resultImage} fill alt="Ghibli-style result" className="object-contain" unoptimized />
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center text-muted-foreground">
                            {isConverting ? (
                                <>
                                    <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-sky/20 via-secondary to-sun/20" />
                                    <Loader2 className="relative size-8 animate-spin text-primary" />
                                    <p className="relative font-medium text-foreground">Painting your artwork…</p>
                                    <p className="relative text-sm">This usually takes a few seconds.</p>
                                </>
                            ) : (
                                <>
                                    <ImageIcon className="size-10 opacity-40" />
                                    <p className="text-sm">{imgPreview ? "Click Convert to see the magic" : "Your result will appear here"}</p>
                                </>
                            )}
                        </div>
                    )}
                </Panel>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2 md:gap-6">
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        className="h-11 flex-1 rounded-full bg-card"
                        onClick={() => inputRef.current?.click()}
                        disabled={isConverting}
                    >
                        <RefreshCw /> {imgPreview ? "Change photo" : "Choose photo"}
                    </Button>
                    <Button
                        className="h-11 flex-1 rounded-full"
                        onClick={handleConvert}
                        disabled={!selectedFile || outOfConversions || isConverting}
                    >
                        {isConverting ? <Loader2 className="animate-spin" /> : <Wand2 />}
                        {isConverting ? "Converting…" : "Convert"}
                    </Button>
                </div>
                <Button className="h-11 rounded-full" variant="secondary" onClick={handleDownload} disabled={!resultImage}>
                    <Download /> Download
                </Button>
            </div>

            <div className="mt-6 min-h-6 text-center text-sm" aria-live="polite">
                {message ? (
                    <p className={message.error ? "text-destructive" : "text-primary"}>{message.text}</p>
                ) : outOfConversions ? (
                    <p className="text-destructive">You&apos;ve used all your conversions for today. They reset at 00:00 UTC.</p>
                ) : (
                    <p className="text-muted-foreground">Free for everyone · {usage?.limit ?? 10} conversions per day · photos are never stored</p>
                )}
            </div>
        </Container>
    );
}
