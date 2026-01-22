"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AlertCircle, MessageSquare, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const DISPUTES = [
    { id: "DSP-001", vendor: "Tech Corp", invoice: "INV-2024-001", status: "OPEN", date: "Jan 12, 2024", reason: "Incorrect tax calculation" },
    { id: "DSP-002", vendor: "Logistics Inc", invoice: "INV-2024-003", status: "IN_REVIEW", date: "Jan 10, 2024", reason: "Service not fully rendered" },
    { id: "DSP-003", vendor: "Design Studio", invoice: "INV-2023-992", status: "RESOLVED", date: "Dec 15, 2023", reason: "Duplicate invoice sent" },
];

export default function DisputesPage() {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Disputes</h2>
                    <p className="text-muted-foreground">Resolve billing discrepancies and vendor conflicts</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-card border rounded-xl p-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-danger/10 text-danger flex items-center justify-center">
                            <AlertCircle size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground font-bold uppercase">Open</p>
                            <p className="text-xl font-bold">1</p>
                        </div>
                    </div>
                    <div className="bg-card border rounded-xl p-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-warning/10 text-warning flex items-center justify-center">
                            <Clock size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground font-bold uppercase">In Review</p>
                            <p className="text-xl font-bold">1</p>
                        </div>
                    </div>
                    <div className="bg-card border rounded-xl p-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-success/10 text-success flex items-center justify-center">
                            <CheckCircle2 size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground font-bold uppercase">Resolved</p>
                            <p className="text-xl font-bold">1</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {DISPUTES.map((dsp) => (
                        <div key={dsp.id} className="bg-card border rounded-xl p-6 shadow-sm hover:border-primary/30 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-mono font-bold bg-accent px-2 py-1 rounded">{dsp.id}</span>
                                    <h3 className="font-semibold">{dsp.vendor}</h3>
                                    <span className="text-muted-foreground text-sm">• {dsp.invoice}</span>
                                </div>
                                <span className={cn(
                                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                                    dsp.status === 'OPEN' ? 'bg-danger/10 text-danger' :
                                        dsp.status === 'IN_REVIEW' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
                                )}>
                                    {dsp.status.replace('_', ' ')}
                                </span>
                            </div>

                            <p className="text-sm text-foreground mb-4 bg-accent/20 p-3 rounded-lg border-l-2 border-primary/50 italic">
                                "{dsp.reason}"
                            </p>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1"><Clock size={12} /> Opened {dsp.date}</span>
                                    <span className="flex items-center gap-1"><MessageSquare size={12} /> 2 Comments</span>
                                </div>
                                <button className="text-primary text-sm font-semibold hover:underline flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    View Details <ArrowRight size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}


