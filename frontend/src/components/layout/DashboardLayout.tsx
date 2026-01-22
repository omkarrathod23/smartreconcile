"use client";

import React from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { usePathname } from "next/navigation";
import { AuthGuard } from "@/components/auth/AuthGuard";

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const pageTitle = pathname.split("/").pop() || "Dashboard";

    return (
        <AuthGuard>
            <div className="min-h-screen bg-background text-foreground flex">
                <Sidebar />
                <div className="flex-1 flex flex-col ml-64 transition-all duration-300">
                    <Navbar pageTitle={pageTitle} />
                    <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
                        {children}
                    </main>
                </div>
            </div>
        </AuthGuard>
    );
};
