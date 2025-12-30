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

    return (
        <div className="main-container py-8">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
                {/* Main Content */}
                <div className="space-y-6">
                    {/* Note Header */}
                    <div className="space-y-4">
                        {/* Uploader Info */}
                        <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={note.user.image || "/placeholder.svg"} alt={note.user.name} />
                                <AvatarFallback className="text-sm font-semibold">{uploaderInitials}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <p className="font-semibold text-foreground">{note.user.name}</p>
                                <p className="text-sm text-muted-foreground">{note.user.batch || 'Student'}</p>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <CalendarIcon className="w-4 h-4" />
                                <span>{formattedDate}</span>
                            </div>
                        </div>

                        {/* Course and Department Badges */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="default" className="text-sm">
                                {note.course.name}
                            </Badge>
                            <Badge variant="secondary" className="text-sm">
                                {note.department.departmentCode.toUpperCase()}
                            </Badge>
                            <Badge variant="outline" className="text-sm">
                                {note.faculty.name}
                            </Badge>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl font-bold text-foreground">
                            {note.title}
                        </h1>

                        {/* Stats */}
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                <span className="font-medium">{note.files.length} {note.files.length === 1 ? 'File' : 'Files'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <BookOpen className="w-5 h-5" />
                                <span className="font-medium">{note.resources.length} {note.resources.length === 1 ? 'Reference' : 'References'}</span>
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
                    <hr className="border-border" />

                    {/* Files Gallery */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Files</h2>
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

