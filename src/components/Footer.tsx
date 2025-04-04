
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="border-t py-12 md:py-16">
            <div className=" px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <Image src="/img/icon.png" alt="Ghiblify" className="w-8 h-8 rounded-full" height={100} width={100} />
                            <span className="font-display text-xl font-bold">Ghiblify</span>
                        </Link>
                        <p className="text-muted-foreground text-sm">
                            Transform your photos into Ghibli-style anime artwork.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-medium mb-4">Product</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/#how-it-works" className="text-muted-foreground hover:text-foreground text-sm">
                                    How It Works
                                </Link>
                            </li>
                            <li>
                                <Link href="/#examples" className="text-muted-foreground hover:text-foreground text-sm">
                                    Examples
                                </Link>
                            </li>
                            <li>
                                <Link href="/#pricing" className="text-muted-foreground hover:text-foreground text-sm">
                                    Pricing
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-medium mb-4">Company</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/#about" className="text-muted-foreground hover:text-foreground text-sm">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/#blog" className="text-muted-foreground hover:text-foreground text-sm">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link href="/#contact" className="text-muted-foreground hover:text-foreground text-sm">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-medium mb-4">Legal</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/#privacy" className="text-muted-foreground hover:text-foreground text-sm">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/#terms" className="text-muted-foreground hover:text-foreground text-sm">
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-muted-foreground text-sm">
                        © {new Date().getFullYear()} Ghiblify. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4 mt-4 md:mt-0">
                        <a href="#" className="text-muted-foreground hover:text-foreground">
                            <span className="sr-only">Twitter</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter">
                                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                            </svg>
                        </a>
                        <a href="#" className="text-muted-foreground hover:text-foreground">
                            <span className="sr-only">Instagram</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram">
                                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;