"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
    TrendingUp,
    TrendingDown,
    Clock,
    CheckCircle,
    ArrowRight,
    FileText,
    AlertCircle,
    ShieldCheck,
    Users,
    Activity,
    CreditCard
} from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar
} from "recharts";

export default function DashboardPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        pending: "$0",
        overdue: "$0",
        paid: "$0",
        cashflow: "$0",
        disputes: "0"
    });
    const [recentActivities, setRecentActivities] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const isVendor = user?.roles.includes("ROLE_VENDOR");
    const isAccounts = user?.roles.includes("ROLE_ACCOUNTS");
    const isManager = user?.roles.includes("ROLE_FINANCE_MANAGER") || user?.roles.includes("ROLE_ADMIN");

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                let currentVendorId = null;

                // 1. If Vendor, find their Vendor ID first
                if (isVendor && user?.id) {
                    try {
                        const vendorRes = await api.get(`/vendors/me/${user.id}`);
                        currentVendorId = vendorRes.data.id;
                    } catch (e) {
                        console.error("Could not find vendor profile for user");
                    }
                }

                // 2. Fetch Invoices based on role
                const invoiceEndpoint = currentVendorId ? `/invoices/my-invoices/${currentVendorId}` : "/invoices";
                const invoicesRes = await api.get(invoiceEndpoint);
                const invoices = invoicesRes.data.content || [];

                // 3. Fetch Payments (for total paid)
                const paymentEndpoint = currentVendorId ? `/payments/my-payments/${currentVendorId}` : "/payments";
                const paymentsRes = await api.get(paymentEndpoint);
                const payments = paymentsRes.data.content || [];

                // 4. Fetch Disputes (for accounts)
                let disputesCount = "0";
                if (isAccounts || isManager) {
                    const disputesRes = await api.get("/disputes");
                    disputesCount = String(disputesRes.data.totalElements || "0");
                }

                const pendingTotal = invoices
                    .filter((inv: any) => inv.status === "CREATED" || inv.status === "PARTIALLY_PAID")
                    .reduce((acc: number, inv: any) => acc + (inv.amountDue || 0), 0);

                const overdueTotal = invoices
                    .filter((inv: any) => inv.status === "OVERDUE")
                    .reduce((acc: number, inv: any) => acc + (inv.amountDue || 0), 0);

                const paidTotal = payments.reduce((acc: number, p: any) => acc + (p.amount || 0), 0);

                setStats({
                    pending: `$${pendingTotal.toLocaleString()}`,
                    overdue: `$${overdueTotal.toLocaleString()}`,
                    paid: `$${paidTotal.toLocaleString()}`,
                    cashflow: `+$${(paidTotal * 0.6).toLocaleString()}`, // Mocking cashflow for demo
                    disputes: disputesCount
                });

                // 5. Merge for Recent Activities
                const combined = [
                    ...invoices.map((inv: any) => ({ ...inv, activityType: 'INVOICE', date: inv.issueDate })),
                    ...payments.map((pmt: any) => ({ ...pmt, activityType: 'PAYMENT', date: pmt.paymentDate }))
                ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

                setRecentActivities(combined.slice(0, 6));
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user) fetchDashboardData();
    }, [user, isVendor, isAccounts, isManager]);

    const getDashboardHeader = () => {
        if (isVendor) return { title: "Vendor Portal", sub: "Monitor your invoices and payment status" };
        if (isAccounts) return { title: "Operations Desk", sub: "Manage daily billing and dispute resolutions" };
        return { title: "Executive Dashboard", sub: "Financial overview and reconciliation performance" };
    };

    const header = getDashboardHeader();

    const KPI_CARDS = isVendor ? [
        { label: "My Open Invoices", value: stats.pending, trend: "4 Active", color: "text-warning", icon: Clock },
        { label: "Outstanding Balance", value: stats.overdue, trend: "Check due dates", color: "text-danger", icon: TrendingDown },
        { label: "Successfully Paid", value: stats.paid, trend: "+10% MoM", color: "text-success", icon: CheckCircle },
        { label: "Active Disputes", value: "0", trend: "All clear", color: "text-primary", icon: AlertCircle },
    ] : isAccounts ? [
        { label: "Total Pending", value: stats.pending, trend: "Across all vendors", color: "text-warning", icon: FileText },
        { label: "Urgent Overdue", value: stats.overdue, trend: "Requires follow-up", color: "text-danger", icon: Clock },
        { label: "Open Disputes", value: stats.disputes, trend: "Needs resolution", color: "text-primary", icon: AlertCircle },
        { label: "Daily Volume", value: "24", trend: "+5 from yesterday", color: "text-success", icon: TrendingUp },
    ] : [
        { label: "Monthly Revenue", value: stats.paid, trend: "+18%", color: "text-success", icon: CheckCircle },
        { label: "Risk Exposure", value: stats.overdue, trend: "-5%", color: "text-danger", icon: TrendingDown },
        { label: "Working Capital", value: stats.cashflow, trend: "+2%", color: "text-primary", icon: TrendingUp },
        { label: "Pending Approvals", value: "4", trend: "High priority", color: "text-warning", icon: Clock },
    ];

    const chartData = [
        { name: "Jul", value: 4000 },
        { name: "Aug", value: 3000 },
        { name: "Sep", value: 5000 },
        { name: "Oct", value: 2780 },
        { name: "Nov", value: 1890 },
        { name: "Dec", value: 2390 },
        { name: "Jan", value: 3490 },
    ];

    const FinancialChart = () => (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
                <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#666', fontSize: 10 }}
                />
                <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#666', fontSize: 10 }}
                    tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                    contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px', fontSize: '12px' }}
                    itemStyle={{ color: '#fff' }}
                />
                <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorValue)"
                    strokeWidth={3}
                />
            </AreaChart>
        </ResponsiveContainer>
    );

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">{header.title}</h2>
                    <p className="text-muted-foreground">{header.sub}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {KPI_CARDS.map((kpi) => (
                        <div key={kpi.label} className="bg-card border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-2 rounded-xl bg-accent/50 ${kpi.color}`}>
                                    <kpi.icon size={20} />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg bg-accent text-muted-foreground">
                                    {kpi.trend}
                                </span>
                            </div>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{kpi.label}</p>
                            <h3 className="text-2xl font-bold mt-1 tracking-tight">{kpi.value}</h3>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-card border rounded-2xl p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-semibold text-lg">{isVendor ? "Monthly Payments Received" : "Cash Flow Overview"}</h3>
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-primary" />
                                <div className="w-3 h-3 rounded-full bg-success opacity-50" />
                            </div>
                        </div>
                        <div className="h-[320px] w-full bg-accent/10 rounded-2xl p-4">
                            <FinancialChart />
                        </div>
                    </div>

                    <div className="bg-card border rounded-2xl p-6 shadow-sm flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-semibold text-lg">Recent Activities</h3>
                            <button className="text-primary text-sm font-bold hover:underline flex items-center gap-1">
                                View all <ArrowRight size={14} />
                            </button>
                        </div>
                        <div className="space-y-4 flex-1">
                            {isLoading ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                </div>
                            ) : recentActivities.length > 0 ? (
                                recentActivities.map((act: any, idx: number) => (
                                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-accent/50 transition-all border border-transparent hover:border-border group">
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                                                act.activityType === 'INVOICE' ? "bg-warning/10 text-warning" : "bg-success/10 text-success"
                                            )}>
                                                {act.activityType === 'INVOICE' ? <FileText size={18} /> : <CreditCard size={18} />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold">
                                                    {act.activityType === 'INVOICE' ? (isVendor ? "Invoice Submitted" : act.vendorName) : "Payment Recorded"}
                                                </p>
                                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                                                    {act.activityType === 'INVOICE' ? act.invoiceNumber : act.transactionRef}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold tracking-tight">
                                                {act.activityType === 'INVOICE' ? `$${act.amountTotal?.toLocaleString()}` : `$${act.amount?.toLocaleString()}`}
                                            </p>
                                            <span className="text-[9px] font-black uppercase tracking-[0.1em] text-muted-foreground">
                                                {act.date}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-accent/20 rounded-2xl border-2 border-dashed border-border/50">
                                    <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center mb-2">
                                        <Clock size={24} className="text-muted-foreground" />
                                    </div>
                                    <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">No Recent Activity</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
