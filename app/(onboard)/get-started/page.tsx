import MultiStepOnboarding from "@/app/(onboard)/get-started/_components/multi-step-onboarding";

export default async function GetStartedPage() {

    return (
        <div className="flex justify-center items-start  w-full">
            <MultiStepOnboarding />
        </div>
    )
}