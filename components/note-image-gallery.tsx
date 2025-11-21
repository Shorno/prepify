"use client"

import { useState } from "react";
import { CldImage } from "next-cloudinary";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { File } from "@/db/schema/note";
import { FileText, ExternalLink, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface NoteImageGalleryProps {
    files: File[];
}

// Helper function to check if URL is a PDF
const isPDF = (url: string): boolean => {
    return url.toLowerCase().includes('.pdf') || url.toLowerCase().includes('/pdf') || url.toLowerCase().includes('resource_type=raw');
};

// Helper function to get file name from URL
const getFileName = (url: string): string => {
    const parts = url.split('/');
    const lastPart = parts[parts.length - 1];
    // Remove cloudinary transformations and get clean filename
    const cleanName = lastPart.split('?')[0];
    const decoded = decodeURIComponent(cleanName);
    // If it's a cloudinary URL, extract the actual filename
    if (decoded.includes('/')) {
        const pathParts = decoded.split('/');
        return pathParts[pathParts.length - 1];
    }
    return decoded || 'document.pdf';
};

export default function NoteImageGallery({ files }: NoteImageGalleryProps) {
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);

    if (!files || files.length === 0) {
        return (
            <div className="bg-muted rounded-lg p-8 text-center">
                <p className="text-muted-foreground">No files available</p>
            </div>
        );
    }

    // Separate PDFs from images
    const pdfFiles = files.filter(file => isPDF(file.url));
    const imageFiles = files.filter(file => !isPDF(file.url));

    console.log(pdfFiles)

    // Prepare slides for lightbox (images only)
    const slides = imageFiles.map((file) => ({
        src: file.url,
        alt: `Image ${file.id}`,
    }));

    return (
        <div className="space-y-6">
            {/* PDF Files Section */}
            {pdfFiles.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">PDF Documents</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pdfFiles.map((file) => (
                            <Card key={file.id} className="p-4 hover:bg-accent/50 transition-colors">
                                <div className="flex items-start gap-3">
                                    <div className="bg-primary/10 p-2 rounded-lg shrink-0">
                                        <FileText className="w-6 h-6 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm truncate mb-1">
                                            {getFileName(file.url)}
                                        </p>
                                        <p className="text-xs text-muted-foreground mb-3">
                                            PDF Document
                                        </p>
                                        <div className="flex gap-2 flex-wrap">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-8 text-xs"
                                                onClick={() => window.open(file.url, '_blank')}
                                            >
                                                <ExternalLink className="w-3 h-3 mr-1" />
                                                Open in New Tab
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-8 text-xs"
                                                asChild
                                            >
                                                <a href={file.url} download>
                                                    <Download className="w-3 h-3 mr-1" />
                                                    Download
                                                </a>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                {/* PDF Preview */}
                                <div className="mt-3 rounded-md overflow-hidden border bg-muted">
                                    <iframe
                                        src={`${file.url}#toolbar=0&navpanes=0&scrollbar=0`}
                                        className="w-full h-48 pointer-events-none"
                                        title={`Preview of ${getFileName(file.url)}`}
                                    />
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Image Gallery Section */}
            {imageFiles.length > 0 && (
                <div className="space-y-4">
                    {pdfFiles.length > 0 && <h3 className="text-lg font-semibold">Images</h3>}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {imageFiles.map((file, idx) => (
                            <button
                                key={file.id}
                                onClick={() => {
                                    setIndex(idx);
                                    setOpen(true);
                                }}
                                className="relative aspect-square overflow-hidden rounded-lg border border-border bg-muted hover:opacity-80 transition-opacity cursor-pointer group"
                            >
                                <CldImage
                                    src={file.url}
                                    alt={`Image ${file.id}`}
                                    fill
                                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                    className="object-cover"
                                    quality="auto"
                                    format="auto"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                    <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium">
                                        View
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>

                    {imageFiles.length > 0 && (
                        <Lightbox
                            open={open}
                            close={() => setOpen(false)}
                            index={index}
                            slides={slides}
                            plugins={[Thumbnails, Fullscreen, Zoom]}
                            thumbnails={{
                                position: "bottom",
                                width: 120,
                                height: 80,
                                border: 1,
                                borderRadius: 4,
                                padding: 4,
                                gap: 16,
                            }}
                            zoom={{
                                maxZoomPixelRatio: 3,
                                scrollToZoom: true,
                            }}
                        />
                    )}
                </div>
            )}
        </div>
    );
}

