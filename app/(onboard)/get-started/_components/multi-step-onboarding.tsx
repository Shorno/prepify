"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {useTransition, useEffect, useCallback, useState} from "react"
import {useRouter} from "next/navigation"
import {toast} from "sonner"
import {Loader2, ChevronLeft, ChevronRight} from "lucide-react"

import {Form} from "@/components/ui/form"
import {Button} from "@/components/ui/button"
import {onBoardFormData, onBoardSchema} from "@/zodSchema/onBoardSchema"
import {useOnboardingStore} from "@/store/onboarding-store"
import updateUserOnboarding from "@/actions/update-user-onboarding"

import UsernameForm from "./username-form"
import RoleForm from "./role-form"
import AcademicInfoForm from "./academic-info-form"
import ThemeForm from "./theme-form"

const TOTAL_STEPS = 4

export default function MultiStepOnboarding() {
    const [isPending, startTransition] = useTransition()
    const [isValidating, setIsValidating] = useState(false)
    const router = useRouter()
    const {formData, updateFormData, currentStep, setCurrentStep} = useOnboardingStore()

    const form = useForm<onBoardFormData>({
        resolver: zodResolver(onBoardSchema),
        mode: "onChange",
        defaultValues: {
            username: formData.username || "",
            role: formData.role,
            departmentId: formData.departmentId || "",
            facultyId: formData.facultyId || "",
            batch: formData.batch || "",
            theme: formData.theme || "system"
        },
    })

    useEffect(() => {
        // eslint-disable-next-line react-hooks/incompatible-library
        const subscription = form.watch((value) => {
            updateFormData(value as Partial<onBoardFormData>)
        })
        return () => subscription.unsubscribe()
    }, [form, updateFormData])

    const validateCurrentStep = useCallback(async (): Promise<boolean> => {
        let fieldsToValidate: (keyof onBoardFormData)[] = []

        switch (currentStep) {
            case 0:
                fieldsToValidate = ["username"]
                break
            case 1:
                fieldsToValidate = ["role"]
                break
            case 2:
                fieldsToValidate = ["departmentId", "facultyId"]
                const role = form.getValues("role")
                if (role === "student") {
                    fieldsToValidate.push("batch")
                }
                break
            case 3:
                fieldsToValidate = ["theme"]
                break
        }

        const isValid = await form.trigger(fieldsToValidate)

        if (!isValid) {
            toast.error("Please complete all required fields")
        }

        return isValid
    }, [currentStep, form])

    const handleNext = useCallback(async () => {
        setIsValidating(true)
        const isValid = await validateCurrentStep()
        setIsValidating(false)

        if (!isValid) {
            return
        }

        if (currentStep < TOTAL_STEPS - 1) {
            setCurrentStep(currentStep + 1)
        } else {
            startTransition(async () => {
                try {
                    const values = form.getValues()
                    const result = await updateUserOnboarding(values)

                    if (result.success) {
                        toast.success(result.message)
                        router.replace("/notes")
                    } else {
                        toast.error(result.message)
                    }
                } catch (error) {
                    toast.error("Failed to complete onboarding", {
                        description: error instanceof Error ? error.message : "An unknown error occurred"
                    })
                }
            })
        }
    }, [currentStep, setCurrentStep, validateCurrentStep, form, router])

    const handleBack = useCallback(() => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
        }
    }, [currentStep, setCurrentStep])

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return <UsernameForm control={form.control}/>
            case 1:
                return <RoleForm control={form.control}/>
            case 2:
                return <AcademicInfoForm control={form.control} setValue={form.setValue}/>
            case 3:
                return <ThemeForm control={form.control}/>
            default:
                return null
        }
    }

    const renderStepIndicators = () => {
        return (
            <div className="flex items-center justify-center w-full mb-8 sm:mb-12">
                {Array.from({length: TOTAL_STEPS}).map((_, index) => (
                    <div key={index} className="flex items-center">
                        <div
                            className={`
                                w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center
                                text-sm sm:text-base font-semibold transition-all
                                ${index <= currentStep
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground'}
                                ${index < currentStep ? 'opacity-100' : ''}
                            `}
                        >
                            {index + 1}
                        </div>
                        {index < TOTAL_STEPS - 1 && (
                            <div
                                className={`
                                    w-12 sm:w-16 md:w-24 h-1 mx-2 transition-all
                                    ${index < currentStep ? 'bg-primary' : 'bg-muted'}
                                `}
                            />
                        )}
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
            <div className="text-center space-y-3 sm:space-y-4 mb-8 sm:mb-12">
                <h1 className="text-xl sm:text-2xl font-semibold">Prepify</h1>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Let&#39;s
                    Get Started
                </h2>
            </div>

            <Form {...form}>
                <form onSubmit={(e) => e.preventDefault()}>
                    {renderStepIndicators()}

                    <div className="min-h-[400px] mb-8">
                        {renderStepContent()}
                    </div>

                    <div
                        className={`flex ${currentStep > 0 ? 'justify-between' : 'justify-end'} items-center pt-6 border-t`}>
                        {currentStep > 0 && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleBack}
                                disabled={isPending || isValidating}
                                className="min-w-24"
                            >
                                <ChevronLeft className="h-4 w-4 mr-1"/>
                                Back
                            </Button>
                        )}

                        <Button
                            type="button"
                            onClick={handleNext}
                            disabled={isPending || isValidating}
                            className="min-w-24"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin"/>
                                    Processing...
                                </>
                            ) : isValidating ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin"/>
                                    Validating...
                                </>
                            ) : currentStep === TOTAL_STEPS - 1 ? (
                                "Complete"
                            ) : (
                                <>
                                    Next
                                    <ChevronRight className="h-4 w-4 ml-1"/>
                                </>
                            )}
                        </Button>
                    </div>

                    {isPending && (
                        <div className="flex justify-center items-center py-4 sm:py-6">
                            <Loader2 className="h-6 w-6 animate-spin text-primary"/>
                            <span className="ml-2 text-sm sm:text-base text-muted-foreground">
                                Completing your setup...
                            </span>
                        </div>
                    )}
                </form>
            </Form>
        </div>
    )
}

