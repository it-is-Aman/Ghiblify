
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";

export default function Home() {

  return (
    <div className="flex flex-col">
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <Features />
      </main>
    </div>
  );
}
