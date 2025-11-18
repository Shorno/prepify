"use client"
import {Card, CardContent} from "@/components/ui/card";
import {ChevronsUpDown, Loader, Plus, X} from "lucide-react";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import DepartmentList from "@/components/shared/department-list";
import {Drawer, DrawerContent, DrawerTrigger} from "@/components/ui/drawer";
import {DialogTitle} from "@/components/ui/dialog";
import * as React from "react";
import {useState, useTransition} from "react";
import {useRouter} from "next/navigation";
import {useIsMobile} from "@/hooks/use-mobile";
import {useFieldArray, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "sonner";
import {noteFormData, noteSchema} from "@/zodSchema/noteSchema";
import {Input} from "@/components/ui/input";
import FileUploader from "@/components/file-uploader";
import {useQuery} from "@tanstack/react-query";
import {getCoursesByDepartment, getFacultiesWithDepartments} from "@/actions/university-info";
import CourseList from "@/components/shared/course-list";
import {authClient} from "@/lib/auth-client";

export default function NewNoteForm() {
    const {data: sessionData} = authClient.useSession()

    console.log(sessionData)

    const [open, setOpen] = useState(false);
    const [openCourse, setOpenCourse] = useState(false);

    const [isPending, startTransition] = useTransition()
    const router = useRouter();
    const isMobile = useIsMobile();

    const {data} = useQuery({
        queryKey: ["faculties-departments"],
        queryFn: getFacultiesWithDepartments
    })
    console.log(data)


    const form = useForm<noteFormData>({
        resolver: zodResolver(noteSchema),
        defaultValues: {
            department: "cse",
            courseId: undefined,
            title: "",
            files: [],
            resources:  [],
        },
    })

    const {fields, append, remove} = useFieldArray({
        control : form.control,
        name : "resources"
    })

    const selectedDepartment = form.watch("department");
    console.log(selectedDepartment)

    const departmentId = data?.flatMap(f => f.departments)
        .find(dept => dept.departmentCode === selectedDepartment)?.id;

    const {data: courses, isLoading} = useQuery({
        queryKey: ["department-courses", departmentId],
        queryFn: () => getCoursesByDepartment(departmentId!),
        enabled: !!departmentId,
    })


    function onSubmit(values: noteFormData) {
        startTransition(async () => {
                try {
                    console.log(values)
                    // values.files will contain array of Cloudinary URLs
                } catch (error) {
                    toast.error("There was an error. Please try again.")
                }
            }
        )
    }

    return (
        <>
            <Card
                className="w-full max-w-2xl rounded-md mx-auto shadow-md border-0 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
                <CardContent className="space-y-6">

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                            {/* Grid container for Department and Course */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">

                                {/* Department Field */}
                                <FormField
                                    control={form.control}
                                    name="department"
                                    render={({field}) => (
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
                                                    ? data?.flatMap(f => f.departments)
                                                        .find(dept => dept.departmentCode === field.value)?.name
                                                    : "Select department"
                                                }
                                            </span>
                                                                <ChevronsUpDown
                                                                    className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent
                                                        className="w-full p-0"
                                                        align="start"
                                                        style={{width: 'var(--radix-popover-trigger-width)'}}
                                                    >
                                                        <DepartmentList
                                                            setOpen={setOpen}
                                                            selectedValue={field.value}
                                                            onSelect={(value) => form.setValue("department", value)}
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
                                                    ? data?.flatMap(f => f.departments)
                                                        .find(dept => dept.departmentCode === field.value)?.name
                                                    : "Select department"
                                                }
                                            </span>
                                                                <ChevronsUpDown
                                                                    className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                                            </Button>
                                                        </FormControl>
                                                    </DrawerTrigger>
                                                    <DialogTitle/>
                                                    <DrawerContent>
                                                        <div className="mt-4 border-t">
                                                            <DepartmentList
                                                                setOpen={setOpen}
                                                                selectedValue={field.value}
                                                                onSelect={(value) => form.setValue("department", value)}
                                                            />
                                                        </div>
                                                    </DrawerContent>
                                                </Drawer>
                                            )}

                                            <FormDescription className="text-xs">
                                                Select your department
                                            </FormDescription>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                {/* Course Field */}
                                <FormField
                                    control={form.control}
                                    name="courseId"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="text-base font-medium">Course</FormLabel>

                                            {!isMobile ? (
                                                <Popover open={openCourse} onOpenChange={setOpenCourse}>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant="outline"
                                                                role="combobox"
                                                                disabled={!selectedDepartment || isLoading}
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
                                                                    className="ml-2 h-4 w-4 shrink-0 opacity-50"/>


                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent
                                                        className="w-full p-0"
                                                        align="start"
                                                        style={{width: 'var(--radix-popover-trigger-width)'}}
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
                                                                disabled={!selectedDepartment || isLoading}
                                                                className={cn(
                                                                    "w-full justify-between text-xs",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                {isLoading ? (
                                                                    <>
                                                                        <Loader className="h-4 w-4 animate-spin mr-2"/>
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
                                                                            className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                                                    </>
                                                                )}
                                                            </Button>
                                                        </FormControl>
                                                    </DrawerTrigger>
                                                    <DialogTitle/>
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
                                                {!selectedDepartment
                                                    ? "Select department first"
                                                    : "Select the course"
                                                }
                                            </FormDescription>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>


                            <FormField
                                control={form.control}
                                name={"title"}
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Binary sorting steps..." {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />


                            {/* Updated file uploader with form integration */}
                            <FormField
                                control={form.control}
                                name="files"
                                render={({field}) => (
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
                                        <FormMessage/>
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
                                        className="gap-2"
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
                                    className={"w-full"}
                                    disabled={isPending}
                                >
                                    {isPending ? <Loader className="animate-spin"/> : "Share Note"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </>
    )
}
