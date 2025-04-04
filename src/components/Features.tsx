
import { Sparkles, ShieldCheck, Zap, Clock } from 'lucide-react';

const Features = () => {
    return (
        <section id='features' className="py-20">
            <div className=" px-4 md:px-6">
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                        Features
                    </div>
                    <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                        Everything You Need for Perfect Ghibli-Style Art
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
                    <div className="flex flex-col items-center text-center p-6 rounded-xl border bg-card">
                        <div className="p-2 rounded-full bg-primary/10 mb-4">
                            <Sparkles className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold">Studio Ghibli Quality</h3>
                        <p className="text-muted-foreground mt-2">
                            Our AI has been trained on the iconic Ghibli art style to create stunning likenesses.
                        </p>
                    </div>
                    <div className="flex flex-col items-center text-center p-6 rounded-xl border bg-card">
                        <div className="p-2 rounded-full bg-primary/10 mb-4">
                            <ShieldCheck className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold">100% Private</h3>
                        <p className="text-muted-foreground mt-2">
                            Your photos are processed securely and never shared with third parties.
                        </p>
                    </div>
                    <div className="flex flex-col items-center text-center p-6 rounded-xl border bg-card">
                        <div className="p-2 rounded-full bg-primary/10 mb-4">
                            <Zap className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold">High Resolution</h3>
                        <p className="text-muted-foreground mt-2">
                            Get high-quality images perfect for social media, profiles, and personal use.
                        </p>
                    </div>
                    <div className="flex flex-col items-center text-center p-6 rounded-xl border bg-card">
                        <div className="p-2 rounded-full bg-primary/10 mb-4">
                            <Clock className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold">Fast Turnaround</h3>
                        <p className="text-muted-foreground mt-2">
                            From upload to finished artwork in under a minute - no waiting for days.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;
