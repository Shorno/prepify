"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, ArrowUpDown, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import NoteCard from "@/components/note-card";
import { NotesWithRelations } from "@/db/schema/note";

type SortOption = "newest" | "oldest" | "most-liked" | "most-viewed" | "title-az" | "title-za";

interface NotesPageClientProps {
    notes: NotesWithRelations[];
}

export default function NotesPageClient({ notes }: NotesPageClientProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<SortOption>("newest");
    const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
    const [selectedFaculty, setSelectedFaculty] = useState<string>("all");
    const [selectedCourse, setSelectedCourse] = useState<string>("all");

    const departments = useMemo(() => {
        const deptMap = new Map<number, { id: number; name: string; code: string }>();
        notes.forEach((note) => {
            if (!deptMap.has(note.department.id)) {
                deptMap.set(note.department.id, {
                    id: note.department.id,
                    name: note.department.name,
                    code: note.department.departmentCode,
                });
            }
        });
        return Array.from(deptMap.values()).sort((a, b) => a.name.localeCompare(b.name));
    }, [notes]);

    const faculties = useMemo(() => {
        const facMap = new Map<number, { id: number; name: string; code: string }>();
        notes.forEach((note) => {
            if (!facMap.has(note.faculty.id)) {
                facMap.set(note.faculty.id, {
                    id: note.faculty.id,
                    name: note.faculty.name,
                    code: note.faculty.facultyCode,
                });
            }
        });
        return Array.from(facMap.values()).sort((a, b) => a.name.localeCompare(b.name));
    }, [notes]);

    const courses = useMemo(() => {
        const courseMap = new Map<number, { id: number; name: string; code: string }>();
        const filteredNotes = selectedDepartment === "all"
            ? notes
            : notes.filter((n) => n.department.id.toString() === selectedDepartment);

        filteredNotes.forEach((note) => {
            if (!courseMap.has(note.course.id)) {
                courseMap.set(note.course.id, {
                    id: note.course.id,
                    name: note.course.name,
                    code: note.course.courseCode,
                });
            }
        });
        return Array.from(courseMap.values()).sort((a, b) => a.name.localeCompare(b.name));
    }, [notes, selectedDepartment]);

    const filteredAndSortedNotes = useMemo(() => {
        let filtered = [...notes];

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (note) =>
                    note.title.toLowerCase().includes(query) ||
                    note.description?.toLowerCase().includes(query) ||
                    note.course.name.toLowerCase().includes(query) ||
                    note.course.courseCode.toLowerCase().includes(query) ||
                    note.department.name.toLowerCase().includes(query) ||
                    note.user.name.toLowerCase().includes(query)
            );
        }

        if (selectedFaculty !== "all") {
            filtered = filtered.filter((note) => note.faculty.id.toString() === selectedFaculty);
        }

        if (selectedDepartment !== "all") {
            filtered = filtered.filter((note) => note.department.id.toString() === selectedDepartment);
        }

        if (selectedCourse !== "all") {
            filtered = filtered.filter((note) => note.course.id.toString() === selectedCourse);
        }

        switch (sortBy) {
            case "newest":
                filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                break;
            case "oldest":
                filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                break;
            case "most-liked":
                filtered.sort((a, b) => b.likes.length - a.likes.length);
                break;
            case "most-viewed":
                filtered.sort((a, b) => b.viewsCount - a.viewsCount);
                break;
            case "title-az":
                filtered.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case "title-za":
                filtered.sort((a, b) => b.title.localeCompare(a.title));
                break;
        }

        return filtered;
    }, [notes, searchQuery, sortBy, selectedDepartment, selectedFaculty, selectedCourse]);

    const hasActiveFilters = selectedDepartment !== "all" || selectedFaculty !== "all" || selectedCourse !== "all";

    const clearFilters = () => {
        setSelectedDepartment("all");
        setSelectedFaculty("all");
        setSelectedCourse("all");
        setSearchQuery("");
        setSortBy("newest");
    };

    return (
        <div className="space-y-6">
            {/* Search and Controls Bar */}
            <div className="space-y-4">
                {/* Search Input */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search notes by title, course, department, or author..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-11 rounded-xl border-border/60 bg-card shadow-warm-sm focus-visible:shadow-warm-md transition-shadow"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* Filters and Sort Row */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <SlidersHorizontal className="h-4 w-4" />
                        <span className="font-medium hidden sm:inline">Filters:</span>
                    </div>

                    {/* Faculty Filter */}
                    <Select
                        value={selectedFaculty}
                        onValueChange={(value) => {
                            setSelectedFaculty(value);
                            setSelectedDepartment("all");
                            setSelectedCourse("all");
                        }}
                    >
                        <SelectTrigger className="h-9 rounded-lg text-xs">
                            <SelectValue placeholder="Faculty" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Faculties</SelectItem>
                            {faculties.map((fac) => (
                                <SelectItem key={fac.id} value={fac.id.toString()}>
                                    {fac.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Department Filter */}
                    <Select
                        value={selectedDepartment}
                        onValueChange={(value) => {
                            setSelectedDepartment(value);
                            setSelectedCourse("all");
                        }}
                    >
                        <SelectTrigger className="h-9 rounded-lg text-xs">
                            <SelectValue placeholder="Department" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Departments</SelectItem>
                            {departments.map((dept) => (
                                <SelectItem key={dept.id} value={dept.id.toString()}>
                                    {dept.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Course Filter */}
                    <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                        <SelectTrigger className="h-9 rounded-lg text-xs">
                            <SelectValue placeholder="Course" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Courses</SelectItem>
                            {courses.map((course) => (
                                <SelectItem key={course.id} value={course.id.toString()}>
                                    {course.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Sort */}
                    <div className="flex items-center gap-2 ml-auto">
                        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                        <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                            <SelectTrigger className="h-9 rounded-lg text-xs">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">Newest First</SelectItem>
                                <SelectItem value="oldest">Oldest First</SelectItem>
                                <SelectItem value="most-liked">Most Liked</SelectItem>
                                <SelectItem value="most-viewed">Most Viewed</SelectItem>
                                <SelectItem value="title-az">Title (A-Z)</SelectItem>
                                <SelectItem value="title-za">Title (Z-A)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Active filters indicator and clear */}
                {hasActiveFilters && (
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                            {filteredAndSortedNotes.length} {filteredAndSortedNotes.length === 1 ? "note" : "notes"} found
                        </span>
                        <button
                            onClick={clearFilters}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full hover:bg-primary/20 transition-colors"
                        >
                            <X className="h-3 w-3" />
                            Clear all
                        </button>
                    </div>
                )}
            </div>

            {/* Results */}
            {filteredAndSortedNotes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredAndSortedNotes.map((note) => (
                        <NoteCard key={note.id} data={note} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 px-4">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted/50 flex items-center justify-center">
                        <Search className="w-7 h-7 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No notes found</h3>
                    <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                        Try adjusting your search or filters to find what you&apos;re looking for.
                    </p>
                    {(hasActiveFilters || searchQuery) && (
                        <button
                            onClick={clearFilters}
                            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-full hover:bg-primary/20 transition-colors"
                        >
                            <X className="h-3.5 w-3.5" />
                            Clear all filters
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
