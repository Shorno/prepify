"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm, useWatch} from "react-hook-form"
import {useEffect, useState, useTransition} from "react"
import * as React from "react"
import {ChevronsUpDown, Loader, Check} from "lucide-react"

import {Button} from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {GraduationCap, BookOpen, Info} from "lucide-react"
import {cn} from "@/lib/utils"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Drawer,
    DrawerContent,
    DrawerTrigger,
} from "@/components/ui/drawer"
import ThemeSelector from "@/components/ThemeSelector"
import {useTheme} from "next-themes";
import {onBoardFormData, onBoardSchema} from "@/zodSchema/onBoardSchema";
import updateUserOnboarding from "@/actions/update-user-onboarding";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {useIsMobile} from "@/hooks/use-mobile";
import {DialogTitle} from "@/components/ui/dialog";
import DepartmentList from "@/components/shared/department-list";
import {useQuery} from "@tanstack/react-query";
import {getBatches, getFacultiesWithDepartments} from "@/actions/university-info";


export default function GetStartedForm() {
    const [openDepartment, setOpenDepartment] = useState(false);
    const [openBatch, setOpenBatch] = useState(false);
    const [isPending, startTransition] = useTransition()
    const {theme} = useTheme();
    const router = useRouter();
    const isMobile = useIsMobile();

    const {data} = useQuery({
        queryKey: ["faculties-departments"],
        queryFn: getFacultiesWithDepartments
    })

    const {data: batches} = useQuery({
        queryKey: ["batches"],
        queryFn: getBatches
    })
    console.log(batches)



    const form = useForm<onBoardFormData>({
        resolver: zodResolver(onBoardSchema),
        defaultValues: {
            role: undefined,
            batch: undefined,
            facultyId:undefined,
            departmentId: undefined,
            theme: "system"
        },
    })

    const selectedRole = useWatch({
        control: form.control,
        name: "role",
    });

    useEffect(() => {
        if (theme) {
            form.setValue("theme", theme as "light" | "dark" | "system")
        }
    }, [theme, form])

    useEffect(() => {
        if (selectedRole === "teacher") {
            form.setValue("batch", "");
        }
    }, [selectedRole, form]);

    function onSubmit(values: onBoardFormData) {
        startTransition(async () => {
                try {
                    const result = await updateUserOnboarding(values)
                    if (result.success) {
                        toast.success(result.message)
                        router.replace("/notes")
                    }
                } catch (error) {
                    toast.error("Failed to onboard", {
                        description: error instanceof Error ? error.message : "An unknown error occurred"
                    })
                }
            }
        )
    }

    return (
        <Card
            className="w-full max-w-2xl rounded-md mx-auto shadow-md border-0 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
            <CardHeader className="text-center space-y-4 pb-8">
                <h1 className={"text-2xl font-semibold"}>Prepify</h1>
                <CardTitle
                    className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    Welcome! Let&#39;s Get Started
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
                <div
                    className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                    <Info className="h-4 w-4 text-blue-600 dark:text-blue-400"/>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                        All information can be edited later in your profile settings
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="role"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className="text-base font-medium">I&#39;m joining as a</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            className="grid grid-cols-2 gap-4"
                                            value={field.value}
                                            onValueChange={(value) => {
                                                field.onChange(value);
                                            }}
                                        >
                                            {/* Student Option */}
                                            <div
                                                className="border-input has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/5 dark:has-data-[state=checked]:bg-primary/10 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex cursor-pointer flex-col items-center gap-3 rounded-md border px-4 py-6 text-center shadow-xs transition-[color,box-shadow,background-color,border-color] outline-none has-focus-visible:ring-[3px] hover:bg-accent/50">
                                                <RadioGroupItem
                                                    id="student"
                                                    value="student"
                                                    className="sr-only"
                                                />
                                                <GraduationCap
                                                    className="opacity-60 has-data-[state=checked]:opacity-100 transition-opacity"
                                                    size={24} aria-hidden="true"/>
                                                <label
                                                    htmlFor="student"
                                                    className="text-foreground cursor-pointer text-sm leading-none font-medium after:absolute after:inset-0"
                                                >
                                                    <div className="font-medium">Student</div>
                                                    <div className="text-xs text-muted-foreground mt-1">Share and
                                                        Learn
                                                    </div>
                                                </label>
                                            </div>

                                            {/* Teacher Option */}
                                            <div
                                                className="border-input has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/5 dark:has-data-[state=checked]:bg-primary/10 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex cursor-pointer flex-col items-center gap-3 rounded-md border px-4 py-6 text-center shadow-xs transition-[color,box-shadow,background-color,border-color] outline-none has-focus-visible:ring-[3px] hover:bg-accent/50">
                                                <RadioGroupItem
                                                    id="teacher"
                                                    value="teacher"
                                                    className="sr-only"
                                                />
                                                <BookOpen
                                                    className="opacity-60 has-data-[state=checked]:opacity-100 transition-opacity"
                                                    size={24} aria-hidden="true"/>
                                                <label
                                                    htmlFor="teacher"
                                                    className="text-foreground cursor-pointer text-sm leading-none font-medium after:absolute after:inset-0"
                                                >
                                                    <div className="font-medium">Teacher</div>
                                                    <div className="text-xs text-muted-foreground mt-1">Motivate and
                                                        review
                                                    </div>
                                                </label>
                                            </div>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="departmentId"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className="text-base font-medium">Department</FormLabel>

                                    {/* Responsive Combobox - Desktop Popover */}
                                    {!isMobile ? (
                                        <Popover open={openDepartment} onOpenChange={setOpenDepartment}>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        className={cn(
                                                            "w-full h-12 justify-between text-base",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value != null ? (
                                                            data?.flatMap(f => f.departments)
                                                                .find(dept => dept.id.toString() === field.value)?.name
                                                        ) : (
                                                            "Select your department"
                                                        )}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-full p-0" align="start">
                                                <DepartmentList
                                                    setOpen={setOpenDepartment}
                                                    selectedValue={field.value}
                                                    onSelect={(departmentId, facultyId) => {
                                                        form.setValue("departmentId", departmentId);
                                                        form.setValue("facultyId", facultyId);
                                                    }}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    ) : (
                                        /* Mobile Drawer */
                                        <Drawer open={openDepartment} onOpenChange={setOpenDepartment}>
                                            <DrawerTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        className={cn(
                                                            "w-full h-12 justify-between text-base",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value != null ? (
                                                            data?.flatMap(f => f.departments)
                                                                .find(dept => dept.id.toString() === field.value)?.name
                                                        ) : (
                                                            "Select your department"
                                                        )}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                                    </Button>
                                                </FormControl>
                                            </DrawerTrigger>
                                            <DialogTitle/>
                                            <DrawerContent>
                                                <div className="mt-4 border-t">
                                                    <DepartmentList
                                                        setOpen={setOpenDepartment}
                                                        selectedValue={field.value}
                                                        onSelect={(departmentId, facultyId) => {
                                                            form.setValue("departmentId", departmentId);
                                                            form.setValue("facultyId", facultyId);
                                                        }}
                                                    />
                                                </div>
                                            </DrawerContent>
                                        </Drawer>
                                    )}

                                    <FormDescription>
                                        Select your field of study
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />


                        {/* Conditionally render Batch field only for students - NO ANIMATION */}
                        {selectedRole === "student" && (
                            <FormField
                                control={form.control}
                                name="batch"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className="text-base font-medium">Batch</FormLabel>

                                        {/* Desktop Popover */}
                                        {!isMobile ? (
                                            <Popover open={openBatch} onOpenChange={setOpenBatch}>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            role="combobox"
                                                            className={cn(
                                                                "w-48 h-12 justify-between text-base",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value
                                                                ? batches?.find((batch) => batch.batchCode === field.value)?.name
                                                                : "Select your batch"}
                                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-40 p-0" align="start">
                                                    <Command>
                                                        <CommandInput placeholder="Search batch..."/>
                                                        <CommandList>
                                                            <CommandEmpty>No batch found.</CommandEmpty>
                                                            <CommandGroup>
                                                                {batches?.map((batch) => (
                                                                    <CommandItem
                                                                        className={"flex justify-between"}
                                                                        key={batch.batchCode}
                                                                        value={batch.name}
                                                                        onSelect={() => {
                                                                            form.setValue("batch", batch.batchCode)
                                                                            setOpenBatch(false)
                                                                        }}
                                                                    >
                                                                        {batch.name}
                                                                        <Check
                                                                            className={cn(
                                                                                "mr-2 h-4 w-4",
                                                                                field.value === batch.batchCode
                                                                                    ? "opacity-100"
                                                                                    : "opacity-0"
                                                                            )}
                                                                        />
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                        ) : (
                                            /* Mobile Drawer */
                                            <Drawer open={openBatch} onOpenChange={setOpenBatch}>
                                                <DrawerTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            role="combobox"
                                                            className={cn(
                                                                "w-full h-12 justify-between text-base",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value
                                                                ? batches?.find((batch) => batch.batchCode === field.value)?.name
                                                                : "Select your batch"}
                                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                                        </Button>
                                                    </FormControl>
                                                </DrawerTrigger>
                                                <DialogTitle/>
                                                <DrawerContent>
                                                    <div className="mt-4 border-t">
                                                        <Command>
                                                            <CommandInput placeholder="Search batch..."/>
                                                            <CommandList>
                                                                <CommandEmpty>No batch found.</CommandEmpty>
                                                                <CommandGroup>
                                                                    {batches?.map((batch) => (
                                                                        <CommandItem
                                                                            key={batch.batchCode}
                                                                            value={batch.name}
                                                                            onSelect={() => {
                                                                                form.setValue("batch", batch.batchCode)
                                                                                setOpenBatch(false)
                                                                            }}
                                                                        >
                                                                            <Check
                                                                                className={cn(
                                                                                    "mr-2 h-4 w-4",
                                                                                    field.value === batch.batchCode
                                                                                        ? "opacity-100"
                                                                                        : "opacity-0"
                                                                                )}
                                                                            />
                                                                            {batch.name}
                                                                        </CommandItem>
                                                                    ))}
                                                                </CommandGroup>
                                                            </CommandList>
                                                        </Command>
                                                    </div>
                                                </DrawerContent>
                                            </Drawer>
                                        )}

                                        <FormDescription>
                                            Select your batch year and section
                                        </FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        )}

                        <ThemeSelector control={form.control} name="theme"/>

                        <div className="pt-4">
                            <Button
                                type="submit"
                                size={"lg"}
                                className={"w-full"}
                            >
                                {isPending ? <Loader/> : "Get Started"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
