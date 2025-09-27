import Navbar from "@/components/header/navbar";

export default function AppLayout({children}: { children: React.ReactNode }) {
    return (
        <div>
            <Navbar/>
            <div className={"container mx-auto px-4 xl:px-0"}>
                {children}
            </div>
        </div>
    )
}