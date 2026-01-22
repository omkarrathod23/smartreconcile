"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
    ArrowRightLeft,
    Search,
    Filter,
    CheckCircle2,
    AlertCircle,
    Loader2
} from "lucide-react";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

export default function ReconciliationPage() {
    const [openInvoices, setOpenInvoices] = useState([]);
    const [unallocatedPayments, setUnallocatedPayments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [invRes, pmtRes] = await Promise.all([
                api.get("/invoices?status=CREATED"),
                api.get("/payments/unallocated")
            ]);
            setOpenInvoices(invRes.data.content || []);
            setUnallocatedPayments(pmtRes.data.content || []);
        } catch (error) {
            console.error("Failed to fetch reconciliation data", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const runAutoMatch = async () => {
        setIsProcessing(true);
        setMessage(null);
        try {
            const response = await api.post("/reconciliation/run", {});
            setMessage(`Success: Reconciled ${response.data.reconciledCount} transactions.`);
            await fetchData();
        } catch (error: any) {
            setMessage("Error: Reconciliation process failed.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col h-[calc(100vh-160px)] space-y-6">
                {/* Header / Actions */}
                <div className="flex justify-between items-center bg-card border rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <ArrowRightLeft size={20} />
                        </div>
                        <div>
                            <h2 className="font-semibold">Transaction Reconciliation</h2>
                            <p className="text-xs text-muted-foreground">Match incoming payments to outstanding invoices</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        {message && (
                            <span className={cn(
                                "text-xs font-semibold px-3 py-1.5 rounded-lg border",
                                message.startsWith("Error") ? "bg-danger/10 text-danger border-danger/20" : "bg-success/10 text-success border-success/20"
                            )}>
                                {message}
                            </span>
                        )}
                        <button
                            onClick={runAutoMatch}
                            disabled={isProcessing || isLoading}
                            className="bg-primary text-white px-6 py-2.5 rounded-xl font-medium shadow-sm hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50"
                        >
                            {isProcessing ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                            Run Auto-Match
                        </button>
                    </div>
                </div>

                {/* Split View */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 overflow-hidden">

                    {/* Left Side: Payments */}
                    <div className="flex flex-col space-y-4 overflow-hidden">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="font-medium flex items-center gap-2 text-sm uppercase tracking-wider text-muted-foreground">
                                Unreconciled Payments
                                <span className="bg-accent px-2 py-0.5 rounded text-[10px] text-foreground font-bold">{unallocatedPayments.length}</span>
                            </h3>
                            <div className="flex items-center gap-2">
                                <button className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground transition-colors"><Search size={14} /></button>
                                <button className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground transition-colors"><Filter size={14} /></button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-accent">
                            {isLoading ? (
                                Array(3).fill(0).map((_, i) => <div key={i} className="h-24 bg-accent/20 rounded-xl animate-pulse" />)
                            ) : unallocatedPayments.length > 0 ? (
                                unallocatedPayments.map((pmt: any) => (
                                    <div key={pmt.id} className="group bg-card border rounded-xl p-4 hover:border-primary/50 cursor-pointer transition-all hover:shadow-md relative overflow-hidden">
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-muted group-hover:bg-primary transition-colors" />
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase">{pmt.transactionRef}</span>
                                            <span className="text-[10px] font-semibold text-muted-foreground">{pmt.paymentDate}</span>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="font-bold text-sm tracking-tight">{pmt.vendorName}</p>
                                                <p className="text-[10px] text-muted-foreground truncate max-w-[150px] uppercase font-bold tracking-tighter">ID: {pmt.id}</p>
                                            </div>
                                            <p className="text-xl font-black tracking-tighter">${pmt.amount?.toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="h-full flex items-center justify-center border-2 border-dashed rounded-2xl text-muted-foreground text-sm font-medium">
                                    All payments allocated
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Side: Invoices */}
                    <div className="flex flex-col space-y-4 overflow-hidden">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="font-medium flex items-center gap-2 text-sm uppercase tracking-wider text-muted-foreground">
                                Open Invoices
                                <span className="bg-accent px-2 py-0.5 rounded text-[10px] text-foreground font-bold">{openInvoices.length}</span>
                            </h3>
                            <div className="flex items-center gap-2">
                                <button className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground transition-colors"><Search size={14} /></button>
                                <button className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground transition-colors"><Filter size={14} /></button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-accent">
                            {isLoading ? (
                                Array(3).fill(0).map((_, i) => <div key={i} className="h-24 bg-accent/20 rounded-xl animate-pulse" />)
                            ) : openInvoices.length > 0 ? (
                                openInvoices.map((inv: any) => (
                                    <div key={inv.id} className="group bg-card border rounded-xl p-4 hover:border-primary/50 cursor-pointer transition-all hover:shadow-md relative overflow-hidden">
                                        <div className="absolute right-0 top-0 bottom-0 w-1 bg-muted group-hover:bg-primary transition-colors" />
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase">{inv.invoiceNumber}</span>
                                            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest text-warning">Awaiting Pmt</span>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <p className="text-xl font-black tracking-tighter">${inv.amountTotal?.toLocaleString()}</p>
                                            <div className="text-right">
                                                <p className="font-bold text-sm tracking-tight">{inv.vendorName}</p>
                                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Due: {inv.dueDate}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="h-full flex items-center justify-center border-2 border-dashed rounded-2xl text-muted-foreground text-sm font-medium">
                                    No outstanding invoices
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* Legend / Status Bar */}
                <div className="bg-accent/30 border-t p-3 rounded-b-xl flex items-center gap-6 text-[11px] text-muted-foreground uppercase tracking-widest font-black">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-success" /> Exact Match
                    </div>
                    <div className="flex items-center gap-2 opacity-50">
                        <div className="w-2 h-2 rounded-full bg-warning" /> Partial
                    </div>
                    <div className="flex items-center gap-2 opacity-50">
                        <div className="w-2 h-2 rounded-full bg-danger" /> Discrepancy
                    </div>
                    {!isLoading && (unallocatedPayments.length > 0 || openInvoices.length > 0) && (
                        <div className="ml-auto flex items-center gap-2 text-primary">
                            <AlertCircle size={14} /> Ready for reconciliation
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
