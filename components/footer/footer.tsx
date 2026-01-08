import Link from "next/link";
import { ShieldCheck, Heart } from "lucide-react";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t bg-muted/20 mt-auto relative overflow-hidden">
            {/* Decorative pattern */}
            <div className="absolute inset-0 pattern-dots-sm opacity-30 pointer-events-none" />

            <div className="container mx-auto px-4 py-12 relative">
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="inline-flex items-center gap-2.5 group">
                            <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-serif font-bold text-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                P
                            </div>
                            <span className="font-bold text-xl group-hover:text-primary transition-colors">Prepify</span>
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Share and discover academic notes from students across your university.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-foreground">Quick Links</h3>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link href="/notes" className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group">
                                    <span className="group-hover:translate-x-1 transition-transform">Browse Notes</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/leaderboard" className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group">
                                    <span className="group-hover:translate-x-1 transition-transform">Leaderboard</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/my-notes" className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group">
                                    <span className="group-hover:translate-x-1 transition-transform">My Notes</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Community */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-foreground">Community</h3>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link
                                    href="/become-moderator"
                                    className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 group"
                                >
                                    <ShieldCheck className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                    <span className="group-hover:translate-x-1 transition-transform">Become a Moderator</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-foreground">Legal</h3>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors group">
                                    <span className="group-hover:translate-x-1 transition-transform inline-block">Privacy Policy</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors group">
                                    <span className="group-hover:translate-x-1 transition-transform inline-block">Terms of Service</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-border/40 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                    <p>© {currentYear} Prepify. All rights reserved.</p>
                    <p className="inline-flex items-center gap-1.5">
                        Made with <Heart className="h-3.5 w-3.5 text-primary fill-primary animate-pulse-soft" /> for students
                    </p>
                </div>
            </div>
        </footer>
    );
}
