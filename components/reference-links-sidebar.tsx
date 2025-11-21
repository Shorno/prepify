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
            <div className="bg-muted rounded-lg p-6 text-center">
                <LinkIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No reference links available</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <h3 className="text-lg font-semibold mb-4">Reference Links</h3>
            {resources.map((resource, idx) => (
                <div
                    key={resource.id}
                    className="group border border-border rounded-lg p-3 hover:border-primary/50 transition-colors bg-card"
                >
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground mb-1">
                                Link {idx + 1}
                            </p>
                            <a
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline break-all flex items-center gap-1 group-hover:text-primary/80"
                            >
                                <span className="line-clamp-2">{resource.url}</span>
                                <ExternalLink className="w-3 h-3 flex-shrink-0" />
                            </a>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 flex-shrink-0"
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

