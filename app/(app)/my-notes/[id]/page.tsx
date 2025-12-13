import getNoteById from "@/actions/notes/get-note-by-id";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, FileText, BookOpen, Edit, Trash2 } from "lucide-react";
import NoteImageGallery from "@/components/note-image-gallery";
import ReferenceLinks from "@/components/reference-links-sidebar";
import { notFound, redirect } from "next/navigation";
import {checkAuth} from "@/app/actions/user/checkAuth";

interface MyNotePageProps {
    params: Promise<{ id: string }>;
}

export default async function MyNotePage({ params }: MyNotePageProps) {
    const session = await checkAuth();

    if (!session?.user) {
        redirect("/login");
    }

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

    // Check if the current user is the owner of this note
    if (note.userId !== session.user.id) {
        // Redirect to public view if user is not the owner
        redirect(`/notes/${noteId}`);
    }

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

    return (
        <div className="main-container py-8">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
                {/* Main Content */}
                <div className="space-y-6">
                    {/* Note Header */}
                    <div className="space-y-4">
                        {/* Uploader Info and Actions */}
                        <div className="flex items-start justify-between gap-4">
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

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm">
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                </Button>
                                <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                </Button>
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
                    </div>

                    {/* Divider */}
                    <hr className="border-border" />

                    {/* Files Gallery */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Files</h2>
                        <NoteImageGallery files={note.files} />
                    </div>

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
