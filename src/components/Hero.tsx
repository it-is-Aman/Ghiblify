import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Container from "@/components/Container";

export default function Hero() {
    return (
        <section className="relative overflow-hidden">
            {/* Soft sky + sunlight wash */}
            <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute -top-40 left-1/2 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-sky/20 blur-3xl" />
                <div className="absolute top-40 -right-40 h-[360px] w-[360px] rounded-full bg-sun/20 blur-3xl" />
            </div>

            <Container className="grid items-center gap-12 py-16 md:py-24 lg:grid-cols-2 lg:gap-16">
                <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                        <Sparkles className="size-3.5" />
                        Free · 10 conversions every day
                    </span>

                    <h1 className="mt-6 text-balance font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.5rem]">
                        Turn your photos into <span className="italic text-primary">Ghibli-style</span> art
                    </h1>

                    <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
                        Upload a photo and get a hand-painted, Studio Ghibli–inspired version in seconds.
                        No subscription. Just sign in and start converting.
                    </p>

                    <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                        <Button asChild size="lg" className="h-12 rounded-full px-7 text-base">
                            <Link href="/convert">
                                Convert your photo <ArrowRight />
                            </Link>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="h-12 rounded-full bg-card px-7 text-base">
                            <Link href="/#how-it-works">See how it works</Link>
                        </Button>
                    </div>
                </div>

                {/* Before / after showcase */}
                <div className="relative mx-auto w-full max-w-md lg:max-w-none">
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <figure className="overflow-hidden rounded-2xl border bg-card p-2 shadow-sm">
                            <div className="relative aspect-[4/5] overflow-hidden rounded-xl">
                                <Image src="/img/hero-before.jpg" alt="Original photo" fill priority sizes="(min-width: 1024px) 280px, 45vw" className="object-cover" />
                            </div>
                            <figcaption className="px-1 pt-2 pb-1 text-center text-sm font-medium text-muted-foreground">Original</figcaption>
                        </figure>
                        <figure className="overflow-hidden rounded-2xl border bg-card p-2 shadow-xl shadow-primary/10 ring-2 ring-primary/20">
                            <div className="relative aspect-[4/5] overflow-hidden rounded-xl">
                                <Image src="/img/hero-after.jpg" alt="Ghibli-style result" fill priority sizes="(min-width: 1024px) 280px, 45vw" className="object-cover" />
                            </div>
                            <figcaption className="px-1 pt-2 pb-1 text-center text-sm font-medium text-primary">Ghiblified ✨</figcaption>
                        </figure>
                    </div>
                    <div className="absolute top-1/2 left-1/2 flex size-11 -translate-x-1/2 -translate-y-[60%] items-center justify-center rounded-full border-4 border-background bg-primary text-primary-foreground shadow-lg">
                        <ArrowRight className="size-5" />
                    </div>
                </div>
            </Container>
        </section>
    );
}
