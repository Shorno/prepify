import Image from "next/image";
import { FileText, BookOpen, ChevronRight, Heart, Eye, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { NotesWithRelations } from "@/db/schema";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

function NoteStatusBadge({ status, rejectionReason }: { status: string; rejectionReason?: string | null }) {
    if (status === "pending") {
        return (
            <Badge variant="secondary" className="gap-1.5 text-xs px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200">
                <Clock className="w-3 h-3" />
                Pending Review
            </Badge>
        );
    }
    if (status === "approved") {
        return (
            <Badge variant="secondary" className="gap-1.5 text-xs px-2.5 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200">
                <CheckCircle2 className="w-3 h-3" />
                Published
            </Badge>
        );
    }
    if (status === "rejected") {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Badge variant="destructive" className="gap-1.5 text-xs px-2.5 py-1 rounded-full cursor-help">
                            <XCircle className="w-3 h-3" />
                            Rejected
                        </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{rejectionReason || "No reason provided"}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }
    return null;
}

type NoteWithStatus = NotesWithRelations & {
    status?: string;
    rejectionReason?: string | null;
};

export function UserNoteCard({ data }: { data: NoteWithStatus }) {
    const fileCount = data.files.length;
    const resourceCount = data.resources.length;
    const maxPreviews = 3; // match NoteCard
    const previewFiles = data.files.slice(0, maxPreviews);
    const additionalFiles = Math.max(0, fileCount - maxPreviews);

    return (
        <Link href={`/my-notes/${data.id}`}>
            <div className="group bg-card border border-border/60 rounded-2xl p-4 shadow-warm-sm hover:shadow-warm-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full flex flex-col">
                {/* Status badge */}
                {data.status && (
                    <div className="mb-3">
                        <NoteStatusBadge status={data.status} rejectionReason={data.rejectionReason} />
                    </div>
                )}

                {/* Course name and department badges */}
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className="inline-flex items-center px-2.5 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                        {data.course.name}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-full">
                        {data.department.departmentCode.toUpperCase()}
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-sm font-semibold text-foreground line-clamp-2 mb-3 min-w-0 group-hover:text-primary transition-colors">
                    {data.title}
                </h3>

                {/* Image preview grid */}
                {fileCount > 0 && (
                    <div className="flex gap-2 mb-4 flex-wrap">
                        {previewFiles.map((file) => {
                            // Check if file is a PDF
                            const isPDF = file.url.includes('.pdf') || file.url.includes('f_pdf') || file.url.toLowerCase().endsWith('.pdf')

                            return (
                                <div
                                    key={file.id}
                                    className="relative w-20 h-20 bg-muted/50 rounded-xl border border-border/60 overflow-hidden flex-shrink-0"
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
                            <div className="w-20 h-20 bg-muted/50 rounded-xl border border-border/60 flex items-center justify-center flex-shrink-0">
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
                        Details
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                </div>
            </div>
        </Link>
    );
}

