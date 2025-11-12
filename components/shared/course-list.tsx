"use client"
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {Check} from "lucide-react";
import {cn} from "@/lib/utils";
import * as React from "react";
import {Skeleton} from "@/components/ui/skeleton";

type Course = {
    id: number;
    name: string;
    courseCode: string;
}

interface CourseListProps {
    courses: Course[] | undefined
    isLoading: boolean
    setOpen: (open: boolean) => void
    selectedValue: string | undefined
    onSelect: (value: string) => void
}


export default function CourseList({
                                       courses,
                                       isLoading,
                                       setOpen,
                                       selectedValue,
                                       onSelect,
                                   }: CourseListProps) {
    return (
        <Command>
            <CommandInput placeholder="Search course..."/>
            <CommandList>
                {isLoading ? (
                    <div className="p-2 space-y-2">
                        <Skeleton className="h-8 w-full"/>
                        <Skeleton className="h-8 w-full"/>
                        <Skeleton className="h-8 w-full"/>
                        <Skeleton className="h-8 w-full"/>
                        <Skeleton className="h-8 w-full"/>
                    </div>
                ) : (
                    <>
                        <CommandEmpty>No course found.</CommandEmpty>
                        <CommandGroup>
                            {courses?.map((course) => (
                                <CommandItem
                                    value={course.name}
                                    key={course.id}
                                    onSelect={() => {
                                        setOpen(false);
                                        onSelect(course.id.toString());
                                    }}
                                    className="flex items-start py-3" // Changed from items-center, added padding

                                >
                                    <div className="flex flex-col flex-1 gap-0.5 pr-2"> {/* Added pr-2 for spacing */}
                                        <span className="line-clamp-2 leading-tight"> {/* Allow 2 lines */}
                                            {course.name}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {course.courseCode}
                                        </span>
                                    </div>
                                    <Check
                                        className={cn(
                                            "h-4 w-4 ml-auto",
                                            course.id.toString() === selectedValue ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </>
                )}
            </CommandList>
        </Command>
    )
}
