import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Container from "@/components/Container";

const links = [
    { href: "/#how-it-works", label: "How it works" },
    { href: "/#features", label: "Features" },
    { href: "/convert", label: "Convert" },
];

export function Logo() {
    return (
        <Link href="/" className="flex items-center gap-2.5">
            <Image src="/img/logo.png" alt="" width={36} height={36} className="size-9 rounded-full ring-2 ring-white shadow-sm" />
            <span className="font-display text-xl font-semibold tracking-tight">Ghiblify</span>
        </Link>
    );
}

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-md">
            <Container className="flex h-16 items-center justify-between gap-4">
                <Logo />

                <nav className="hidden items-center gap-8 md:flex">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    <SignedOut>
                        <SignInButton mode="modal">
                            <Button variant="ghost" size="sm">Sign in</Button>
                        </SignInButton>
                        <SignUpButton mode="modal">
                            <Button size="sm" className="rounded-full px-4">Get started</Button>
                        </SignUpButton>
                    </SignedOut>
                    <SignedIn>
                        <Button asChild size="sm" className="rounded-full px-4">
                            <Link href="/convert">Convert a photo</Link>
                        </Button>
                        <UserButton />
                    </SignedIn>
                </div>
            </Container>
        </header>
    );
}
