import { getUserProfile } from "@/actions/user/get-user-profile";
import getUserByUsername from "@/actions/user/get-user-by-username";
import getUserPublicNotes from "@/actions/user/get-user-public-notes";
import getFollowStatus from "@/actions/follow/get-follow-status";
import { checkAuth } from "@/app/actions/user/checkAuth";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Users, Trophy, GraduationCap, Building2 } from "lucide-react";
import FollowButton from "@/components/follow-button";
import Link from "next/link";
import Image from "next/image";
import { getStreak } from "@/actions/streaks/get-streak";
import { getUserBadges } from "@/actions/badges/get-user-badges";
import StreakDisplay from "@/components/streak-display";
import BadgeShowcase from "@/components/badge-showcase";

interface UserProfilePageProps {
    params: Promise<{ username: string }>;
}

export default async function UserProfilePage({ params }: UserProfilePageProps) {
    const { username } = await params;
    const session = await checkAuth();

    // Resolve username to userId
    const userResult = await getUserByUsername(username);
    if (!userResult.success) {
        notFound();
    }

    const userId = userResult.data.user.id;

    // Get full profile data
    const profileResult = await getUserProfile(userId);
    if (!profileResult.success) {
        notFound();
    }

    const { user, stats, department, faculty } = profileResult.data;

    // Get follow status
    const followStatusResult = await getFollowStatus(user.id);
    const followStatus = followStatusResult.success ? followStatusResult.data : {
        isFollowing: false,
        followersCount: 0,
        followingCount: 0,
    };

    // Get user's public notes
    const notesResult = await getUserPublicNotes(user.id);
    const notes = notesResult.success ? notesResult.data : [];

    // Get streak and badges
    const [streakResult, badgesResult] = await Promise.all([
        getStreak(user.id),
        getUserBadges(user.id),
    ]);
    const streak = streakResult.success && streakResult.data
        ? streakResult.data
        : { currentStreak: 0, longestStreak: 0 };
    const badges = badgesResult.success ? badgesResult.data : { earned: [], all: [] };

    const isOwnProfile = session?.user?.id === user.id;

    const userInitials = user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();

    return (
        <div className="main-container py-8 space-y-8">
                {/* Compact Profile Header */}
                <Card className="rounded-2xl shadow-warm-lg border border-border/60">
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                            {/* Avatar */}
                            <Avatar className="h-20 w-20 ring-4 ring-border">
                                <AvatarImage src={user.image || undefined} alt={user.name} />
                                <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                                    {userInitials}
                                </AvatarFallback>
                            </Avatar>

                            {/* User Info */}
                            <div className="flex-1 space-y-2.5">
                                <div className="flex items-center gap-3 flex-wrap">
                                    <h1 className="text-2xl font-bold">{user.name}</h1>
                                    {/* Streak (compact) */}
                                    {streak.currentStreak > 0 && (
                                        <StreakDisplay
                                            currentStreak={streak.currentStreak}
                                            longestStreak={streak.longestStreak}
                                            variant="compact"
                                        />
                                    )}
                                    {/* Rank badge for top 3 */}
                                    {stats && stats.rank <= 3 && (
                                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
                                            <Trophy className={`w-3.5 h-3.5 ${stats.rank === 1 ? 'text-amber-500' :
                                                stats.rank === 2 ? 'text-slate-400' : 'text-amber-700'
                                                }`} />
                                            <span className="text-xs font-bold">#{stats.rank}</span>
                                        </div>
                                    )}
                                </div>

                                {user.batch && (
                                    <p className="text-sm text-muted-foreground">Batch {user.batch}</p>
                                )}

                                <div className="flex flex-wrap gap-2">
                                    {department && (
                                        <Badge variant="secondary" className="gap-1 text-xs">
                                            <GraduationCap className="w-3 h-3" />
                                            {department.name}
                                        </Badge>
                                    )}
                                    {faculty && (
                                        <Badge variant="outline" className="gap-1 text-xs">
                                            <Building2 className="w-3 h-3" />
                                            {faculty.name}
                                        </Badge>
                                    )}
                                </div>

                                {/* Inline stats */}
                                <div className="flex items-center gap-5 text-sm">
                                    {stats && (
                                        <div className="flex items-center gap-1.5">
                                            <span className="font-bold">{stats.totalPoints}</span>
                                            <span className="text-muted-foreground">Points</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1.5">
                                        <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                                        <span className="font-bold">{notes.length}</span>
                                        <span className="text-muted-foreground">Notes</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Users className="h-3.5 w-3.5 text-muted-foreground" />
                                        <span className="font-bold">{followStatus.followersCount}</span>
                                        <span className="text-muted-foreground">Followers</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="font-bold">{followStatus.followingCount}</span>
                                        <span className="text-muted-foreground">Following</span>
                                    </div>
                                </div>

                                {/* Earned badges (compact emojis) */}
                                {badges.earned.length > 0 && (
                                    <BadgeShowcase earned={badges.earned} all={badges.all} compact />
                                )}

                                {!isOwnProfile && session?.user && (
                                    <FollowButton
                                        userId={user.id}
                                        initialIsFollowing={followStatus.isFollowing}
                                    />
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Notes Section — Main Focus */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">Notes</h2>
                        <Badge variant="secondary" className="text-sm">
                            {notes.length} {notes.length === 1 ? 'note' : 'notes'}
                        </Badge>
                    </div>
                    {notes.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            No notes yet
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {notes.map((note) => (
                                <Link key={note.id} href={`/notes/${note.id}`}>
                                    <Card className="p-4 h-full hover:bg-accent/50 transition-colors rounded-2xl">
                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                            <Badge variant="default" className="text-xs">
                                                {note.course.name}
                                            </Badge>
                                            <Badge variant="secondary" className="text-xs">
                                                {note.department.departmentCode.toUpperCase()}
                                            </Badge>
                                        </div>
                                        <h3 className="font-medium line-clamp-2 mb-2">{note.title}</h3>
                                        {note.files.length > 0 && (
                                            <div className="flex gap-1 overflow-hidden">
                                                {note.files.slice(0, 3).map((file, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="w-16 h-16 rounded border border-border overflow-hidden flex-shrink-0"
                                                    >
                                                        <Image
                                                            src={file.url}
                                                            alt=""
                                                            width={64}
                                                            height={64}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                ))}
                                                {note.files.length > 3 && (
                                                    <div className="w-16 h-16 rounded border border-border flex items-center justify-center text-xs text-muted-foreground flex-shrink-0">
                                                        +{note.files.length - 3}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
        </div>
    );
}
