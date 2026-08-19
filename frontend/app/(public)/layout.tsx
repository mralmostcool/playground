import Breadcrumbs from "@/components/Breadcrumbs";
import { PublicLayoutProvider, PublicLayoutContent } from "./PublicLayoutClient";

export const metadata = {
    title: "Maritime Portal",
    description: "Public access portal for maritime operations"
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen bg-canvas text-body-text font-sans selection:bg-primary/20 selection:text-primary">
            <Breadcrumbs />
            <PublicLayoutProvider>
                <main className="flex-grow">
                    <PublicLayoutContent>
                        {children}
                    </PublicLayoutContent>
                </main>
            </PublicLayoutProvider>
        </div>
    )
}