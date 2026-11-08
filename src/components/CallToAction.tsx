import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Container from "@/components/Container";

export default function CallToAction() {
    return (
        <section className="pb-20 md:pb-28">
            <Container>
                <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-14 text-center text-primary-foreground sm:px-12">
                    <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-sun/25 blur-3xl" />
                    <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-24 size-72 rounded-full bg-sky/30 blur-3xl" />
                    <h2 className="relative font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                        Ready to step into a Ghibli world?
                    </h2>
                    <p className="relative mx-auto mt-4 max-w-xl text-lg text-primary-foreground/80">
                        Your first conversion is a few clicks away, and it&apos;s free.
                    </p>
                    <Button asChild size="lg" variant="secondary" className="relative mt-8 h-12 rounded-full px-7 text-base">
                        <Link href="/convert">
                            Start converting <ArrowRight />
                        </Link>
                    </Button>
                </div>
            </Container>
        </section>
    );
}
