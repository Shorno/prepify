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
import { FileText, ExternalLink, Download, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface NoteImageGalleryProps {
    files: File[];
}

const isPDF = (url: string): boolean => {
    return url.toLowerCase().includes('.pdf') || url.toLowerCase().includes('/pdf') || url.toLowerCase().includes('resource_type=raw');
};

const getFileName = (url: string): string => {
    const parts = url.split('/');
    const lastPart = parts[parts.length - 1];
    const cleanName = lastPart.split('?')[0];
    const decoded = decodeURIComponent(cleanName);
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

    const pdfFiles = files.filter(file => isPDF(file.url));
    const imageFiles = files.filter(file => !isPDF(file.url));

    const slides = imageFiles.map((file) => ({
        src: file.url,
        alt: `Image ${file.id}`,
    }));

    const hasOnlyImages = imageFiles.length > 0 && pdfFiles.length === 0;
    const hasOnlyPDFs = pdfFiles.length > 0 && imageFiles.length === 0;

    if (hasOnlyImages || hasOnlyPDFs) {
        return (
            <div className="space-y-6">
                {/* PDF Files Section */}
                {hasOnlyPDFs && (
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
                )}

                {/* Image Gallery Section */}
                {hasOnlyImages && (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                            {imageFiles.map((file, idx) => (
                                <button
                                    key={file.id}
                                    onClick={() => {
                                        setIndex(idx);
                                        setOpen(true);
                                    }}
                                    className="relative aspect-[4/3] overflow-hidden rounded-md border border-border bg-muted hover:opacity-80 transition-opacity cursor-pointer group"
                                >
                                    <CldImage
                                        src={file.url}
                                        alt={`Image ${file.id}`}
                                        fill
                                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                                        className="object-cover"
                                        quality="auto"
                                        format="auto"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                        <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-xs font-medium bg-black/50 px-2 py-1 rounded">
                                            View
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>

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
                        />
                    </>
                )}
            </div>
        );
    }

    // Tabbed view for mixed content
    return (
        <Tabs defaultValue="images" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="images" className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    <span>Images</span>
                    <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold">
                        {imageFiles.length}
                    </span>
                </TabsTrigger>
                <TabsTrigger value="pdfs" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span>PDFs</span>
                    <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold">
                        {pdfFiles.length}
                    </span>
                </TabsTrigger>
            </TabsList>

            <TabsContent value="images" className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {imageFiles.map((file, idx) => (
                        <button
                            key={file.id}
                            onClick={() => {
                                setIndex(idx);
                                setOpen(true);
                            }}
                            className="relative aspect-[4/3] overflow-hidden rounded-md border border-border bg-muted hover:opacity-80 transition-opacity cursor-pointer group"
                        >
                            <CldImage
                                src={file.url}
                                alt={`Image ${file.id}`}
                                fill
                                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                                className="object-cover"
                                quality="auto"
                                format="auto"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-xs font-medium bg-black/50 px-2 py-1 rounded">
                                    View
                                </span>
                            </div>
                        </button>
                    ))}
                </div>

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
                />
            </TabsContent>

            <TabsContent value="pdfs" className="space-y-4">
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
            </TabsContent>
        </Tabs>
    );
}

