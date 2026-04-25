"use client"
import { Card, CardContent } from "@/components/ui/card";
import {
    ChevronsUpDown,
    Loader,
    Plus,
    X,
    BookOpen,
    Sparkles,
    Info,
    ShieldCheck,
} from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";

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
            description: "",
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
    const watchedDescription = form.watch("description");

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
        <Card className="w-full max-w-2xl rounded-2xl mx-auto shadow-warm-lg border border-border/60 bg-card">
            <CardContent className="p-5 sm:p-7">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

                        {/* Department & Course — side by side */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            {/* Department */}
                            <FormField
                                control={form.control}
                                name="departmentId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Department</FormLabel>

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
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Course */}
                            <FormField
                                control={form.control}
                                name="courseId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Course</FormLabel>

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
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Title */}
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g., Binary Search Tree — Insertion & Deletion Steps"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Description */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-center justify-between">
                                        <FormLabel>
                                            Description
                                            <span className="text-muted-foreground font-normal ml-1">(optional)</span>
                                        </FormLabel>
                                        <span className={cn(
                                            "text-[11px] tabular-nums",
                                            (watchedDescription?.length || 0) > 450
                                                ? "text-orange-500"
                                                : "text-muted-foreground"
                                        )}>
                                            {watchedDescription?.length || 0}/500
                                        </span>
                                    </div>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Briefly describe what this note covers..."
                                            className="resize-none min-h-[72px]"
                                            maxLength={500}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Files */}
                        <FormField
                            control={form.control}
                            name="files"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Upload Files</FormLabel>
                                    <FormControl>
                                        <FileUploader
                                            value={field.value}
                                            onChange={field.onChange}
                                            folder="notes"
                                            maxFiles={10}
                                            maxSizeMB={10}
                                        />
                                    </FormControl>
                                    <FormDescription className="text-xs">
                                        Clear photos or PDFs of your handwritten notes · Up to 10 files, 10MB each
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* AI callout — compact inline */}
                        <div className="flex items-center gap-2.5 rounded-lg bg-primary/[0.04] border border-primary/10 px-3.5 py-2.5">
                            <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
                            <p className="text-xs text-muted-foreground">
                                <span className="font-medium text-foreground">AI Explanations</span> — After approval, generate an AI-powered study guide from your notes
                            </p>
                        </div>

                        {/* Resources */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <FormLabel>
                                    Reference Links
                                    <span className="text-muted-foreground font-normal ml-1">(optional)</span>
                                </FormLabel>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => append({ url: "" })}
                                    className="gap-1 text-xs h-7 px-2.5 text-muted-foreground hover:text-foreground"
                                >
                                    <Plus className="h-3.5 w-3.5" />
                                    Add
                                </Button>
                            </div>

                            {fields.length === 0 ? (
                                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 rounded-lg px-3.5 py-2.5">
                                    <Info className="w-3.5 h-3.5 flex-shrink-0" />
                                    <span>Add YouTube videos, docs, or helpful links related to your notes</span>
                                </div>
                            ) : (
                                <div className="space-y-2">
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
                                                                className="flex-1 h-9"
                                                            />
                                                        </FormControl>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => remove(index)}
                                                            className="shrink-0 h-9 w-9"
                                                        >
                                                            <X className="h-3.5 w-3.5" />
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

                        {/* Submit area */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1 border-t border-border/40">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground sm:flex-1">
                                <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
                                <span>Reviewed by a moderator before publishing</span>
                            </div>
                            <Button
                                type="submit"
                                size="lg"
                                className="w-full sm:w-auto sm:min-w-[180px] rounded-full shadow-warm hover:shadow-warm-lg"
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <>
                                        <Loader className="animate-spin mr-2" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <BookOpen className="w-4 h-4 mr-2" />
                                        Share Note
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
