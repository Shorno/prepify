"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { ChevronsUpDown, Loader, User, GraduationCap, Palette, Sun, Moon, Monitor } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import DepartmentList from "@/components/shared/department-list";
import { getBatches, getFacultiesWithDepartments } from "@/actions/university-info";
import { userSettingsSchema, UserSettingsFormData } from "@/zodSchema/userSettingsSchema";
import { updateUserSettings } from "@/actions/user/update-user-settings";

interface UserData {
    id: string;
    name: string;
    email: string;
    image: string | null;
    username: string;
    role: "student" | "teacher";
    departmentId: string;
    facultyId: string;
    batch: string;
}

interface SettingsFormProps {
    user: UserData;
}

export default function SettingsForm({ user }: SettingsFormProps) {
    const [isPending, startTransition] = useTransition();
    const [openDepartment, setOpenDepartment] = useState(false);
    const [openBatch, setOpenBatch] = useState(false);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const isMobile = useIsMobile();
    const { theme, setTheme } = useTheme();

    // Prevent hydration mismatch for theme
    useEffect(() => {
        setMounted(true);
    }, []);

    const form = useForm<UserSettingsFormData>({
        resolver: zodResolver(userSettingsSchema),
        defaultValues: {
            username: user.username || "",
            departmentId: user.departmentId || "",
            facultyId: user.facultyId || "",
            batch: user.batch || "",
        },
    });

    const selectedDepartmentId = form.watch("departmentId");

    // Fetch faculties with TanStack Query
    const { data: faculties } = useQuery({
        queryKey: ["faculties-departments"],
        queryFn: getFacultiesWithDepartments,
    });

    // Fetch batches with TanStack Query
    const { data: batches } = useQuery({
        queryKey: ["batches"],
        queryFn: getBatches,
    });

    // Auto-set faculty when department changes
    useEffect(() => {
        if (selectedDepartmentId && faculties) {
            const faculty = faculties.find((f) =>
                f.departments.some((d) => d.id.toString() === selectedDepartmentId)
            );
            if (faculty) {
                form.setValue("facultyId", faculty.id.toString());
            }
        }
    }, [selectedDepartmentId, faculties, form]);

    const selectedDepartment = faculties
        ?.flatMap((f) => f.departments)
        .find((dept) => dept.id.toString() === selectedDepartmentId);

    const selectedBatch = batches?.find(
        // eslint-disable-next-line react-hooks/incompatible-library
        (b) => b.batchCode === form.watch("batch")
    );

    const userInitials = user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();

    function onSubmit(values: UserSettingsFormData) {
        console.log("Form values being submitted:", values);
        startTransition(async () => {
            const result = await updateUserSettings(values);
            console.log("Update result:", result);

            if (result.success) {
                toast.success(result.message);
                router.refresh();
            } else {
                toast.error(result.error || result.message);
            }
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-2xl mx-auto space-y-6">
                {/* Account Section */}
                <Card className="rounded-2xl shadow-warm-lg border border-border/60">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <User className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Account</CardTitle>
                                <CardDescription>Your profile information</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Avatar Preview */}
                        <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16 ring-4 ring-border">
                                <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name} />
                                <AvatarFallback className="text-lg font-bold bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                                    {userInitials}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold text-lg">{user.name}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                        </div>

                        {/* Username */}
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="your_username"
                                            {...field}
                                            className="rounded-lg"
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        3-20 characters, letters, numbers, and underscores only
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                {/* Academic Section */}
                <Card className="rounded-2xl shadow-warm-lg border border-border/60">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                                <GraduationCap className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Academic Information</CardTitle>
                                <CardDescription>Your department and batch details</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Department */}
                        <FormField
                            control={form.control}
                            name="departmentId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Department</FormLabel>
                                    {!isMobile ? (
                                        <Popover open={openDepartment} onOpenChange={setOpenDepartment}>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        role="combobox"
                                                        className={cn(
                                                            "w-full justify-between rounded-lg",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <span className="line-clamp-1 text-left flex-1">
                                                            {field.value
                                                                ? selectedDepartment?.name
                                                                : "Select department"}
                                                        </span>
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                className="w-full p-0"
                                                align="start"
                                                style={{ width: "var(--radix-popover-trigger-width)" }}
                                            >
                                                <DepartmentList
                                                    setOpen={setOpenDepartment}
                                                    selectedValue={field.value}
                                                    onSelect={(departmentId) => {
                                                        form.setValue("departmentId", departmentId);
                                                    }}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    ) : (
                                        <Drawer open={openDepartment} onOpenChange={setOpenDepartment}>
                                            <DrawerTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        role="combobox"
                                                        className={cn(
                                                            "w-full justify-between rounded-lg",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <span className="line-clamp-1 text-left flex-1">
                                                            {field.value
                                                                ? selectedDepartment?.name
                                                                : "Select department"}
                                                        </span>
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </DrawerTrigger>
                                            <DialogTitle />
                                            <DrawerContent>
                                                <div className="mt-4 border-t">
                                                    <DepartmentList
                                                        setOpen={setOpenDepartment}
                                                        selectedValue={field.value}
                                                        onSelect={(departmentId) => {
                                                            form.setValue("departmentId", departmentId);
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

                        {/* Batch (for students) */}
                        {user.role === "student" && (
                            <FormField
                                control={form.control}
                                name="batch"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Batch</FormLabel>
                                        {!isMobile ? (
                                            <Popover open={openBatch} onOpenChange={setOpenBatch}>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            role="combobox"
                                                            className={cn(
                                                                "w-full justify-between rounded-lg",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value
                                                                ? selectedBatch?.name || field.value
                                                                : "Select batch"}
                                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent
                                                    className="w-full p-0"
                                                    align="start"
                                                    style={{ width: "var(--radix-popover-trigger-width)" }}
                                                >
                                                    <div className="max-h-60 overflow-y-auto p-1">
                                                        {batches?.map((b) => (
                                                            <Button
                                                                key={b.id}
                                                                type="button"
                                                                variant="ghost"
                                                                className={cn(
                                                                    "w-full justify-start",
                                                                    field.value === b.batchCode && "bg-accent"
                                                                )}
                                                                onClick={() => {
                                                                    form.setValue("batch", b.batchCode);
                                                                    setOpenBatch(false);
                                                                }}
                                                            >
                                                                {b.name}
                                                            </Button>
                                                        ))}
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        ) : (
                                            <Drawer open={openBatch} onOpenChange={setOpenBatch}>
                                                <DrawerTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            role="combobox"
                                                            className={cn(
                                                                "w-full justify-between rounded-lg",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value
                                                                ? selectedBatch?.name || field.value
                                                                : "Select batch"}
                                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </DrawerTrigger>
                                                <DialogTitle />
                                                <DrawerContent>
                                                    <div className="mt-4 border-t max-h-60 overflow-y-auto p-1">
                                                        {batches?.map((b) => (
                                                            <Button
                                                                key={b.id}
                                                                type="button"
                                                                variant="ghost"
                                                                className={cn(
                                                                    "w-full justify-start",
                                                                    field.value === b.batchCode && "bg-accent"
                                                                )}
                                                                onClick={() => {
                                                                    form.setValue("batch", b.batchCode);
                                                                    setOpenBatch(false);
                                                                }}
                                                            >
                                                                {b.name}
                                                            </Button>
                                                        ))}
                                                    </div>
                                                </DrawerContent>
                                            </Drawer>
                                        )}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                    </CardContent>
                </Card>

                {/* Appearance Section */}
                <Card className="rounded-2xl shadow-warm-lg border border-border/60">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                                <Palette className="w-5 h-5 text-violet-600" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Appearance</CardTitle>
                                <CardDescription>Customize your experience</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Theme</label>
                            {!mounted ? (
                                <div className="flex gap-2">
                                    <div className="flex-1 h-10 bg-muted animate-pulse rounded-lg" />
                                    <div className="flex-1 h-10 bg-muted animate-pulse rounded-lg" />
                                    <div className="flex-1 h-10 bg-muted animate-pulse rounded-lg" />
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant={theme === "light" ? "default" : "outline"}
                                        className="flex-1 gap-2 rounded-lg"
                                        onClick={() => setTheme("light")}
                                    >
                                        <Sun className="w-4 h-4" />
                                        Light
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={theme === "dark" ? "default" : "outline"}
                                        className="flex-1 gap-2 rounded-lg"
                                        onClick={() => setTheme("dark")}
                                    >
                                        <Moon className="w-4 h-4" />
                                        Dark
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={theme === "system" ? "default" : "outline"}
                                        className="flex-1 gap-2 rounded-lg"
                                        onClick={() => setTheme("system")}
                                    >
                                        <Monitor className="w-4 h-4" />
                                        System
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Save Button */}
                <div className="pt-4">
                    <Button
                        type="submit"
                        size="lg"
                        className="w-full rounded-full shadow-warm hover:shadow-warm-lg"
                        disabled={isPending}
                    >
                        {isPending ? <Loader className="animate-spin" /> : "Save Changes"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
