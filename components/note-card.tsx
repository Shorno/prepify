"use client";

import Image from "next/image";
import { FileText, BookOpen, ChevronRight, Heart, Eye } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { NotesWithRelations } from "@/db/schema";

export default function NoteCard({ data }: { data: NotesWithRelations }) {
    const router = useRouter();
    const fileCount = data.files.length;
    const resourceCount = data.resources.length;
    const maxPreviews = 3;
    const previewFiles = data.files.slice(0, maxPreviews);
    const additionalFiles = Math.max(0, fileCount - maxPreviews);

    // Get user initials
    const uploaderInitials = data.user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();

    const handleCardClick = () => {
        router.push(`/notes/${data.id}`);
    };

    const handleUserClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        router.push(`/user/${data.user.username || data.user.id}`);
    };

    return (
        <div
            onClick={handleCardClick}
            className="group relative bg-card border border-border/60 rounded-2xl p-4 shadow-warm-sm hover:shadow-warm-lg transition-all duration-300 cursor-pointer h-full flex flex-col hover:-translate-y-1 overflow-hidden"
        >
            {/* Uploader info */}
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border">
                <div
                    onClick={handleUserClick}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
                >
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={data.user.image || "/placeholder.svg"} alt={data.user.name} />
                        <AvatarFallback className="text-xs font-semibold">{uploaderInitials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate hover:underline">{data.user.name}</p>
                        <p className="text-xs text-muted-foreground">{data.user.batch || 'Student'}</p>
                    </div>
                </div>
            </div>

            {/* Course and department badges */}
            <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="inline-flex items-center px-2.5 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                    {data.course.name}
                </span>
                <span className="inline-flex items-center px-2.5 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-full">
                    {data.department.departmentCode.toUpperCase()}
                </span>
            </div>

            {/* Title */}
            <h3 className="text-sm font-semibold text-foreground line-clamp-2 mb-3 min-w-0">
                {data.title}
            </h3>

            {/* Image preview grid */}
            {fileCount > 0 && (
                <div className="flex gap-2 mb-3 flex-wrap">
                    {previewFiles.map((file) => {
                        // Check if file is a PDF
                        const isPDF = file.url.includes('.pdf') || file.url.includes('f_pdf') || file.url.toLowerCase().endsWith('.pdf')

                        return (
                            <div
                                key={file.id}
                                className="relative w-20 h-20 bg-muted rounded border border-border overflow-hidden flex-shrink-0"
                            >
                                {isPDF ? (
                                    // Show PDF icon for PDF files
                                    <div className="w-full h-full flex items-center justify-center">
                                        <FileText className="w-8 h-8 text-muted-foreground" />
                                    </div>
                                ) : (
                                    // Show image for image files
                                    <Image
                                        src={file.url || "/placeholder.svg"}
                                        alt={`File preview ${file.id}`}
                                        fill
                                        sizes="80px"
                                        className="object-cover"
                                    />
                                )}
                            </div>
                        )
                    })}
                    {additionalFiles > 0 && (
                        <div className="w-20 h-20 bg-muted rounded border border-border flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-semibold text-muted-foreground">
                                +{additionalFiles}
                            </span>
                        </div>
                    )}
                </div>
            )}

            {/* Stats and view details button */}
            <div className="flex items-center justify-between gap-2 mt-auto pt-3 border-t border-border/40">
                <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5 group/stat">
                        <Heart className="w-3.5 h-3.5 text-muted-foreground group-hover/stat:text-primary transition-colors" />
                        <span className="text-foreground font-medium">{data.likes.length}</span>
                    </div>
                    <div className="flex items-center gap-1.5 group/stat">
                        <Eye className="w-3.5 h-3.5 text-muted-foreground group-hover/stat:text-primary transition-colors" />
                        <span className="text-foreground font-medium">{data.viewsCount}</span>
                    </div>
                    <div className="flex items-center gap-1.5 group/stat">
                        <FileText className="w-3.5 h-3.5 text-muted-foreground group-hover/stat:text-primary transition-colors" />
                        <span className="text-foreground font-medium">{fileCount}</span>
                    </div>
                    <div className="flex items-center gap-1.5 group/stat">
                        <BookOpen className="w-3.5 h-3.5 text-muted-foreground group-hover/stat:text-primary transition-colors" />
                        <span className="text-foreground font-medium">{resourceCount}</span>
                    </div>
                </div>
                <div className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-primary bg-primary/5 rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200">
                    View
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
            </div>
        </div>
    );
}

