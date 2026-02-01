"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    FileText,
    CreditCard,
    CheckCircle2,
    AlertCircle,
    BarChart3,
    Settings,
    ChevronLeft,
    ChevronRight,
    ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

import { useAuth } from "@/context/AuthContext";

const sidebarItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["ROLE_ADMIN", "ROLE_FINANCE_MANAGER", "ROLE_ACCOUNTS", "ROLE_VENDOR"] },
    { name: "Vendors", href: "/vendors", icon: Users, roles: ["ROLE_ADMIN", "ROLE_FINANCE_MANAGER"] },
    { name: "Invoices", href: "/invoices", icon: FileText, roles: ["ROLE_ADMIN", "ROLE_FINANCE_MANAGER", "ROLE_ACCOUNTS", "ROLE_VENDOR"] },
    { name: "Payments", href: "/payments", icon: CreditCard, roles: ["ROLE_ADMIN", "ROLE_FINANCE_MANAGER", "ROLE_ACCOUNTS", "ROLE_VENDOR"] },
    { name: "Reconciliation", href: "/reconciliation", icon: CheckCircle2, roles: ["ROLE_ADMIN", "ROLE_FINANCE_MANAGER"] },
    { name: "Disputes", href: "/disputes", icon: AlertCircle, roles: ["ROLE_ADMIN", "ROLE_FINANCE_MANAGER", "ROLE_ACCOUNTS", "ROLE_VENDOR"] },
    { name: "Reports", href: "/reports", icon: BarChart3, roles: ["ROLE_ADMIN", "ROLE_FINANCE_MANAGER"] },
    { name: "Settings", href: "/settings", icon: Settings, roles: ["ROLE_ADMIN"] },
];

export const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();
    const { user } = useAuth();

    const filteredItems = sidebarItems.filter(item =>
        item.roles.some(role => user?.roles.includes(role))
    );

    return (
        <aside
            className={cn(
                "h-screen border-r bg-card transition-all duration-300 flex flex-col fixed left-0 top-0",
                collapsed ? "w-20" : "w-64"
            )}
        >
            <div className="p-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shrink-0">
                    <ShieldCheck size={20} />
                </div>
                {!collapsed && (
                    <span className="font-semibold text-lg tracking-tight truncate">
                        SmartReconcile
                    </span>
                )}
            </div>

            <nav className="flex-1 px-3 space-y-1">
                {filteredItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-xl transition-colors",
                                isActive
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                            )}
                        >
                            <item.icon size={20} />
                            {!collapsed && <span className="truncate">{item.name}</span>}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t">
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="w-full flex items-center justify-center p-2 rounded-xl hover:bg-accent text-muted-foreground"
                >
                    {collapsed ? <ChevronRight size={20} /> : <div className="flex items-center gap-2"><ChevronLeft size={20} /> <span>Collapse</span></div>}
                </button>
            </div>
        </aside>
    );
};
