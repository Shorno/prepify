"use client"

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Control } from "react-hook-form"
import { onBoardFormData } from "@/zodSchema/onBoardSchema"
import { GraduationCap, Users } from "lucide-react"
import { Label } from "@/components/ui/label"

interface RoleFormProps {
    control: Control<onBoardFormData>
}

export default function RoleForm({ control }: RoleFormProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center">
                <h2 className="text-2xl font-bold tracking-tight">What&#39;s Your Role?</h2>
                <p className="text-muted-foreground">
                    Help us personalize your experience
                </p>
            </div>

            <FormField
                control={control}
                name="role"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-base font-medium">
                            Select Your Role
                        </FormLabel>
                        <FormControl>
                            <RadioGroup
                                onValueChange={field.onChange}
                                value={field.value}
                                className="grid grid-cols-2 gap-4 pt-2"
                            >
                                <div>
                                    <RadioGroupItem
                                        value="student"
                                        id="student"
                                        className="peer sr-only"
                                    />
                                    <Label
                                        htmlFor="student"
                                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-6 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                                    >
                                        <GraduationCap className="mb-3 h-8 w-8" />
                                        <span className="text-sm font-medium">Student</span>
                                    </Label>
                                </div>

                                <div>
                                    <RadioGroupItem
                                        value="teacher"
                                        id="teacher"
                                        className="peer sr-only"
                                    />
                                    <Label
                                        htmlFor="teacher"
                                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-6 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                                    >
                                        <Users className="mb-3 h-8 w-8" />
                                        <span className="text-sm font-medium">Teacher</span>
                                    </Label>
                                </div>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
}

