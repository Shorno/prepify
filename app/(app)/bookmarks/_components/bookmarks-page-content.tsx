"use client"

import { useState, useTransition, useEffect } from "react";
import { getBookmarks, BookmarkWithNote } from "@/actions/bookmarks/get-bookmarks";
import { getCollections, CollectionWithCount } from "@/actions/collections/get-collections";
import { createCollection } from "@/actions/collections/create-collection";
import { deleteCollection } from "@/actions/collections/delete-collection";
import NoteCard from "@/components/note-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Bookmark, FolderPlus, Folder, BookmarkX, Trash2, Plus, Library } from "lucide-react";
import { cn } from "@/lib/utils";
import AddToCollectionMenu from "./add-to-collection-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export default function BookmarksPageContent() {
    const [bookmarks, setBookmarks] = useState<BookmarkWithNote[]>([]);
    const [collections, setCollections] = useState<CollectionWithCount[]>([]);
    const [activeFilter, setActiveFilter] = useState<"all" | "unsorted" | number>("all");
    const [isLoading, setIsLoading] = useState(true);
    const [newCollectionName, setNewCollectionName] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [bookmarksResult, collectionsResult] = await Promise.all([
                getBookmarks(),
                getCollections(),
            ]);

            if (bookmarksResult.success) setBookmarks(bookmarksResult.data);
            if (collectionsResult.success) setCollections(collectionsResult.data);
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const filteredBookmarks = bookmarks.filter((b) => {
        if (activeFilter === "all") return true;
        if (activeFilter === "unsorted") return b.collectionId === null;
        return b.collectionId === activeFilter;
    });

    const handleCreateCollection = () => {
        if (!newCollectionName.trim()) return;

        startTransition(async () => {
            const result = await createCollection({ name: newCollectionName.trim() });
            if (result.success) {
                toast.success("Collection created!");
                setNewCollectionName("");
                setIsDialogOpen(false);
                loadData();
            } else {
                toast.error(result.error);
            }
        });
    };

    const handleDeleteCollection = (collectionId: number, collectionName: string) => {
        if (!confirm(`Delete "${collectionName}"? Bookmarks will be moved to Unsorted.`)) return;

        startTransition(async () => {
            const result = await deleteCollection(collectionId);
            if (result.success) {
                toast.success("Collection deleted");
                if (activeFilter === collectionId) setActiveFilter("all");
                loadData();
            } else {
                toast.error(result.error);
            }
        });
    };

    const unsortedCount = bookmarks.filter((b) => b.collectionId === null).length;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
            {/* Sidebar — Collections */}
            <aside className="space-y-2">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        Collections
                    </h2>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                                <Plus className="w-4 h-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>New Collection</DialogTitle>
                            </DialogHeader>
                            <div className="flex gap-2 mt-2">
                                <Input
                                    placeholder="Collection name..."
                                    value={newCollectionName}
                                    onChange={(e) => setNewCollectionName(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleCreateCollection()}
                                    maxLength={100}
                                />
                                <Button
                                    onClick={handleCreateCollection}
                                    disabled={isPending || !newCollectionName.trim()}
                                    className="shrink-0"
                                >
                                    <FolderPlus className="w-4 h-4 mr-1" />
                                    Create
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* All Bookmarks */}
                <button
                    onClick={() => setActiveFilter("all")}
                    className={cn(
                        "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                        activeFilter === "all"
                            ? "bg-primary text-primary-foreground shadow-warm-sm"
                            : "text-foreground hover:bg-muted"
                    )}
                >
                    <Library className="w-4 h-4" />
                    <span className="flex-1 text-left">All Bookmarks</span>
                    <span className="text-xs opacity-70">{bookmarks.length}</span>
                </button>

                {/* Unsorted */}
                <button
                    onClick={() => setActiveFilter("unsorted")}
                    className={cn(
                        "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                        activeFilter === "unsorted"
                            ? "bg-primary text-primary-foreground shadow-warm-sm"
                            : "text-foreground hover:bg-muted"
                    )}
                >
                    <Bookmark className="w-4 h-4" />
                    <span className="flex-1 text-left">Unsorted</span>
                    <span className="text-xs opacity-70">{unsortedCount}</span>
                </button>

                {/* User Collections */}
                {collections.map((col) => (
                    <div key={col.id} className="group flex items-center">
                        <button
                            onClick={() => setActiveFilter(col.id)}
                            className={cn(
                                "flex items-center gap-3 flex-1 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                                activeFilter === col.id
                                    ? "bg-primary text-primary-foreground shadow-warm-sm"
                                    : "text-foreground hover:bg-muted"
                            )}
                        >
                            <Folder className="w-4 h-4" />
                            <span className="flex-1 text-left truncate">{col.name}</span>
                            <span className="text-xs opacity-70">{col.bookmarkCount}</span>
                        </button>
                        <button
                            onClick={() => handleDeleteCollection(col.id, col.name)}
                            className="opacity-0 group-hover:opacity-100 p-1.5 text-muted-foreground hover:text-destructive transition-all"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                ))}
            </aside>

            {/* Main Content — Bookmarked Notes */}
            <div>
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-64 bg-muted animate-pulse rounded-2xl" />
                        ))}
                    </div>
                ) : filteredBookmarks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <BookmarkX className="w-16 h-16 text-muted-foreground/30 mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-1">
                            {activeFilter === "all" ? "No bookmarks yet" : "No notes in this collection"}
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-sm">
                            {activeFilter === "all"
                                ? "Start bookmarking notes you find helpful — they'll appear here"
                                : "Add bookmarked notes to this collection to organize your study materials"
                            }
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {filteredBookmarks.map((b) => (
                            <div key={b.id} className="flex flex-col">
                                <NoteCard data={b.note} />
                                <div className="mt-1.5 px-1">
                                    <AddToCollectionMenu
                                        noteId={b.noteId}
                                        currentCollectionId={b.collectionId}
                                        collections={collections}
                                        onUpdate={loadData}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
