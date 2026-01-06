import { getMyApplication } from "@/actions/moderator/moderator-application-actions";
import { requireAuth } from "@/actions/auth/checkAuth";
import { redirect } from "next/navigation";
import { ModeratorApplicationForm } from "./_components/moderator-application-form";

export default async function BecomeModeratorPage() {
    const session = await requireAuth();

    // Redirect if already a moderator or admin
    if (session.user.role === "moderator" || session.user.role === "admin") {
        redirect("/");
    }

    const existingApplication = await getMyApplication();

    return (
        <div className="container mx-auto py-24 px-4 max-w-3xl">
            <ModeratorApplicationForm existingApplication={existingApplication} />
        </div>
    );
}
