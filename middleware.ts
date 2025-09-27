import {NextRequest, NextResponse} from "next/server";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";

export default async function middleware(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (session && !session.user.hasCompletedOnboarding) {
        if (request.nextUrl.pathname !== "/get-started") {
            console.log("middleware called")
            return NextResponse.redirect(new URL("/get-started", request.url))
        }
    }
    if (session && session.user.hasCompletedOnboarding) {
        if (request.nextUrl.pathname === "/get-started") {
            const referer = request.headers.get('referer');

            if (referer && referer.startsWith(request.nextUrl.origin)) {
                return NextResponse.redirect(referer);
            }

            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    return NextResponse.next()

}


export const config = {
    matcher: [
        // Only run on app routes, not on static files or API routes
        '/((?!_next/static|_next/image|favicon.ico|api/).*)',
        // Or be more specific with your protected routes:
        // '/dashboard/:path*',
        // '/profile/:path*',
        // '/get-started'
    ]
}