import { getCurrentUserSettings } from "@/actions/user/update-user-settings";
import { redirect } from "next/navigation";
import SettingsForm from "./settings-form";
import { checkAuth } from "@/app/actions/user/checkAuth";

export default async function SettingsFormWrapper() {
    const session = await checkAuth();

    if (!session?.user) {
        redirect("/login");
    }

    const userResult = await getCurrentUserSettings();

    if (!userResult.success || !userResult.data) {
        redirect("/login");
    }

    return <SettingsForm user={userResult.data} />;
}
