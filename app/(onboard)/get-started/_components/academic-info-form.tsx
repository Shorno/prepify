"use client"

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Control, useWatch, UseFormSetValue } from "react-hook-form"
import { onBoardFormData } from "@/zodSchema/onBoardSchema"
import { Building, Calendar, ChevronsUpDown } from "lucide-react"
import DepartmentList from "@/components/shared/department-list"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { getFacultiesWithDepartments, getBatches } from "@/actions/university-info"
import { DialogTitle } from "@/components/ui/dialog"
import BatchList from "@/components/shared/batch-list"

interface AcademicInfoFormProps {
    control: Control<onBoardFormData>
    setValue: UseFormSetValue<onBoardFormData>
}

export default function AcademicInfoForm({ control, setValue }: AcademicInfoFormProps) {
    const [openDepartment, setOpenDepartment] = useState(false)
    const [openBatch, setOpenBatch] = useState(false)
    const isMobile = useIsMobile()

    const role = useWatch({ control, name: "role" })

    const { data: faculties } = useQuery({
        queryKey: ["faculties-departments"],
        queryFn: getFacultiesWithDepartments
    })

    const { data: batches, isLoading: isLoadingBatches } = useQuery({
        queryKey: ["batches"],
        queryFn: getBatches
    })

    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center">
                <h2 className="text-2xl font-bold tracking-tight">Academic Information</h2>
                <p className="text-muted-foreground">
                    Tell us about your academic background
                </p>
            </div>

            <div className="space-y-4">
                {/* Department Field */}
                <FormField
                    control={control}
                    name="departmentId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-2">
                                <Building className="h-4 w-4" />
                                Department
                            </FormLabel>
                            <FormControl>
                                {!isMobile ? (
                                    <Popover open={openDepartment} onOpenChange={setOpenDepartment}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn(
                                                    "w-full h-11 justify-between",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value
                                                    ? faculties?.flatMap(f => f.departments)
                                                        .find(dept => dept.id.toString() === field.value)?.name
                                                    : "Select your department"}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0" align="start">
                                            <DepartmentList
                                                setOpen={setOpenDepartment}
                                                selectedValue={field.value}
                                                onSelect={(departmentId, facultyId) => {
                                                    field.onChange(departmentId)
                                                    setValue("facultyId", facultyId)
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                ) : (
                                    <Drawer open={openDepartment} onOpenChange={setOpenDepartment}>
                                        <DrawerTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn(
                                                    "w-full h-11 justify-between",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value
                                                    ? faculties?.flatMap(f => f.departments)
                                                        .find(dept => dept.id.toString() === field.value)?.name
                                                    : "Select your department"}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </DrawerTrigger>
                                        <DrawerContent>
                                            <DialogTitle className="sr-only">Select Department</DialogTitle>
                                            <div className="mt-4 border-t">
                                                <DepartmentList
                                                    setOpen={setOpenDepartment}
                                                    selectedValue={field.value}
                                                    onSelect={(departmentId, facultyId) => {
                                                        field.onChange(departmentId)
                                                        setValue("facultyId", facultyId)
                                                    }}
                                                />
                                            </div>
                                        </DrawerContent>
                                    </Drawer>
                                )}
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Batch Field - Only for Students */}
                {role === "student" && (
                    <FormField
                        control={control}
                        name="batch"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    Batch
                                </FormLabel>
                                <FormControl>
                                    {!isMobile ? (
                                        <Popover open={openBatch} onOpenChange={setOpenBatch}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        "w-full h-11 justify-between",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value
                                                        ? batches?.find(batch => batch.id.toString() === field.value)?.name
                                                        : "Select your batch"}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-full p-0" align="start">
                                                <BatchList
                                                    batches={batches}
                                                    isLoading={isLoadingBatches}
                                                    setOpen={setOpenBatch}
                                                    selectedValue={field.value}
                                                    onSelect={field.onChange}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    ) : (
                                        <Drawer open={openBatch} onOpenChange={setOpenBatch}>
                                            <DrawerTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        "w-full h-11 justify-between",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value
                                                        ? batches?.find(batch => batch.id.toString() === field.value)?.name
                                                        : "Select your batch"}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </DrawerTrigger>
                                            <DrawerContent>
                                                <DialogTitle className="sr-only">Select Batch</DialogTitle>
                                                <div className="mt-4 border-t">
                                                    <BatchList
                                                        batches={batches}
                                                        isLoading={isLoadingBatches}
                                                        setOpen={setOpenBatch}
                                                        selectedValue={field.value}
                                                        onSelect={field.onChange}
                                                    />
                                                </div>
                                            </DrawerContent>
                                        </Drawer>
                                    )}
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
            </div>
        </div>
    )
}

