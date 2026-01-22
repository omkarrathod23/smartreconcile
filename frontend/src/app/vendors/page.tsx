"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Plus, Users, Search, MoreHorizontal, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

const VendorsPage = () => {
    const [vendors, setVendors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const response = await api.get("/vendors");
                setVendors(response.data);
            } catch (error) {
                console.error("Failed to fetch vendors", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchVendors();
    }, []);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Vendors</h2>
                        <p className="text-muted-foreground">Manage your supplier relationships and billing details</p>
                    </div>
                    <button className="bg-primary text-white px-4 py-2 rounded-xl font-medium shadow-sm hover:bg-primary/90 flex items-center gap-2 transition-all active:scale-95">
                        <Plus size={18} /> Add Vendor
                    </button>
                </div>

                <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b flex items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                            <input
                                type="text"
                                placeholder="Search vendors..."
                                className="w-full pl-9 pr-4 py-2 bg-accent/50 border-none rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-accent/30 text-muted-foreground uppercase text-[10px] font-bold tracking-widest">
                                    <th className="px-6 py-4">Vendor Name</th>
                                    <th className="px-6 py-4">Contact Email</th>
                                    <th className="px-6 py-4">Tax ID</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y text-sm">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <Loader2 className="animate-spin text-primary" size={24} />
                                                <span className="text-muted-foreground font-medium">Loading vendors...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : vendors.length > 0 ? (
                                    vendors.map((vendor: any) => (
                                        <tr key={vendor.id} className="hover:bg-accent/20 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                        {vendor.name?.charAt(0) || "V"}
                                                    </div>
                                                    <span className="font-semibold">{vendor.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground">{vendor.contactEmail}</td>
                                            <td className="px-6 py-4 font-mono text-xs">{vendor.taxId}</td>
                                            <td className="px-6 py-4">
                                                <span className={cn(
                                                    "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide",
                                                    vendor.status === 'ACTIVE' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                                                )}>
                                                    {vendor.status || "ACTIVE"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="p-2 rounded-lg hover:bg-accent text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <MoreHorizontal size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground italic">
                                            No vendors found. Add your first vendor to get started.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default VendorsPage;
