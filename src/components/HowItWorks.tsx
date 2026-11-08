import { Camera, Download, Wand2 } from "lucide-react";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";

const steps = [
    {
        icon: Camera,
        title: "Upload a photo",
        description: "Pick a clear, well-lit photo of a person, pet or place. JPG, PNG and WebP all work.",
    },
    {
        icon: Wand2,
        title: "AI paints it",
        description: "An image model redraws it with soft watercolor skies, warm light and hand-drawn detail.",
    },
    {
        icon: Download,
        title: "Download & share",
        description: "Your Ghibli-style artwork is ready in seconds. Save it in high resolution.",
    },
];

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="border-y bg-muted/60 py-20 md:py-28">
            <Container>
                <SectionHeading
                    eyebrow="How it works"
                    title="Three steps to your own Ghibli scene"
                    description="No editing skills needed. The whole thing takes less time than making tea."
                />

                <ol className="mt-14 grid gap-6 md:grid-cols-3">
                    {steps.map((step, i) => (
                        <li key={step.title} className="relative rounded-2xl border bg-card p-7 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex size-12 items-center justify-center rounded-xl bg-secondary text-primary">
                                    <step.icon className="size-6" />
                                </div>
                                <span className="font-display text-4xl font-semibold text-border">0{i + 1}</span>
                            </div>
                            <h3 className="mt-6 text-lg font-semibold">{step.title}</h3>
                            <p className="mt-2 leading-relaxed text-muted-foreground">{step.description}</p>
                        </li>
                    ))}
                </ol>
            </Container>
        </section>
    );
}
