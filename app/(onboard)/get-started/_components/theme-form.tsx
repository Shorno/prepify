"use client"

import { Control } from "react-hook-form"
import { onBoardFormData } from "@/zodSchema/onBoardSchema"
import ThemeSelector from "@/components/ThemeSelector"

interface ThemeFormProps {
    control: Control<onBoardFormData>
}

export default function ThemeForm({ control }: ThemeFormProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center">
                <h2 className="text-2xl font-bold tracking-tight">Choose Your Theme</h2>
                <p className="text-muted-foreground">
                    Customize the look and feel of your workspace
                </p>
            </div>

            <ThemeSelector control={control} name="theme" />
        </div>
    )
}

