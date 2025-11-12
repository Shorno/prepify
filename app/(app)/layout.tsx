import Navbar from "@/components/header/navbar";

export default function AppLayout({children}: { children: React.ReactNode }) {
    return (
        <div>
            <Navbar/>
            <div>
                {children}
            </div>
        </div>
    )
}