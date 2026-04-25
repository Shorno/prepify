"use client"
import { Card, CardContent } from "@/components/ui/card";
import {
    ChevronsUpDown,
    Loader,
    Plus,
    X,
    BookOpen,
    GraduationCap,
    FileText,
    Link2,
    Sparkles,
    Check,
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

// --- Step Progress Indicator ---
const STEPS = [
    { label: "Course Info", icon: GraduationCap },
    { label: "Note Details", icon: FileText },
    { label: "References", icon: Link2 },
];

function StepIndicator({ completedSteps }: { completedSteps: boolean[] }) {
    return (
        <div className="flex items-center justify-between mb-8">
            {STEPS.map((step, index) => {
                const isComplete = completedSteps[index];
                const Icon = step.icon;
                return (
                    <React.Fragment key={step.label}>
                        <div className="flex flex-col items-center gap-1.5">
                            <div
                                className={cn(
                                    "w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300",
                                    isComplete
                                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                                        : "bg-muted text-muted-foreground"
                                )}
                            >
                                {isComplete ? (
                                    <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                                ) : (
                                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                                )}
                            </div>
                            <span
                                className={cn(
                                    "text-xs font-medium transition-colors",
                                    isComplete ? "text-primary" : "text-muted-foreground"
                                )}
                            >
                                {step.label}
                            </span>
                        </div>
                        {index < STEPS.length - 1 && (
                            <div className="flex-1 mx-2 sm:mx-4 mb-6">
                                <div className="h-[2px] bg-muted rounded-full overflow-hidden">
                                    <div
                                        className={cn(
                                            "h-full bg-primary transition-all duration-500 ease-out rounded-full",
                                            isComplete ? "w-full" : "w-0"
                                        )}
                                    />
                                </div>
                            </div>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}

// --- Section Header ---
function SectionHeader({ icon: Icon, title, step }: { icon: React.ElementType; title: string; step: string }) {
    return (
        <div className="flex items-center gap-3 pb-1">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-primary" />
            </div>
            <div>
                <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                <p className="text-xs text-muted-foreground">{step}</p>
            </div>
        </div>
    );
}

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
    const watchedTitle = form.watch("title");
    const watchedFiles = form.watch("files");
    const watchedCourseId = form.watch("courseId");
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

    // --- Compute step completion ---
    const completedSteps = [
        !!(selectedDepartmentId && watchedCourseId),       // Step 1: Course Info
        !!(watchedTitle && watchedFiles && watchedFiles.length > 0), // Step 2: Note Details
        true, // Step 3: References (always "complete" since optional)
    ];

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

    // Count filled required fields
    const filledRequired = [selectedDepartmentId, watchedCourseId, watchedTitle, watchedFiles?.length > 0].filter(Boolean).length;

    return (
        <>
            <Card
                className="w-full max-w-2xl rounded-2xl mx-auto shadow-warm-lg border border-border/60 bg-card">
                <CardContent className="p-6 sm:p-8">

                    {/* Step Progress */}
                    <StepIndicator completedSteps={completedSteps} />

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                            {/* ═══════════════════════════════════ */}
                            {/* SECTION 1: Course Information       */}
                            {/* ═══════════════════════════════════ */}
                            <div className="space-y-4">
                                <SectionHeader
                                    icon={GraduationCap}
                                    title="Course Information"
                                    step="Step 1 of 3"
                                />

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">

                                    {/* Department Field */}
                                    <FormField
                                        control={form.control}
                                        name="departmentId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium">Department</FormLabel>

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
                                                <FormLabel className="text-sm font-medium">Course</FormLabel>

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
                            </div>

                            {/* Divider */}
                            <div className="border-t border-border/40" />

                            {/* ═══════════════════════════════════ */}
                            {/* SECTION 2: Note Details              */}
                            {/* ═══════════════════════════════════ */}
                            <div className="space-y-4">
                                <SectionHeader
                                    icon={FileText}
                                    title="Note Details"
                                    step="Step 2 of 3"
                                />

                                {/* Title */}
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium">Title</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g., Binary Search Tree — Insertion & Deletion Steps"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription className="text-xs">
                                                A clear title helps others find your notes
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Description (NEW) */}
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium">
                                                Description
                                                <span className="text-muted-foreground font-normal ml-1">(optional)</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Briefly describe what this note covers, e.g., 'Chapter 5 integration problems with step-by-step solutions and formula derivations'"
                                                    className="resize-none min-h-[80px]"
                                                    maxLength={500}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <div className="flex items-center justify-between">
                                                <FormDescription className="text-xs">
                                                    Help viewers understand your notes before opening
                                                </FormDescription>
                                                <span className={cn(
                                                    "text-xs tabular-nums",
                                                    (watchedDescription?.length || 0) > 450
                                                        ? "text-orange-500"
                                                        : "text-muted-foreground"
                                                )}>
                                                    {watchedDescription?.length || 0}/500
                                                </span>
                                            </div>
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
                                            <FormLabel className="text-sm font-medium">Upload Files</FormLabel>
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
                                                Upload clear photos or PDFs of your handwritten notes — up to 10 files, 10MB each
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* AI Feature Callout */}
                                <div className="flex items-start gap-3 rounded-xl bg-gradient-to-r from-primary/5 to-violet-500/5 border border-primary/10 px-4 py-3">
                                    <div className="rounded-full bg-primary/10 p-1.5 mt-0.5 flex-shrink-0">
                                        <Sparkles className="w-3.5 h-3.5 text-primary" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-medium text-foreground">AI-Powered Explanations</p>
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            After your note is approved, you can generate an AI explanation that analyzes your handwritten content and creates a structured study guide for viewers.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="border-t border-border/40" />

                            {/* ═══════════════════════════════════ */}
                            {/* SECTION 3: References                */}
                            {/* ═══════════════════════════════════ */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <SectionHeader
                                        icon={Link2}
                                        title="References"
                                        step="Step 3 of 3 · Optional"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => append({ url: "" })}
                                        className="gap-1.5 rounded-full text-xs"
                                    >
                                        <Plus className="h-3.5 w-3.5" />
                                        Add Link
                                    </Button>
                                </div>

                                {fields.length === 0 ? (
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 rounded-lg px-4 py-3">
                                        <Info className="w-3.5 h-3.5 flex-shrink-0" />
                                        <span>Add YouTube tutorials, documentation, or other helpful links related to your notes</span>
                                    </div>
                                ) : (
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

                            {/* ═══════════════════════════════════ */}
                            {/* SUBMIT AREA                         */}
                            {/* ═══════════════════════════════════ */}
                            <div className="space-y-4 pt-2">
                                {/* Moderation notice */}
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
                                    <span>Your note will be reviewed by a moderator before being published</span>
                                </div>

                                {/* Completeness indicator + Submit */}
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground sm:flex-1">
                                        <div className="flex gap-1">
                                            {[0, 1, 2, 3].map((i) => (
                                                <div
                                                    key={i}
                                                    className={cn(
                                                        "w-2 h-2 rounded-full transition-colors duration-300",
                                                        i < filledRequired ? "bg-primary" : "bg-muted"
                                                    )}
                                                />
                                            ))}
                                        </div>
                                        <span>{filledRequired}/4 required fields</span>
                                    </div>
                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="w-full sm:w-auto sm:min-w-[200px] rounded-full shadow-warm hover:shadow-warm-lg"
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
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </>
    )
}
