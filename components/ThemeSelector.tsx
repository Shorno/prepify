"use client"

import {useId} from "react"
import {CheckIcon, MinusIcon, Palette} from "lucide-react"
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group"
import Image from "next/image"
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {Control, FieldPath, FieldValues} from "react-hook-form"
import {useTheme} from "next-themes"

const items = [
    {value: "light", label: "Light", image: "/images/light.png"},
    {value: "dark", label: "Dark", image: "/images/dark.png"},
    {value: "system", label: "System", image: "/images/system.png"},
]

interface ThemeSelectorProps<T extends FieldValues> {
    control: Control<T>
    name: FieldPath<T>
}

export default function ThemeSelector<T extends FieldValues>({control, name}: ThemeSelectorProps<T>) {
    const id = useId()
    const { setTheme} = useTheme()


    return (
        <FormField
            control={control}
            name={name}
            render={({field}) => (
                <FormItem>
                    <FormLabel className="text-base font-medium flex items-center gap-2">
                        <Palette className="h-4 w-4"/>
                        Theme Preference
                    </FormLabel>
                    <FormControl>
                        <fieldset className="space-y-4">
                            <legend className="sr-only">Choose a theme</legend>
                            <RadioGroup
                                className="flex gap-3"
                                value={field.value} // Use fallback until mounted
                                onValueChange={(value) => {
                                    field.onChange(value)
                                    setTheme(value)
                                }}
                            >
                                {items.map((item) => (
                                    <label key={`${id}-${item.value}`}>
                                        <RadioGroupItem
                                            id={`${id}-${item.value}`}
                                            value={item.value}
                                            className="peer sr-only after:absolute after:inset-0"
                                        />
                                        <Image
                                            src={item.image}
                                            alt={item.label}
                                            width={88}
                                            height={70}
                                            className="border-input peer-focus-visible:ring-ring/50 peer-data-[state=checked]:border-ring peer-data-[state=checked]:bg-accent relative cursor-pointer overflow-hidden rounded-md border shadow-xs transition-[color,box-shadow] outline-none peer-focus-visible:ring-[3px] peer-data-disabled:cursor-not-allowed peer-data-disabled:opacity-50"
                                        />
                                        <span className="group peer-data-[state=unchecked]:text-muted-foreground/70 mt-2 flex items-center gap-1">
                                            <CheckIcon
                                                size={16}
                                                className="group-peer-data-[state=unchecked]:hidden"
                                                aria-hidden="true"
                                            />
                                            <MinusIcon
                                                size={16}
                                                className="group-peer-data-[state=checked]:hidden"
                                                aria-hidden="true"
                                            />
                                            <span className="text-xs font-medium">{item.label}</span>
                                        </span>
                                    </label>
                                ))}
                            </RadioGroup>
                        </fieldset>
                    </FormControl>
                    <FormDescription>
                        Choose how you&#39;d like the interface to look
                    </FormDescription>
                    <FormMessage/>
                </FormItem>
            )}
        />
    )
}
