"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CreditCard, Search, ExternalLink, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

export default function PaymentsPage() {
    const { user } = useAuth();
    const [payments, setPayments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [vendorId, setVendorId] = useState<number | undefined>(undefined);

    const isVendor = user?.roles.includes("ROLE_VENDOR");

    useEffect(() => {
        const fetchUserData = async () => {
            if (isVendor && user?.id) {
                try {
                    const vendorRes = await api.get(`/vendors/me/${user.id}`);
                    setVendorId(vendorRes.data.id);
                } catch (e) {
                    console.error("Vendor profile not found");
                }
            }
        };
        fetchUserData();
    }, [user, isVendor]);

    const fetchPayments = async () => {
        setIsLoading(true);
        try {
            const endpoint = vendorId ? `/payments/my-payments/${vendorId}` : "/payments";
            const response = await api.get(endpoint);
            setPayments(response.data.content || []);
        } catch (error) {
            console.error("Failed to fetch payments", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, [vendorId]);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Payments</h2>
                        <p className="text-muted-foreground">Immutable log of bank transactions and disbursements</p>
                    </div>
                </div>

                <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b">
                        <div className="relative max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                            <input
                                type="text"
                                placeholder="Search transactions..."
                                className="w-full pl-9 pr-4 py-2 bg-accent/50 border-none rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-accent/30 text-muted-foreground uppercase text-[10px] font-bold tracking-widest">
                                    <th className="px-6 py-4">Transaction Ref</th>
                                    <th className="px-6 py-4">Vendor Info</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Payment Date</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y text-sm">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center">
                                            <Loader2 className="animate-spin mx-auto text-primary" size={24} />
                                        </td>
                                    </tr>
                                ) : payments.length > 0 ? (
                                    payments.map((pmt: any) => (
                                        <tr key={pmt.id} className="hover:bg-accent/20 transition-colors group">
                                            <td className="px-6 py-4 font-mono font-medium">{pmt.transactionRef}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold">{pmt.vendorName}</span>
                                                    <span className="text-xs text-muted-foreground">{pmt.id}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-lg">${pmt.amount?.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-muted-foreground">{pmt.paymentDate}</td>
                                            <td className="px-6 py-4">
                                                <span className={cn(
                                                    "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide",
                                                    pmt.reconciled ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                                                )}>
                                                    {pmt.reconciled ? 'RECONCILED' : 'UNALLOCATED'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="p-1.5 rounded-lg hover:bg-accent text-primary transition-opacity inline-flex items-center gap-1 text-xs font-bold">
                                                    View <ExternalLink size={12} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground italic">
                                            No payments recorded.
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
