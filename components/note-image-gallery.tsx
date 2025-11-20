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

interface NoteImageGalleryProps {
    files: File[];
}

export default function NoteImageGallery({ files }: NoteImageGalleryProps) {
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);

    if (!files || files.length === 0) {
        return (
            <div className="bg-muted rounded-lg p-8 text-center">
                <p className="text-muted-foreground">No images available</p>
            </div>
        );
    }

    // Prepare slides for lightbox
    const slides = files.map((file) => ({
        src: file.url,
        alt: `Image ${file.id}`,
    }));

    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {files.map((file, idx) => (
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
        </>
    );
}

