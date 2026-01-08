"use client"

import { ExternalLink, Copy, Link as LinkIcon } from "lucide-react";
import { Resource } from "@/db/schema/note";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ReferenceLinksProps {
    resources: Resource[];
}

export default function ReferenceLinks({ resources }: ReferenceLinksProps) {
    const copyToClipboard = (url: string) => {
        navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard");
    };

    if (!resources || resources.length === 0) {
        return (
            <div className="bg-muted/30 rounded-2xl p-8 text-center border border-border/40">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                    <LinkIcon className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">No reference links available</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                <LinkIcon className="w-5 h-5 text-primary" />
                Reference Links
            </h3>
            {resources.map((resource, idx) => (
                <div
                    key={resource.id}
                    className="group border border-border/60 rounded-xl p-4 hover:border-primary/40 hover:shadow-warm-sm transition-all bg-card"
                >
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground mb-1.5 font-medium">
                                Link {idx + 1}
                            </p>
                            <a
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:text-primary/80 break-all flex items-center gap-1.5 font-medium"
                            >
                                <span className="line-clamp-2">{resource.url}</span>
                                <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </a>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 flex-shrink-0 rounded-full hover:bg-primary/10 hover:text-primary"
                            onClick={() => copyToClipboard(resource.url)}
                        >
                            <Copy className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}

