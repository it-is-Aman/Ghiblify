import Link from "next/link";
import Container from "@/components/Container";
import { Logo } from "@/components/Navbar";

const GITHUB_URL = "https://github.com/it-is-Aman/Ghiblify";

export default function Footer() {
    return (
        <footer className="border-t bg-muted/40">
            <Container className="flex flex-col gap-8 py-10 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                    <Logo />
                    <p className="text-sm text-muted-foreground">Turn your photos into Ghibli-style artwork.</p>
                </div>

                <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
                    <Link href="/#how-it-works" className="text-muted-foreground hover:text-foreground">How it works</Link>
                    <Link href="/#features" className="text-muted-foreground hover:text-foreground">Features</Link>
                    <Link href="/convert" className="text-muted-foreground hover:text-foreground">Convert</Link>
                    <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">GitHub</a>
                </nav>
            </Container>
            <Container>
                <p className="border-t py-6 text-sm text-muted-foreground">
                    © {new Date().getFullYear()} Ghiblify. A fan-made project, not affiliated with Studio Ghibli.
                </p>
            </Container>
        </footer>
    );
}
