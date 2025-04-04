import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import Image from "next/image";

const Navbar = () => {

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className=" flex h-16 items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2">
                        <Image src="/img/icon.png" alt="Ghiblify" className="w-8 h-8 rounded-full" height={100} width={100} />
                        <span className="font-display text-2xl font-bold">Ghiblify</span>
                    </Link>
                </div>
                <nav className="hidden md:flex items-center gap-6">
                    <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
                        Home
                    </Link>
                    <Link href="/#how-it-works" className="text-sm font-medium transition-colors hover:text-primary">
                        How It Works
                    </Link>
                    <Link href="/#pricing" className="text-sm font-medium transition-colors hover:text-primary">
                        Pricing
                    </Link>
                    <Link href="/convert" className="text-sm font-medium transition-colors hover:text-primary">
                        Convert
                    </Link>
                </nav>
                <div className="flex items-center gap-2">
                    <SignedOut>
                        <SignInButton mode="modal">
                            <Button>Sign In</Button>
                        </SignInButton >
                        <SignUpButton mode="modal">
                            <Button>Sign Up</Button>
                        </SignUpButton >
                    </SignedOut>
                    <SignedIn>
                        <Button asChild>
                            <Link href="/convert">
                                Start Converting
                            </Link>
                        </Button>
                        <UserButton />
                    </SignedIn>
                </div>
            </div>
        </header>
    );
};

export default Navbar;