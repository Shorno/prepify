import {LoginForm} from "@/components/login-form";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <Link href="/" className="flex items-center gap-2 self-center text-2xl font-medium">
                        <Image src={"/icons/prepify.svg"} alt={"prepify logo"} width={48} height={48}/>
                    Prepify
                </Link>
                <LoginForm/>
            </div>
        </div>
    )
}