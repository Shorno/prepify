import { getFeaturedNotes, getPlatformStats, getDepartmentsWithCounts } from "@/actions/home/home-actions";
import { getPublicLeaderboard } from "@/actions/leaderboard/get-leader-board";
import HeroSection from "@/components/home/hero-section";
import FeaturedNotesSection from "@/components/home/featured-notes-section";
import HowItWorksSection from "@/components/home/how-it-works-section";
import LeaderboardPreviewSection from "@/components/home/leaderboard-preview-section";
import DepartmentsSection from "@/components/home/departments-section";
import StatsSection from "@/components/home/stats-section";
import CTASection from "@/components/home/cta-section";

export default async function Home() {
    const [featuredNotes, stats, departments, leaderboard] = await Promise.all([
        getFeaturedNotes(),
        getPlatformStats(),
        getDepartmentsWithCounts(),
        getPublicLeaderboard()
    ]);

    return (
        <div className="flex flex-col w-full overflow-x-hidden">
            <HeroSection />
            <FeaturedNotesSection notes={featuredNotes} />
            <HowItWorksSection />
            <LeaderboardPreviewSection data={leaderboard} />
            <DepartmentsSection departments={departments} />
            <StatsSection stats={stats} />
            <CTASection />
        </div>
    );
}
