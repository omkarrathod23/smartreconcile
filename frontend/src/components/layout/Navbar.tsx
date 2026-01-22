"use client";

import React from "react";
import {
    Bell,
    Search,
    Sun,
    Moon,
    UserCircle,
    LogOut
} from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "@/context/AuthContext";

export const Navbar = ({ pageTitle }: { pageTitle: string }) => {
    const { theme, setTheme } = useTheme();
    const { user, logout } = useAuth();

    return (
        <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30 flex items-center justify-between px-8">
            <div className="flex items-center gap-4">
                <h1 className="text-lg font-semibold text-foreground capitalize">
                    {pageTitle}
                </h1>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative hidden md:flex items-center">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="pl-9 pr-4 py-2 bg-accent/50 rounded-xl text-sm border-none focus:ring-1 focus:ring-primary w-64"
                    />
                </div>

                <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="p-2 rounded-xl hover:bg-accent text-muted-foreground transition-colors"
                >
                    {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                <button className="p-2 rounded-xl hover:bg-accent text-muted-foreground relative">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full" />
                </button>

                <div className="h-8 w-[1px] bg-border mx-2" />

                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium leading-none">{user?.email.split('@')[0] || "User"}</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{user?.roles[0]?.replace('ROLE_', '') || "Admin"}</p>
                    </div>
                    <button
                        onClick={logout}
                        className="p-2 rounded-xl hover:bg-danger/10 text-muted-foreground hover:text-danger transition-colors group"
                        title="Logout"
                    >
                        <LogOut size={20} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                </div>
            </div>
        </header>
    );
};
