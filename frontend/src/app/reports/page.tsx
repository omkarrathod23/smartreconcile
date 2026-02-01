"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { BarChart3, PieChart, TrendingUp, Download } from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart as RePieChart,
    Pie,
    Cell,
    Legend
} from "recharts";

const agingData = [
    { name: "0-30", value: 12400 },
    { name: "31-60", value: 4200 },
    { name: "61-90", value: 1800 },
    { name: "90+", value: 850 },
];

const distributionData = [
    { name: "Software SaaS", value: 45 },
    { name: "Infrastructure", value: 30 },
    { name: "Logistics", value: 25 },
];

const COLORS = ["#3b82f6", "#10b981", "#f59e0b"];

const AgingChart = () => (
    <ResponsiveContainer width="100%" height="100%">
        <BarChart data={agingData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 10 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 10 }} />
            <Tooltip
                contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px' }}
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
            />
            <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
        </BarChart>
    </ResponsiveContainer>
);

const DistributionChart = () => (
    <ResponsiveContainer width="100%" height="100%">
        <RePieChart>
            <Pie
                data={distributionData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
            >
                {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px' }} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }} />
        </RePieChart>
    </ResponsiveContainer>
);

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
                        <div className="h-[250px] bg-accent/10 rounded-lg p-2">
                            <AgingChart />
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
                        <div className="h-[250px] bg-accent/10 rounded-lg p-2">
                            <DistributionChart />
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
