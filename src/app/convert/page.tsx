'use client';

import { ChangeEvent, useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Download, Upload } from "lucide-react";

export default function Convert() {

    const { isLoaded, isSignedIn } = useAuth()

    const [resultImage, setResultImage] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [imgPreview, setImgPreview] = useState<string | null>(null)
    const [message, setMessage] = useState<string | null>(null);
    const [isuploading, setIsUploading] = useState<boolean>(false);
    const [credits, setCredits] = useState<number>(0)

    const router = useRouter()

    useEffect(() => {
        if (!isSignedIn) {
            router.push("/signin");
            return;
        }

        // Fetch user credits on page load
        fetch("/api/get-credits")
            .then((res) => res.json())
            .then((data) => setCredits(data.credits));

    }, [isSignedIn, router])

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedFile(file)
            setImgPreview(URL.createObjectURL(file))  // Create a preview URL for local file
        }
    }
    const handleConvert = async () => {
        if (!selectedFile) {
            setMessage("please select an image")
            return
        }

        if (credits <= 0) {
            setMessage("You don't have enough credits. Please buy more to continue.");
            return;
        }
        const formdata = new FormData()
        formdata.append("file", selectedFile)

        setMessage("")
        setIsUploading(true)

        try {
            const response = await axios.post("/api/predictions", formdata, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }, responseType: "blob"  // Required to receive image data as Blob
            })

            if (response) {
                // console.log(response);

                const imgBlob = response.data;  // Receive image blob from server
                // console.log(response.data);
                const imgUrl = URL.createObjectURL(imgBlob as Blob) // Convert blob to image URL
                setResultImage(imgUrl);
                setMessage("Conversion successful! 1 credit used.");
                setCredits(prev => prev - 1)    //update credit
            }

        } catch (error) {
            console.log(error);
            setMessage("Upload failed. Try again.");
        } finally {
            setIsUploading(false)
        }
    }

    const handleDownload = () => {
        if (!resultImage) {
            return
        }

        // Trigger file download from blob URL
        const link = document.createElement('a');
        link.href = resultImage;
        link.download = 'ghiblify-converted.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    if (!isLoaded) {
        return <div>Loading...</div>
    }

    if (!isSignedIn) {
        return (
            <>
                <div>Sign in to view this page</div>
                <Link href={"/signin"}>Sign in page</Link>
            </>
        )
    }


    return (
        <div className="flex min-h-screen flex-col">
            <main className="flex-1">
                <div className=" p-12 md:px-[20%]">
                    <h1 className="text-3xl font-bold mb-6 text-center">Convert Your Image</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:px-[10%]">
                        {/* Original Image Panel */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">Original Image</h2>
                            <Card className="border-2 border-dashed border-muted-foreground/25 rounded-lg overflow-hidden">
                                {imgPreview ? (
                                    <AspectRatio ratio={1 / 1} className="bg-muted">
                                        <Image
                                            src={imgPreview}
                                            fill={true}
                                            alt="Original"
                                            className="h-full w-full object-cover"
                                        />
                                    </AspectRatio>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12">
                                        <AspectRatio ratio={1 / 1} className="bg-muted">
                                            <Image className="h-12 w-12 text-muted-foreground mb-4"
                                                alt="empty"
                                                src={"./landscape-placeholder.svg"}
                                                fill={true}
                                            />
                                        </AspectRatio>
                                        <p className="text-muted-foreground text-sm">Upload an image to convert</p>
                                    </div>
                                )}
                            </Card>
                            <div className="space-y-2">
                                <Input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                                <Button className="w-full" onClick={() => document.getElementById('image-upload')?.click()}>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload Image
                                </Button>
                                <Button
                                    className="w-full"
                                    variant="secondary"
                                    onClick={handleConvert}
                                    disabled={!imgPreview || credits <= 0 || isuploading}
                                >
                                    {isuploading ? "Converting..." : "Convert to Ghibli Style"}
                                </Button>
                            </div>
                        </div>

                        {/* Converted Image Panel */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">Ghibli Style Result</h2>
                            <Card className="border-2 border-dashed border-muted-foreground/25 rounded-lg overflow-hidden">
                                {resultImage ? (
                                    <AspectRatio ratio={1 / 1} className="bg-muted">
                                        <Image
                                            src={resultImage}
                                            fill={true}
                                            alt="Converted"
                                            className="h-full w-full object-cover"
                                        />
                                    </AspectRatio>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12">
                                        <AspectRatio ratio={1 / 1} className="bg-muted">
                                            <Image className="h-12 w-12 text-muted-foreground mb-4"
                                                alt="empty"
                                                src={"./landscape-placeholder.svg"}
                                                fill={true}
                                            />
                                        </AspectRatio>
                                        <p className="text-muted-foreground text-sm">
                                            {imgPreview ? "Click 'Convert' to transform your image" : "Upload an image first"}
                                        </p>
                                    </div>
                                )}
                            </Card>
                            <Button
                                className="w-full"
                                onClick={handleDownload}
                                disabled={!resultImage}
                            >
                                <Download className="mr-2 h-4 w-4" />
                                Download Converted Image
                            </Button>
                        </div>
                    </div>

                    {/* Credit Info Message */}
                    <div className="flex flex-col items-center mt-6">
                        {message && (
                            <p
                                className={`text-sm ${message.toLowerCase().includes("failed") ? "text-red-500" : "text-green-600"
                                    }`}
                            >
                                {message}
                            </p>
                        )}
                        <p className="text-sm text-muted-foreground">
                            🔹 <strong>1 conversion = 1 credit</strong>. You need credits to use the service.
                        </p>
                        <p className="text-md font-medium mt-2">
                            Credits Remaining: <span className="font-bold">{credits}</span>
                        </p>
                        {credits === 0 && (
                            <p className="text-red-500 text-sm mt-1">
                                ⚠ You have no credits left. Purchase more to continue.
                            </p>
                        )}
                        <Link href="/#pricing" className="text-blue-500 underline mt-2">
                            Buy More Credits
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
