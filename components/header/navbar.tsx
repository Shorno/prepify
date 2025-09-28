"use client"
import UserProfile from "@/components/header/user-profile";
import {authClient} from "@/lib/auth-client";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {usePathname} from "next/navigation";

const navLinks = [
    {name: "Notes", href: "/notes"},
    {name: "My Notes", href: "/my-notes"},
]

export default function Navbar() {
    const {data} = authClient.useSession();
    const pathname = usePathname();

    return (
        <div className={"px-4 xl:px-0"}>
            <div className={"h-16 border container mx-auto my-4 rounded-lg px-4 shadow-xs dark:shadow-none backdrop-blur-sm"}>
                <div className={"container mx-auto h-full px-4 xl:px-0"}>
                    <div className={"grid grid-cols-2 md:grid-cols-3 items-center h-full"}>
                        {/* Left side */}
                        <div className={"justify-self-start"}>
                            <Link href={"/"} className={"font-semibold text-2xl"}>Perpify</Link>
                        </div>

                        {/* Center navigation - only visible on md+ screens */}
                        <div className={"hidden md:flex gap-4 justify-self-center"}>
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link key={link.href} href={link.href} className={`hover:underline ${isActive ? "underline font-medium" : "font-normal"}`}>
                                        {link.name}
                                    </Link>
                                )
                            })}
                        </div>

                        {/* Right side - spans to the end on mobile, normal position on md+ */}
                        <div className={"flex gap-2 justify-center items-center justify-self-end md:justify-self-end col-start-2 md:col-start-3"}>
                            {data?.user ? (
                                <UserProfile user={data.user}/>
                            ) : (
                                <div className={"flex gap-2"}>
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