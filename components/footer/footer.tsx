import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t bg-muted/30 mt-auto">
            <div className="container mx-auto px-4 py-8">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Brand */}
                    <div className="space-y-3">
                        <Link href="/" className="font-semibold text-xl">
                            Prepify
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            Share and discover academic notes from students across your university.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-3">
                        <h3 className="font-medium">Quick Links</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href="/notes" className="hover:text-foreground transition-colors">
                                    Browse Notes
                                </Link>
                            </li>
                            <li>
                                <Link href="/leaderboard" className="hover:text-foreground transition-colors">
                                    Leaderboard
                                </Link>
                            </li>
                            <li>
                                <Link href="/my-notes" className="hover:text-foreground transition-colors">
                                    My Notes
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Community */}
                    <div className="space-y-3">
                        <h3 className="font-medium">Community</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link
                                    href="/become-moderator"
                                    className="hover:text-foreground transition-colors inline-flex items-center gap-1"
                                >
                                    <ShieldCheck className="h-3 w-3" />
                                    Become a Moderator
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="space-y-3">
                        <h3 className="font-medium">Legal</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href="#" className="hover:text-foreground transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-foreground transition-colors">
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
                    <p>© {currentYear} Prepify. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
