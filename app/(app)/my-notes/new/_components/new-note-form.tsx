"use client"
import { Card, CardContent } from "@/components/ui/card";
import { ChevronsUpDown, Loader, Plus, X } from "lucide-react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import DepartmentList from "@/components/shared/department-list";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { DialogTitle } from "@/components/ui/dialog";
import * as React from "react";
import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { NoteFormData, noteSchema } from "@/zodSchema/noteSchema";
import { Input } from "@/components/ui/input";
import FileUploader from "@/components/file-uploader";
import { useQuery } from "@tanstack/react-query";
import { getCoursesByDepartment, getFacultiesWithDepartments } from "@/actions/university-info";
import CourseList from "@/components/shared/course-list";
import { authClient } from "@/lib/auth-client";
import saveNote from "@/actions/notes/save-note";

export default function NewNoteForm() {
    const { data: session } = authClient.useSession()

    const [open, setOpen] = useState(false);
    const [openCourse, setOpenCourse] = useState(false);

    const [isPending, startTransition] = useTransition()
    const router = useRouter();
    const isMobile = useIsMobile();

    const { data } = useQuery({
        queryKey: ["faculties-departments"],
        queryFn: getFacultiesWithDepartments
    })

    const form = useForm<NoteFormData>({
        resolver: zodResolver(noteSchema),
        defaultValues: {
            departmentId: session?.user?.departmentId.toString() || undefined,
            facultyId: session?.user?.facultyId.toString() || undefined,
            courseId: undefined,
            title: "",
            files: [],
            resources: [],
        },
    })

    useEffect(() => {
        if (session?.user?.departmentId && session?.user?.facultyId) {
            form.setValue("departmentId", session.user.departmentId.toString());
            form.setValue("facultyId", session.user.facultyId.toString());
        }
    }, [form, session]);

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "resources"
    })

    // eslint-disable-next-line react-hooks/incompatible-library
    const selectedDepartmentId = form.watch("departmentId");

    useEffect(() => {
        if (selectedDepartmentId && data) {
            const department = data.flatMap(f => f.departments)
                .find(dept => dept.id.toString() === selectedDepartmentId);

            if (department) {
                const faculty = data.find(f =>
                    f.departments.some(d => d.id.toString() === selectedDepartmentId)
                );

                if (faculty) {
                    form.setValue("facultyId", faculty.id.toString());
                }
            }
        }
    }, [selectedDepartmentId, data, form]);

    const { data: courses, isLoading } = useQuery({
        queryKey: ["department-courses", selectedDepartmentId],
        queryFn: () => getCoursesByDepartment(Number(selectedDepartmentId)),
        enabled: !!selectedDepartmentId,
    })

    const selectedDepartment = data?.flatMap(f => f.departments)
        .find(dept => dept.id.toString() === selectedDepartmentId);

    function onSubmit(values: NoteFormData) {
        startTransition(async () => {
            try {
                const result = await saveNote(values);

                if (result.success) {
                    toast.success(result.message || "Note saved successfully!");
                    router.push("/my-notes");
                    form.reset();
                } else {
                    toast.error(result.error);
                    if (result.details) {
                        console.error("Validation errors:", result.details);
                    }
                }
            } catch (error) {
                console.error("Unexpected error:", error);
                toast.error("An unexpected error occurred. Please try again.");
            }
        });
    }

    return (
        <>
            <Card
                className="w-full max-w-2xl rounded-2xl mx-auto shadow-warm-lg border border-border/60 bg-card">
                <CardContent className="space-y-6 p-6 sm:p-8">

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">

                                {/* Department Field */}
                                <FormField
                                    control={form.control}
                                    name="departmentId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base font-medium">Department</FormLabel>

                                            {!isMobile ? (
                                                <Popover open={open} onOpenChange={setOpen}>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant="outline"
                                                                role="combobox"
                                                                className={cn(
                                                                    "w-full overflow-hidden justify-between text-sm",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                <span className="line-clamp-1 text-left flex-1">
                                                                    {field.value
                                                                        ? selectedDepartment?.name
                                                                        : "Select department"
                                                                    }
                                                                </span>
                                                                <ChevronsUpDown
                                                                    className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent
                                                        className="w-full p-0"
                                                        align="start"
                                                        style={{ width: 'var(--radix-popover-trigger-width)' }}
                                                    >
                                                        <DepartmentList
                                                            setOpen={setOpen}
                                                            selectedValue={field.value}
                                                            onSelect={(departmentId) => {
                                                                form.setValue("departmentId", departmentId);
                                                                form.setValue("courseId", "");
                                                            }}
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            ) : (
                                                <Drawer open={open} onOpenChange={setOpen}>
                                                    <DrawerTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant="outline"
                                                                role="combobox"
                                                                className={cn(
                                                                    "w-full justify-between text-xs",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                <span className="line-clamp-1 text-left flex-1">
                                                                    {field.value
                                                                        ? selectedDepartment?.name
                                                                        : "Select department"
                                                                    }
                                                                </span>
                                                                <ChevronsUpDown
                                                                    className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </DrawerTrigger>
                                                    <DialogTitle />
                                                    <DrawerContent>
                                                        <div className="mt-4 border-t">
                                                            <DepartmentList
                                                                setOpen={setOpen}
                                                                selectedValue={field.value}
                                                                onSelect={(departmentId) => {
                                                                    form.setValue("departmentId", departmentId);
                                                                    form.setValue("courseId", "");
                                                                }}
                                                            />
                                                        </div>
                                                    </DrawerContent>
                                                </Drawer>
                                            )}

                                            <FormDescription className="text-xs">
                                                Select your department
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Course Field */}
                                <FormField
                                    control={form.control}
                                    name="courseId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base font-medium">Course</FormLabel>

                                            {!isMobile ? (
                                                <Popover open={openCourse} onOpenChange={setOpenCourse}>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant="outline"
                                                                role="combobox"
                                                                disabled={!selectedDepartmentId || isLoading}
                                                                className={cn(
                                                                    "w-full overflow-hidden justify-between text-sm",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                <span className="line-clamp-1 text-left flex-1">
                                                                    {field.value
                                                                        ? courses?.find((c) => c.id.toString() === field.value)?.name
                                                                        : "Select course"
                                                                    }
                                                                </span>
                                                                <ChevronsUpDown
                                                                    className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent
                                                        className="w-full p-0"
                                                        align="start"
                                                        style={{ width: 'var(--radix-popover-trigger-width)' }}
                                                    >
                                                        <CourseList
                                                            courses={courses}
                                                            isLoading={isLoading}
                                                            setOpen={setOpenCourse}
                                                            selectedValue={field.value}
                                                            onSelect={(value) => form.setValue("courseId", value)}
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            ) : (
                                                <Drawer open={openCourse} onOpenChange={setOpenCourse}>
                                                    <DrawerTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant="outline"
                                                                role="combobox"
                                                                disabled={!selectedDepartmentId || isLoading}
                                                                className={cn(
                                                                    "w-full justify-between text-xs",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                {isLoading ? (
                                                                    <>
                                                                        <Loader className="h-4 w-4 animate-spin mr-2" />
                                                                        Loading...
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <span className="line-clamp-1 text-left flex-1">
                                                                            {field.value
                                                                                ? courses?.find((c) => c.id.toString() === field.value)?.name
                                                                                : "Select course"
                                                                            }
                                                                        </span>
                                                                        <ChevronsUpDown
                                                                            className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                                    </>
                                                                )}
                                                            </Button>
                                                        </FormControl>
                                                    </DrawerTrigger>
                                                    <DialogTitle />
                                                    <DrawerContent>
                                                        <div className="mt-4 border-t">
                                                            <CourseList
                                                                courses={courses}
                                                                isLoading={isLoading}
                                                                setOpen={setOpenCourse}
                                                                selectedValue={field.value}
                                                                onSelect={(value) => form.setValue("courseId", value)}
                                                            />
                                                        </div>
                                                    </DrawerContent>
                                                </Drawer>
                                            )}

                                            <FormDescription className="text-xs">
                                                {!selectedDepartmentId
                                                    ? "Select department first"
                                                    : "Select the course"
                                                }
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name={"title"}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Binary sorting steps..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="files"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Files</FormLabel>
                                        <FormControl>
                                            <FileUploader
                                                value={field.value}
                                                onChange={field.onChange}
                                                folder="notes"
                                                maxFiles={10}
                                                maxSizeMB={10}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Upload your note files (PDF, images, documents, etc.)
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <FormLabel>Resources & Links</FormLabel>
                                        <FormDescription className="text-xs mt-1">
                                            Add external resources or reference links
                                        </FormDescription>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => append({ url: "" })}
                                        className="gap-2 rounded-full"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Add Link
                                    </Button>
                                </div>

                                {fields.length > 0 && (
                                    <div className="space-y-3">
                                        {fields.map((field, index) => (
                                            <FormField
                                                key={field.id}
                                                control={form.control}
                                                name={`resources.${index}.url`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <div className="flex gap-2">
                                                            <FormControl>
                                                                <Input
                                                                    {...field}
                                                                    placeholder="https://example.com/resource"
                                                                    className="flex-1"
                                                                />
                                                            </FormControl>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => remove(index)}
                                                                className="shrink-0"
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    size={"lg"}
                                    className="w-full rounded-full shadow-warm hover:shadow-warm-lg"
                                    disabled={isPending}
                                >
                                    {isPending ? <Loader className="animate-spin" /> : "Share Note"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </>
    )
}
