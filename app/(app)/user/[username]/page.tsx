import getUserByUsername from "@/actions/user/get-user-by-username";
import getUserPublicNotes from "@/actions/user/get-user-public-notes";
import getFollowStatus from "@/actions/follow/get-follow-status";
import { checkAuth } from "@/app/actions/user/checkAuth";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { FileText, Users } from "lucide-react";
import FollowButton from "@/components/follow-button";
import Link from "next/link";
import Image from "next/image";

interface UserProfilePageProps {
    params: Promise<{ username: string }>;
}

export default async function UserProfilePage({ params }: UserProfilePageProps) {
    const { username } = await params;
    const session = await checkAuth();

    const userResult = await getUserByUsername(username);

    if (!userResult.success) {
        notFound();
    }

    const { user, notesCount } = userResult.data;

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

    const isOwnProfile = session?.user?.id === user.id;

    const userInitials = user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();

    return (
        <div className="main-container py-8">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
                <Avatar className="h-24 w-24 md:h-32 md:w-32">
                    <AvatarImage src={user.image || undefined} alt={user.name} />
                    <AvatarFallback className="text-2xl md:text-3xl font-semibold">
                        {userInitials}
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1 text-center md:text-left space-y-3">
                    <div className="space-y-1">
                        <h1 className="text-2xl md:text-3xl font-bold">{user.name}</h1>
                        {user.username && (
                            <p className="text-muted-foreground">@{user.username}</p>
                        )}
                    </div>

                    {user.batch && (
                        <Badge variant="secondary" className="text-sm">
                            {user.batch}
                        </Badge>
                    )}

                    <div className="flex items-center justify-center md:justify-start gap-6 text-sm">
                        <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{notesCount}</span>
                            <span className="text-muted-foreground">Notes</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{followStatus.followersCount}</span>
                            <span className="text-muted-foreground">Followers</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-medium">{followStatus.followingCount}</span>
                            <span className="text-muted-foreground">Following</span>
                        </div>
                    </div>

                    {!isOwnProfile && session?.user && (
                        <FollowButton
                            userId={user.id}
                            initialIsFollowing={followStatus.isFollowing}
                        />
                    )}
                </div>
            </div>

            {/* Notes Section */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Notes</h2>
                {notes.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        No notes yet
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {notes.map((note) => (
                            <Link key={note.id} href={`/notes/${note.id}`}>
                                <Card className="p-4 h-full hover:bg-accent/50 transition-colors">
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
