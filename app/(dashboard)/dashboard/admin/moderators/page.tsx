import { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getPendingApplications, getCurrentModerators } from "@/actions/moderator/moderator-application-actions";
import { PendingApplications } from "./_components/pending-applications";
import { CurrentModerators } from "./_components/current-moderators";
import { Badge } from "@/components/ui/badge";
import { PendingApplicationsSkeleton, CurrentModeratorsSkeleton } from "./_components/skeletons";

async function PendingApplicationsWrapper() {
    const pendingApplications = await getPendingApplications();
    return <PendingApplications applications={pendingApplications} />;
}

async function CurrentModeratorsWrapper() {
    const currentModerators = await getCurrentModerators();
    return <CurrentModerators moderators={currentModerators} />;
}

async function PendingCountBadge() {
    const pendingApplications = await getPendingApplications();
    if (pendingApplications.length === 0) return null;
    return (
        <Badge
            variant="destructive"
            className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
        >
            {pendingApplications.length}
        </Badge>
    );
}

async function ModeratorsCountBadge() {
    const currentModerators = await getCurrentModerators();
    return (
        <Badge variant="secondary" className="ml-2">
            {currentModerators.length}
        </Badge>
    );
}

export default function ModeratorsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Moderators</h1>
                <p className="text-muted-foreground">
                    Manage moderator applications and current moderators
                </p>
            </div>

            <Tabs defaultValue="pending" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="pending" className="relative">
                        Pending Applications
                        <Suspense fallback={null}>
                            <PendingCountBadge />
                        </Suspense>
                    </TabsTrigger>
                    <TabsTrigger value="current">
                        Current Moderators
                        <Suspense fallback={<Badge variant="secondary" className="ml-2">...</Badge>}>
                            <ModeratorsCountBadge />
                        </Suspense>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="pending">
                    <Suspense fallback={<PendingApplicationsSkeleton />}>
                        <PendingApplicationsWrapper />
                    </Suspense>
                </TabsContent>

                <TabsContent value="current">
                    <Suspense fallback={<CurrentModeratorsSkeleton />}>
                        <CurrentModeratorsWrapper />
                    </Suspense>
                </TabsContent>
            </Tabs>
        </div>
    );
}