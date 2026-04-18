"use client"

import { useState, useTransition } from "react";
import { Folder, FolderPlus, Check, ChevronDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { addToCollection } from "@/actions/collections/add-to-collection";
import { createCollection } from "@/actions/collections/create-collection";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { CollectionWithCount } from "@/actions/collections/get-collections";

interface AddToCollectionMenuProps {
    noteId: number;
    currentCollectionId: number | null;
    collections: CollectionWithCount[];
    onUpdate: () => void;
}

export default function AddToCollectionMenu({
    noteId,
    currentCollectionId,
    collections,
    onUpdate,
}: AddToCollectionMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [showNewForm, setShowNewForm] = useState(false);
    const [newName, setNewName] = useState("");

    const currentCollection = collections.find((c) => c.id === currentCollectionId);

    const handleAssign = (collectionId: number | null) => {
        // If already in this collection, remove from it
        const targetId = collectionId === currentCollectionId ? null : collectionId;

        startTransition(async () => {
            const result = await addToCollection(noteId, targetId);
            if (result.success) {
                toast.success(result.message || "Collection updated!");
                onUpdate();
                setIsOpen(false);
            } else {
                toast.error(result.error);
            }
        });
    };

    const handleCreateAndAssign = () => {
        if (!newName.trim()) return;

        startTransition(async () => {
            const createResult = await createCollection({ name: newName.trim() });
            if (createResult.success && createResult.data) {
                const assignResult = await addToCollection(noteId, createResult.data.id);
                if (assignResult.success) {
                    toast.success(`Added to "${newName.trim()}"!`);
                    setNewName("");
                    setShowNewForm(false);
                    onUpdate();
                    setIsOpen(false);
                } else {
                    toast.error(assignResult.error);
                }
            } else {
                toast.error(createResult.error || "Failed to create collection");
            }
        });
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => e.stopPropagation()}
                    className={cn(
                        "h-8 gap-1.5 text-xs font-medium rounded-lg transition-all",
                        currentCollectionId
                            ? "text-primary bg-primary/5 hover:bg-primary/10"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                >
                    <Folder className="w-3.5 h-3.5" />
                    <span className="max-w-[100px] truncate">
                        {currentCollection ? currentCollection.name : "Add to collection"}
                    </span>
                    <ChevronDown className="w-3 h-3 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-64 p-2"
                align="start"
                side="bottom"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 py-1.5">
                        Move to collection
                    </p>

                    {/* Remove from collection option */}
                    {currentCollectionId && (
                        <button
                            onClick={() => handleAssign(null)}
                            disabled={isPending}
                            className="flex items-center gap-2 w-full px-2 py-2 text-sm rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                        >
                            <div className="w-4 h-4" />
                            <span>Unsorted</span>
                        </button>
                    )}

                    {/* Collection list */}
                    {collections.map((col) => (
                        <button
                            key={col.id}
                            onClick={() => handleAssign(col.id)}
                            disabled={isPending}
                            className={cn(
                                "flex items-center gap-2 w-full px-2 py-2 text-sm rounded-lg transition-colors",
                                col.id === currentCollectionId
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "hover:bg-muted text-foreground"
                            )}
                        >
                            {col.id === currentCollectionId ? (
                                <Check className="w-4 h-4 text-primary" />
                            ) : (
                                <Folder className="w-4 h-4 text-muted-foreground" />
                            )}
                            <span className="flex-1 text-left truncate">{col.name}</span>
                            <span className="text-xs text-muted-foreground">{col.bookmarkCount}</span>
                        </button>
                    ))}

                    {collections.length === 0 && !showNewForm && (
                        <p className="text-xs text-muted-foreground text-center py-3">
                            No collections yet
                        </p>
                    )}

                    {/* Divider */}
                    <div className="border-t border-border my-1.5" />

                    {/* Create new collection */}
                    {showNewForm ? (
                        <div className="flex gap-1.5 p-1">
                            <Input
                                placeholder="Collection name..."
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                onKeyDown={(e) => {
                                    e.stopPropagation();
                                    if (e.key === "Enter") handleCreateAndAssign();
                                    if (e.key === "Escape") {
                                        setShowNewForm(false);
                                        setNewName("");
                                    }
                                }}
                                maxLength={100}
                                className="h-8 text-sm"
                                autoFocus
                                disabled={isPending}
                            />
                            <Button
                                size="sm"
                                className="h-8 shrink-0 px-2.5"
                                onClick={handleCreateAndAssign}
                                disabled={isPending || !newName.trim()}
                            >
                                {isPending ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                    <Check className="w-3.5 h-3.5" />
                                )}
                            </Button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowNewForm(true)}
                            className="flex items-center gap-2 w-full px-2 py-2 text-sm rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                        >
                            <FolderPlus className="w-4 h-4" />
                            <span>New collection</span>
                        </button>
                    )}
                </div>

                {/* Loading overlay */}
                {isPending && (
                    <div className="absolute inset-0 bg-background/50 rounded-lg flex items-center justify-center">
                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
}
