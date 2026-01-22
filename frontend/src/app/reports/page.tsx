"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { BarChart3, PieChart, TrendingUp, Download } from "lucide-react";

export default function ReportsPage() {
    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Financial Reports</h2>
                        <p className="text-muted-foreground">Deep dives into vendor aging, monthly expenses, and cash flow</p>
                    </div>
                    <button className="bg-accent border px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-accent/80">
                        <Download size={16} /> Download CSV
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Vendor Aging */}
                    <div className="bg-card border rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                <TrendingUp size={18} />
                            </div>
                            <h3 className="font-semibold text-lg">Vendor Aging</h3>
                        </div>
                        <div className="h-[250px] bg-accent/30 rounded-lg flex items-center justify-center border-2 border-dashed border-border/50">
                            <p className="text-muted-foreground text-sm font-medium">Recharts BarChart - Aging Buckets</p>
                        </div>
                        <div className="mt-4 grid grid-cols-4 gap-4 text-center">
                            <div>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase">0-30 Days</p>
                                <p className="text-sm font-bold">$12,400</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase">31-60 Days</p>
                                <p className="text-sm font-bold">$4,200</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase">61-90 Days</p>
                                <p className="text-sm font-bold">$1,800</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase">90+ Days</p>
                                <p className="text-sm font-bold text-danger">$850</p>
                            </div>
                        </div>
                    </div>

                    {/* Expense Distribution */}
                    <div className="bg-card border rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                <PieChart size={18} />
                            </div>
                            <h3 className="font-semibold text-lg">Expense Distribution</h3>
                        </div>
                        <div className="h-[250px] bg-accent/30 rounded-lg flex items-center justify-center border-2 border-dashed border-border/50">
                            <p className="text-muted-foreground text-sm font-medium">Recharts PieChart - By Category</p>
                        </div>
                        <div className="mt-4 space-y-2">
                            <div className="flex justify-between text-xs font-medium">
                                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary" /> Software SaaS</span>
                                <span>45%</span>
                            </div>
                            <div className="flex justify-between text-xs font-medium">
                                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-success" /> Infrastructure</span>
                                <span>30%</span>
                            </div>
                            <div className="flex justify-between text-xs font-medium">
                                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-warning" /> Logistics</span>
                                <span>25%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Big Summary Table */}
                <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b font-semibold">Monthly Performance Summary</div>
                    <table className="w-full text-left text-sm">
                        <thead className="bg-accent/30 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            <tr>
                                <th className="px-6 py-4">Month</th>
                                <th className="px-6 py-4">Reconciled</th>
                                <th className="px-6 py-4">Pending</th>
                                <th className="px-6 py-4">Growth</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            <tr>
                                <td className="px-6 py-4 font-medium">January 2024</td>
                                <td className="px-6 py-4">$128,400</td>
                                <td className="px-6 py-4 text-warning">$12,500</td>
                                <td className="px-6 py-4 text-success">+18.2%</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 font-medium">December 2023</td>
                                <td className="px-6 py-4">$108,200</td>
                                <td className="px-6 py-4 text-warning">$8,100</td>
                                <td className="px-6 py-4 text-success">+12.5%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}
