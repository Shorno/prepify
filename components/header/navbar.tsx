"use client"
import UserProfile from "@/components/header/user-profile";
import {authClient} from "@/lib/auth-client";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {usePathname} from "next/navigation";
import {MenuIcon} from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose
} from "@/components/ui/sheet";
import {useState} from "react";

const navLinks = [
    {name: "Notes", href: "/notes"},
    {name: "My Notes", href: "/my-notes"},
]

export default function Navbar() {
    const {data} = authClient.useSession();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={"px-4 xl:px-0"}>
            <div
                className={"h-16 border container mx-auto my-4 rounded-lg md:px-8 shadow-xs dark:shadow-none backdrop-blur-sm"}>
                <div className={"container mx-auto h-full px-4 xl:px-0"}>
                    <div className={"grid grid-cols-2 md:grid-cols-3 items-center h-full"}>
                        {/* Left side */}
                        <div className={"justify-self-start flex items-center"}>
                            {/* Mobile Sheet Menu */}
                            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                                <SheetTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="block sm:hidden"
                                    >
                                        <MenuIcon className="h-6 w-6" />
                                        <span className="sr-only">Toggle navigation menu</span>
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-72">
                                    <SheetHeader>
                                        <SheetTitle className="text-left">
                                            <Link href="/" className="font-semibold text-2xl">
                                                Perpify
                                            </Link>
                                        </SheetTitle>
                                    </SheetHeader>

                                    <div className="flex flex-col gap-4 mt-6">
                                        {/* Navigation Links */}
                                        <div className="flex flex-col gap-2 px-2">
                                            {navLinks.map((link) => {
                                                const isActive = pathname === link.href;
                                                return (
                                                    <SheetClose asChild key={link.href}>
                                                        <Link
                                                            href={link.href}
                                                            className={`px-4 py-2 rounded-sm text-left hover:bg-accent transition-colors ${
                                                                isActive ? "bg-accent font-medium" : "font-normal"
                                                            }`}
                                                            onClick={() => setIsOpen(false)}
                                                        >
                                                            {link.name}
                                                        </Link>
                                                    </SheetClose>
                                                )
                                            })}
                                        </div>

                                        {/* Auth Buttons - only show when not logged in */}
                                        {!data?.user && (
                                            <div className="flex flex-col gap-2 pt-4 border-t px-2">
                                                <SheetClose asChild>
                                                    <Button asChild variant="outline" className={"rounded-sm"}>
                                                        <Link href="/login">Log in</Link>
                                                    </Button>
                                                </SheetClose>
                                                <SheetClose asChild>
                                                    <Button asChild className={"rounded-sm"}>
                                                        <Link href="/sign-up">Sign up</Link>
                                                    </Button>
                                                </SheetClose>
                                            </div>
                                        )}
                                    </div>
                                </SheetContent>
                            </Sheet>

                            <Link href={"/"} className={"font-semibold text-2xl"}>Perpify</Link>
                        </div>

                        {/* Center navigation - only visible on md+ screens */}
                        <div className={"hidden md:flex gap-4 justify-self-center"}>
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link key={link.href} href={link.href}
                                          className={`hover:underline ${isActive ? "underline font-medium" : "font-normal"}`}>
                                        {link.name}
                                    </Link>
                                )
                            })}
                        </div>

                        {/* Right side - shows user profile on mobile when logged in, auth buttons on desktop */}
                        <div
                            className={"flex gap-2 justify-center items-center justify-self-end md:justify-self-end col-start-2 md:col-start-3"}>
                            {data?.user ? (
                                // Show user profile on both mobile and desktop when logged in
                                <UserProfile user={data.user}/>
                            ) : (
                                // Show auth buttons only on desktop when not logged in
                                <div className={"hidden sm:flex gap-2"}>
                                    <Button asChild variant={"outline"} className={""}>
                                        <Link href={"/login"}>Log in</Link>
                                    </Button>
                                    <Button asChild>
                                        <Link href={"/sign-up"}>Sign up</Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
