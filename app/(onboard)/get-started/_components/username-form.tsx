"use client"

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Control } from "react-hook-form"
import { onBoardFormData } from "@/zodSchema/onBoardSchema"
import { User } from "lucide-react"

interface UsernameFormProps {
    control: Control<onBoardFormData>
}

export default function UsernameForm({ control }: UsernameFormProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center">
                <h2 className="text-2xl font-bold tracking-tight">Choose Your Username</h2>
                <p className="text-muted-foreground">
                    This will be your unique identifier on the platform
                </p>
            </div>

            <FormField
                control={control}
                name="username"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Username
                        </FormLabel>
                        <FormControl>
                            <Input
                                placeholder="Enter your username"
                                {...field}
                                className="h-11"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
}
