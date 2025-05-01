import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import Image from "next/image";
import Link from "next/link";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card } from "./ui/card";

const Hero = () => {
    return (
        <section className="py-20 md:py-28">
            <div className=" px-4 md:px-6">
                <div className="flex flex-col items-center text-center space-y-4 animate-fade-in">
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
                        The Leading AI <span className="text-primary">Ghibli Style</span> Generator
                    </h1>
                    <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        Turn your selfies into Ghibli-inspired anime artwork in minutes. Save hundreds of dollars
                        and hours of your time.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
                        <Button size="lg" asChild>
                            <Link href="/convert">
                                Convert your photo now <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        {/* <Button variant="outline" size="lg" asChild>
                            <Link href="/examples">View examples</Link>
                        </Button> */}
                    </div>
                </div>
                <div className="mt-16 rounded-xl overflow-hidden shadow-2xl max-w-4xl mx-auto animate-fade-in-slow">
                    <div className=" grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-100">
                        <div>
                            <Card className="border-2 border-dashed border-muted-foreground/25 rounded-lg overflow-hidden">
                                <h2 className="text-xl font-semibold flex items-center justify-center">
                                    Original
                                </h2>
                                <AspectRatio ratio={5/6} className="bg-muted">
                                    <Image src="/img/before.jpg" alt="Before - Original" fill={true} />
                                </AspectRatio>
                            </Card>
                        </div>
                        <div>
                            <Card className="border-2 border-dashed border-muted-foreground/25 rounded-lg overflow-hidden">
                                <h2 className="text-xl font-semibold flex items-center justify-center">
                                    Ghibli Style Result
                                </h2>
                                <AspectRatio ratio={5/6} className="bg-muted">
                                    <Image src="/img/after.png" alt="After - Ghibli Style" fill={true} />
                                </AspectRatio>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </section >
    );
};

export default Hero;