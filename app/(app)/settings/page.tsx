import { Settings } from "lucide-react";
import { getCurrentUserSettings } from "@/actions/user/update-user-settings";
import { redirect } from "next/navigation";
import SettingsForm from "./_components/settings-form";
import { getFacultiesWithDepartments } from "@/actions/university-info";
import { checkAuth } from "@/app/actions/user/checkAuth";

export default async function SettingsPage() {
    const session = await checkAuth();

    if (!session?.user) {
        redirect("/login");
    }

    const [userResult, facultiesData] = await Promise.all([
        getCurrentUserSettings(),
        getFacultiesWithDepartments(),
    ]);

    if (!userResult.success || !userResult.data) {
        redirect("/login");
    }

    return (
        <div className="main-container my-20">
            {/* Header Section */}
            <div className="mb-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-warm-lg">
                    <Settings className="w-8 h-8 text-primary-foreground" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground mt-2">Manage your account and preferences</p>
            </div>

            <SettingsForm
                user={userResult.data}
                faculties={facultiesData || []}
            />
        </div>
    );
}
