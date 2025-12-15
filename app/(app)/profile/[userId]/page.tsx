import { getUserProfile } from "@/actions/user/get-user-profile";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, FileText, Calendar, GraduationCap, Building2 } from "lucide-react";
import NoteCard from "@/components/note-card";
import { Suspense } from "react";
import ProfileSkeleton from "./loading";

interface ProfilePageProps {
    params: Promise<{ userId: string }>;
}

async function ProfileContent({ userId }: { userId: string }) {
    const result = await getUserProfile(userId);

    if (!result.success) {
        notFound();
    }

    const { user, stats, department, faculty, notes } = result.data;

    // Get user initials
    const userInitials = user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Profile Header */}
            <Card>
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
                    <Card>
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

                    <Card>
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

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Member Since
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-bold">
                                {new Date(notes[0]?.createdAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    year: 'numeric'
                                })}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Active contributor
                            </p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Notes Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Notes</h2>
                    <Badge variant="secondary" className="text-sm">
                        {notes.length} {notes.length === 1 ? 'note' : 'notes'}
                    </Badge>
                </div>

                {notes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {notes.map((note) => (
                            <NoteCard key={note.id} data={note} />
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">
                                This user hasn&#39;t shared any notes yet.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}

export default async function ProfilePage({ params }: ProfilePageProps) {
    const { userId } = await params;

    return (
        <div className="main-container py-8">
            <Suspense fallback={<ProfileSkeleton />}>
                <ProfileContent userId={userId} />
            </Suspense>
        </div>
    );
}
