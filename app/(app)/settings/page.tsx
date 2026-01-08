import { Suspense } from "react";
import { Settings } from "lucide-react";
import SettingsFormWrapper from "./_components/settings-form-wrapper";
import SettingsFormSkeleton from "./_components/settings-form-skeleton";

export default function SettingsPage() {
    return (
        <div className="main-container my-20">
            {/* Header Section - Static, renders immediately */}
            <div className="mb-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-warm-lg">
                    <Settings className="w-8 h-8 text-primary-foreground" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground mt-2">Manage your account and preferences</p>
            </div>

            {/* Form - Async, wrapped in Suspense */}
            <Suspense fallback={<SettingsFormSkeleton />}>
                <SettingsFormWrapper />
            </Suspense>
        </div>
    );
}
