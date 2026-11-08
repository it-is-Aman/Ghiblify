import { Gift, ShieldCheck, Sparkles, Zap } from "lucide-react";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";

const features = [
    {
        icon: Sparkles,
        title: "Ghibli-inspired look",
        description: "Painterly backgrounds, gentle lighting and soft character shading that keeps your pose and composition.",
    },
    {
        icon: ShieldCheck,
        title: "Private by design",
        description: "Photos are processed on the fly and never stored, by us or the AI provider.",
    },
    {
        icon: Zap,
        title: "Ready in seconds",
        description: "A fast, distilled image model means no queues and no waiting minutes for a result.",
    },
    {
        icon: Gift,
        title: "Free every day",
        description: "Sign in and get 10 conversions daily. No credit card, no subscription.",
    },
];

export default function Features() {
    return (
        <section id="features" className="py-20 md:py-28">
            <Container>
                <SectionHeading eyebrow="Features" title="Everything you need, nothing you don't" />

                <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature) => (
                        <div key={feature.title} className="rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                            <div className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                                <feature.icon className="size-5" />
                            </div>
                            <h3 className="mt-5 font-semibold">{feature.title}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}
