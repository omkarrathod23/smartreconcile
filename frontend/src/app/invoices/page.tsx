"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { FileText, Plus, Search, Filter, Download, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const response = await api.get("/invoices");
                setInvoices(response.data.content || []);
            } catch (error) {
                console.error("Failed to fetch invoices", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchInvoices();
    }, []);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Invoices</h2>
                        <p className="text-muted-foreground">Track and manage outgoing payments and vendor billing</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="bg-accent text-foreground px-4 py-2 rounded-xl font-medium border border-border flex items-center gap-2 hover:bg-accent/80 transition-colors">
                            <Download size={18} /> Export
                        </button>
                        <button className="bg-primary text-white px-4 py-2 rounded-xl font-medium shadow-sm hover:bg-primary/90 flex items-center gap-2 transition-all active:scale-95">
                            <Plus size={18} /> Create Invoice
                        </button>
                    </div>
                </div>

                <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search invoices..."
                                    className="pl-9 pr-4 py-2 bg-accent/50 border-none rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary w-64"
                                />
                            </div>
                            <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent text-sm text-muted-foreground font-medium transition-colors">
                                <Filter size={16} /> Filters
                            </button>
                        </div>
                        <div className="text-xs text-muted-foreground font-medium">
                            {isLoading ? "Loading..." : `Showing ${invoices.length} invoices`}
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-accent/30 text-muted-foreground uppercase text-[10px] font-bold tracking-widest">
                                    <th className="px-6 py-4">Invoice No</th>
                                    <th className="px-6 py-4">Vendor</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Due Date</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y text-sm">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center">
                                            <Loader2 className="animate-spin mx-auto text-primary" size={24} />
                                        </td>
                                    </tr>
                                ) : invoices.length > 0 ? (
                                    invoices.map((inv: any) => (
                                        <tr key={inv.id} className="hover:bg-accent/20 transition-colors cursor-pointer group">
                                            <td className="px-6 py-4 font-mono font-medium">{inv.invoiceNumber}</td>
                                            <td className="px-6 py-4">{inv.vendorName}</td>
                                            <td className="px-6 py-4 font-bold">${inv.amountTotal?.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-muted-foreground">{inv.dueDate}</td>
                                            <td className="px-6 py-4">
                                                <span className={cn(
                                                    "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide inline-flex items-center gap-1",
                                                    inv.status === 'PAID' ? 'bg-success/10 text-success' :
                                                        inv.status === 'OVERDUE' ? 'bg-danger/10 text-danger' : 'bg-warning/10 text-warning'
                                                )}>
                                                    <div className={cn(
                                                        "w-1.5 h-1.5 rounded-full",
                                                        inv.status === 'PAID' ? 'bg-success' :
                                                            inv.status === 'OVERDUE' ? 'bg-danger' : 'bg-warning'
                                                    )} />
                                                    {inv.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground italic">
                                            No invoices found.
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
}
