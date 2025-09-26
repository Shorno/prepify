"use client"
import UserProfile from "@/components/header/user-profile";
import {authClient} from "@/lib/auth-client";
import Link from "next/link";
import {ModeToggle} from "@/components/header/mode-toggle";
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
            <div className={"h-16 border container  mx-auto my-4 rounded-lg px-4 shadow-xs dark:shadow-none  backdrop-blur-sm"}>
                <div className={"container mx-auto flex justify-between items-center h-full px-4 xl:px-0"}>
                    <div>
                        <Link href={"/"} className={"font-semibold text-2xl"}>Perpify</Link>
                    </div>
                    <div className={"hidden md:flex gap-4"}>
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link key={link.href} href={link.href} className={`hover:underline ${isActive ? "underline font-medium" : "font-normal"}`}>
                                    {link.name}
                                </Link>
                            )
                        })}
                    </div>
                    <div className={"flex gap-2 justify-center items-center"}>
                        <ModeToggle/>
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
    )
}
