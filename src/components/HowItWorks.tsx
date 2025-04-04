
import { Camera, Palette, Download } from 'lucide-react';

const HowItWorks = () => {
  return (
    <section id='how-it-works' className="py-20 bg-muted/50">
      <div className="px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
            Simple Process
          </div>
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
            How It Works
          </h2>
          <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Our platform transforms your selfies into Ghibli-inspired artwork in just
            three simple steps.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="flex flex-col items-center text-center p-6 rounded-xl glass-card">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white">
                1
              </div>
            </div>
            <div className="flex justify-center my-4">
              <Camera className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Upload Your Photos</h3>
            <p className="text-muted-foreground mt-2">
              Upload high-quality selfie.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-xl glass-card">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white">
                2
              </div>
            </div>
            <div className="flex justify-center my-4">
              <Palette className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Our AI Gets to Work</h3>
            <p className="text-muted-foreground mt-2">
              The AI magic takes ~2 minutes.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-xl glass-card">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white">
                3
              </div>
            </div>
            <div className="flex justify-center my-4">
              <Download className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Get Amazing Anime Art</h3>
            <p className="text-muted-foreground mt-2">
              Once your picture is ready, we &apos; ll give you amazing Ghibli-style artwork!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
