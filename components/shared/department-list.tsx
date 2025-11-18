"use client"
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {Check} from "lucide-react";
import {cn} from "@/lib/utils";
import * as React from "react";
import {getFacultiesWithDepartments} from "@/actions/university-info";
import {useQuery} from "@tanstack/react-query";
import {Skeleton} from "@/components/ui/skeleton";

interface DepartmentListProps {
    setOpen: (open: boolean) => void
    selectedValue: string | undefined
    onSelect: (departmentId: string, facultyId: string) => void
}

export default function DepartmentList({
                                           setOpen,
                                           selectedValue,
                                           onSelect,
                                       }: DepartmentListProps) {
    const {data, isLoading} = useQuery({
        queryKey: ["faculties-departments"],
        queryFn: getFacultiesWithDepartments
    })

    return (
        <Command>
            <CommandInput placeholder="Search department..."/>
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
                        <CommandEmpty>No department found.</CommandEmpty>
                        {data?.map((faculty) => (
                            <CommandGroup key={faculty.name} heading={faculty.name}>
                                {faculty.departments.map((department) => (
                                    <CommandItem
                                        value={`${department.name} ${department.departmentCode || ''}`}
                                        key={department.id}
                                        onSelect={() => {
                                            setOpen(false);
                                            // Pass both department id and faculty id
                                            onSelect(department.id.toString(), faculty.id.toString());
                                        }}
                                        className="flex items-start py-3"
                                    >
                                        <span className="flex-1 line-clamp-2 leading-tight">
                                            {department.name}
                                        </span>
                                        <Check
                                            className={cn(
                                                "h-4 w-4 ml-auto",
                                                department.id.toString() === selectedValue ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        ))}
                    </>
                )}
            </CommandList>
        </Command>
    )
}
