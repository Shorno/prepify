import getNoteById from "@/actions/notes/get-note-by-id";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, FileText, BookOpen } from "lucide-react";
import NoteImageGallery from "@/components/note-image-gallery";
import ReferenceLinks from "@/components/reference-links-sidebar";
import { notFound } from "next/navigation";
import NoteEngagement from "@/components/note-engagement";
import CommentsSection from "@/components/comments-section";
import incrementView from "@/actions/notes/increment-view";
import { checkAuth } from "@/app/actions/user/checkAuth";
import FollowButton from "@/components/follow-button";
import getFollowStatus from "@/actions/follow/get-follow-status";
import Link from "next/link";

interface NotePageProps {
    params: Promise<{ id: string }>;
}

export default async function NotePage({ params }: NotePageProps) {
    const { id } = await params;
    const noteId = parseInt(id);

    if (isNaN(noteId)) {
        notFound();
    }

    const result = await getNoteById(noteId);

    if (!result.success) {
        notFound();
    }

    const note = result.data;

    // Get user initials
    const uploaderInitials = note.user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();

    // Format date
    const formattedDate = new Date(note.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Get current user session (optional for public page)
    const session = await checkAuth();

    // Increment view count
    await incrementView(noteId);

    // Check if current user has liked this note
    const isLiked = session?.user ? note.likes.some(like => like.userId === session.user.id) : false;

    // Get follow status for the note author
    const isOwnNote = session?.user?.id === note.user.id;
    let isFollowing = false;
    if (session?.user && !isOwnNote) {
        const followStatusResult = await getFollowStatus(note.user.id);
        isFollowing = followStatusResult.success ? followStatusResult.data.isFollowing : false;
    }

    return (
        <div className="main-container py-8">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
                {/* Main Content */}
                <div className="space-y-6">
                    {/* Note Header */}
                    <div className="space-y-4">
                        {/* Uploader Info */}
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                            <Link href={`/user/${note.user.username || note.user.id}`} className="flex-shrink-0">
                                <Avatar className="h-12 w-12 sm:h-14 sm:w-14 hover:scale-105 transition-transform ring-2 ring-primary/10">
                                    <AvatarImage src={note.user.image || "/placeholder.svg"} alt={note.user.name} />
                                    <AvatarFallback className="text-sm sm:text-base font-semibold bg-primary/10 text-primary">{uploaderInitials}</AvatarFallback>
                                </Avatar>
                            </Link>
                            <div className="flex-1 min-w-0">
                                <Link
                                    href={`/user/${note.user.username || note.user.id}`}
                                    className="font-semibold text-base sm:text-lg text-foreground hover:text-primary transition-colors block truncate"
                                >
                                    {note.user.name}
                                </Link>
                                <p className="text-sm text-muted-foreground truncate">{note.user.batch || 'Student'}</p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                {/* Follow Button */}
                                {session?.user && !isOwnNote && (
                                    <FollowButton
                                        userId={note.user.id}
                                        initialIsFollowing={isFollowing}
                                        size="sm"
                                    />
                                )}
                                <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                                    <CalendarIcon className="w-4 h-4" />
                                    <span>{formattedDate}</span>
                                </div>
                            </div>
                        </div>

                        {/* Date on mobile - separate row */}
                        <div className="sm:hidden flex items-center gap-2 text-sm text-muted-foreground">
                            <CalendarIcon className="w-4 h-4" />
                            <span>{formattedDate}</span>
                        </div>

                        {/* Course and Department Badges */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="default" className="text-xs sm:text-sm px-2.5 sm:px-3 py-1 rounded-full">
                                {note.course.name}
                            </Badge>
                            <Badge variant="secondary" className="text-xs sm:text-sm px-2.5 sm:px-3 py-1 rounded-full">
                                {note.department.departmentCode.toUpperCase()}
                            </Badge>
                            <Badge variant="outline" className="text-xs sm:text-sm px-2.5 sm:px-3 py-1 rounded-full">
                                {note.faculty.name}
                            </Badge>
                        </div>

                        {/* Title */}
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground break-words">
                            {note.title}
                        </h1>

                        {/* Stats */}
                        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                            <div className="flex items-center gap-1.5 sm:gap-2 bg-muted/50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm">
                                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                                <span className="font-semibold">{note.files.length}</span>
                                <span className="text-muted-foreground hidden sm:inline">{note.files.length === 1 ? 'File' : 'Files'}</span>
                            </div>
                            <div className="flex items-center gap-1.5 sm:gap-2 bg-muted/50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm">
                                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                                <span className="font-semibold">{note.resources.length}</span>
                                <span className="text-muted-foreground hidden sm:inline">{note.resources.length === 1 ? 'Reference' : 'References'}</span>
                            </div>
                        </div>

                        {/* Engagement */}
                        <NoteEngagement
                            noteId={note.id}
                            initialLikesCount={note.likes.length}
                            initialIsLiked={isLiked}
                            viewsCount={note.viewsCount + 1}
                            currentUserId={session?.user?.id}
                        />
                    </div>

                    {/* Divider */}
                    <hr className="border-border/40" />

                    {/* Files Gallery */}
                    <div>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-primary" />
                            Files
                        </h2>
                        <NoteImageGallery files={note.files} />
                    </div>

                    {/* Divider */}
                    <hr className="border-border" />

                    {/* Comments Section */}
                    <CommentsSection
                        noteId={note.id}
                        initialComments={note.comments}
                        currentUserId={session?.user?.id}
                    />

                    {/* Reference Links for Mobile (shown below content) */}
                    <div className="lg:hidden">
                        <hr className="border-border mb-6" />
                        <ReferenceLinks resources={note.resources} />
                    </div>
                </div>

                {/* Sidebar - Reference Links (Desktop only) */}
                <aside className="hidden lg:block">
                    <div className="sticky top-20">
                        <ReferenceLinks resources={note.resources} />
                    </div>
                </aside>
            </div>
        </div>
    );
}

