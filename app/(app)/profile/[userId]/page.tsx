import { getUserProfile } from "@/actions/user/get-user-profile";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, FileText, Calendar, GraduationCap, Building2, Users, Settings, ArrowRight } from "lucide-react";
import FollowButton from "@/components/follow-button";
import getFollowStatus from "@/actions/follow/get-follow-status";
import { checkAuth } from "@/app/actions/user/checkAuth";
import { getStreak } from "@/actions/streaks/get-streak";
import { getUserBadges } from "@/actions/badges/get-user-badges";
import StreakDisplay from "@/components/streak-display";
import BadgeShowcase from "@/components/badge-showcase";

interface ProfilePageProps {
    params: Promise<{ userId: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
    const { userId } = await params;
    const session = await checkAuth();
    const result = await getUserProfile(userId);

    if (!result.success) {
        notFound();
    }

    const { user, stats, department, faculty, notes } = result.data;

    // Get follow status
    const isOwnProfile = session?.user?.id === user.id;
    const followStatusResult = await getFollowStatus(user.id);
    const followStatus = followStatusResult.success ? followStatusResult.data : {
        isFollowing: false,
        followersCount: 0,
        followingCount: 0,
    };

    // Get streak and badges
    const [streakResult, badgesResult] = await Promise.all([
        getStreak(user.id),
        getUserBadges(user.id),
    ]);
    const streak = streakResult.success && streakResult.data
        ? streakResult.data
        : { currentStreak: 0, longestStreak: 0 };
    const badges = badgesResult.success ? badgesResult.data : { earned: [], all: [] };

    // Get user initials
    const userInitials = user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();

    return (
        <div className="main-container my-20">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Profile Header */}
                <Card className="rounded-2xl shadow-warm-lg border border-border/60">
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                            {/* Avatar */}
                            <Avatar className="h-24 w-24 ring-4 ring-border">
                                <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name} />
                                <AvatarFallback
                                    className="text-2xl font-bold bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                                    {userInitials}
                                </AvatarFallback>
                            </Avatar>

                            {/* User Info */}
                            <div className="flex-1 space-y-3">
                                <div>
                                    <h1 className="text-3xl font-bold">{user.name}</h1>
                                    {user.batch && (
                                        <p className="text-muted-foreground mt-1">Batch {user.batch}</p>
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {department && (
                                        <Badge variant="secondary" className="gap-1">
                                            <GraduationCap className="w-3 h-3" />
                                            {department.name}
                                        </Badge>
                                    )}
                                    {faculty && (
                                        <Badge variant="outline" className="gap-1">
                                            <Building2 className="w-3 h-3" />
                                            {faculty.name}
                                        </Badge>
                                    )}
                                </div>

                                {/* Followers/Following Stats */}
                                <div className="flex items-center gap-4 text-sm">
                                    <div className="flex items-center gap-1">
                                        <Users className="w-4 h-4 text-muted-foreground" />
                                        <span className="font-semibold">{followStatus.followersCount}</span>
                                        <span className="text-muted-foreground">Followers</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="font-semibold">{followStatus.followingCount}</span>
                                        <span className="text-muted-foreground">Following</span>
                                    </div>
                                </div>

                                {/* Compact earned badges */}
                                {badges.earned.length > 0 && (
                                    <BadgeShowcase earned={badges.earned} all={badges.all} compact />
                                )}

                                {/* Follow/Edit Buttons */}
                                {session?.user && !isOwnProfile && (
                                    <FollowButton
                                        userId={user.id}
                                        initialIsFollowing={followStatus.isFollowing}
                                    />
                                )}
                                {isOwnProfile && (
                                    <Button asChild variant="outline" className="gap-2 rounded-full">
                                        <Link href="/settings">
                                            <Settings className="w-4 h-4" />
                                            Edit Profile
                                        </Link>
                                    </Button>
                                )}
                            </div>

                            {/* Rank Badge */}
                            {stats && stats.rank <= 3 && (
                                <div className="flex items-center gap-2">
                                    <Trophy className={`w-8 h-8 ${stats.rank === 1 ? 'text-amber-500' :
                                        stats.rank === 2 ? 'text-slate-400' :
                                            'text-amber-700'
                                        }`} />
                                    <div className="text-center">
                                        <div className="text-2xl font-bold">#{stats.rank}</div>
                                        <div className="text-xs text-muted-foreground">Rank</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Statistics */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="rounded-2xl shadow-warm border border-border/60">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Total Points
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{stats.totalPoints}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Rank #{stats.rank}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl shadow-warm border border-border/60">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    Notes Created
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{stats.notesCreated}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Shared with community
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl shadow-warm border border-border/60">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Member Since
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-xl font-bold">
                                    {notes.length > 0
                                        ? new Date(notes[0]?.createdAt).toLocaleDateString('en-US', {
                                            month: 'short',
                                            year: 'numeric'
                                        })
                                        : new Date(user.createdAt).toLocaleDateString('en-US', {
                                            month: 'short',
                                            year: 'numeric'
                                        })
                                    }
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Active contributor
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Streak + Badges Section */}
                <div className="space-y-6">
                    {/* Streak */}
                    <StreakDisplay
                        currentStreak={streak.currentStreak}
                        longestStreak={streak.longestStreak}
                        variant="full"
                    />

                    {/* Full Badge Showcase */}
                    <div className="p-5 rounded-2xl border border-border bg-card">
                        <BadgeShowcase earned={badges.earned} all={badges.all} />
                    </div>
                </div>

                {/* My Notes Link */}
                <div className="flex items-center justify-between p-5 rounded-2xl border border-border bg-card">
                    <div>
                        <h2 className="text-lg font-semibold">My Notes</h2>
                        <p className="text-sm text-muted-foreground">
                            {notes.length} {notes.length === 1 ? 'note' : 'notes'} shared with the community
                        </p>
                    </div>
                    <Button asChild variant="outline" className="gap-2 rounded-full">
                        <Link href="/my-notes">
                            View My Notes
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
