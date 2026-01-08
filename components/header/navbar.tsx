"use client"
import UserProfile from "@/components/header/user-profile";
import NotificationDropdown from "@/components/notifications/notification-dropdown";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { MenuIcon, X } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose
} from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

const navLinks = [
    { name: "Notes", href: "/notes" },
    { name: "My Notes", href: "/my-notes" },
    { name: "Leaderboard", href: "/leaderboard" },
]

export default function Navbar() {
    const { data } = authClient.useSession();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
                scrolled
                    ? "bg-background/80 backdrop-blur-md border-border shadow-sm py-3"
                    : "bg-transparent border-transparent py-5"
            )}
        >
            <div className="container mx-auto px-4 xl:px-0">
                <nav className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-serif font-bold text-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-warm-sm">
                            P
                        </div>
                        <span className="font-bold text-xl tracking-tight group-hover:text-primary transition-colors">Prepify</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "relative px-4 py-2 text-sm font-medium transition-colors rounded-full hover:text-primary",
                                        isActive ? "text-primary" : "text-muted-foreground"
                                    )}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="navbar-indicator"
                                            className="absolute inset-0 bg-primary/10 rounded-full"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className="relative z-10">{link.name}</span>
                                </Link>
                            )
                        })}
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-3">
                        {data?.user ? (
                            <>
                                <NotificationDropdown />
                                <UserProfile user={data.user} />
                            </>
                        ) : (
                            <div className="hidden sm:flex items-center gap-3">
                                <Button asChild variant="ghost" className="rounded-full font-medium px-5 hover:bg-primary/5">
                                    <Link href="/login">Log in</Link>
                                </Button>
                                <Button asChild className="rounded-full px-6 font-semibold shadow-warm hover:shadow-warm-lg hover:-translate-y-0.5 transition-all duration-200">
                                    <Link href="/sign-up">Sign up</Link>
                                </Button>
                            </div>
                        )}

                        {/* Mobile Menu Trigger */}
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="md:hidden rounded-full"
                                >
                                    <MenuIcon className="h-5 w-5" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] border-l border-border/50 sm:w-[400px]">
                                <SheetHeader className="text-left pb-6 border-b border-border/50">
                                    <SheetTitle>
                                        <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-serif font-bold text-lg">
                                                P
                                            </div>
                                            <span className="font-bold text-xl">Prepify</span>
                                        </Link>
                                    </SheetTitle>
                                </SheetHeader>

                                <div className="flex flex-col gap-6 mt-8">
                                    <div className="flex flex-col gap-2">
                                        {navLinks.map((link) => {
                                            const isActive = pathname === link.href;
                                            return (
                                                <SheetClose asChild key={link.href}>
                                                    <Link
                                                        href={link.href}
                                                        className={cn(
                                                            "px-4 py-3 rounded-lg text-base transition-colors",
                                                            isActive
                                                                ? "bg-primary/10 text-primary font-medium"
                                                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                                        )}
                                                        onClick={() => setIsOpen(false)}
                                                    >
                                                        {link.name}
                                                    </Link>
                                                </SheetClose>
                                            )
                                        })}
                                    </div>

                                    {!data?.user && (
                                        <div className="flex flex-col gap-3 pt-6 border-t border-border/50">
                                            <SheetClose asChild>
                                                <Button asChild variant="outline" className="w-full rounded-full h-11">
                                                    <Link href="/login">Log in</Link>
                                                </Button>
                                            </SheetClose>
                                            <SheetClose asChild>
                                                <Button asChild className="w-full rounded-full h-11 shadow-none">
                                                    <Link href="/sign-up">Sign up</Link>
                                                </Button>
                                            </SheetClose>
                                        </div>
                                    )}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </nav>
            </div>
        </header>
    )
}
