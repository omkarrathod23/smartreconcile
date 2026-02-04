"use client";

import React, { useState } from "react";
import { X, Loader2, CheckCircle2, UserPlus, Shield } from "lucide-react";
import api from "@/lib/api";

interface VendorFormProps {
    onClose: () => void;
    onSuccess: () => void;
}

export const VendorForm = ({ onClose, onSuccess }: VendorFormProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        contactEmail: "",
        taxId: "",
        phone: "",
        address: "",
        password: "VendorPassword123!", // Default initial password
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await api.post("vendors/onboard", formData);
            setIsSuccess(true);
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 1500);
        } catch (error) {
            console.error("Failed to onboard vendor", error);
            alert("Error onboarding vendor. Check if Email or Tax ID already exists.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
                <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center text-success animate-bounce">
                    <CheckCircle2 size={40} />
                </div>
                <h3 className="text-xl font-bold">Vendor Onboarded!</h3>
                <p className="text-muted-foreground">The vendor account and portal access have been created.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 text-primary rounded-lg">
                        <UserPlus size={20} />
                    </div>
                    <h3 className="text-xl font-bold tracking-tight">Onboard New Supplier</h3>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-accent rounded-full text-muted-foreground transition-colors">
                    <X size={20} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Legal Entity Name</label>
                        <input
                            required
                            type="text"
                            placeholder="Acme Corp International"
                            className="w-full bg-accent/30 border border-border rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary outline-none transition-all"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Contact Email (Portal Login)</label>
                            <input
                                required
                                type="email"
                                placeholder="billing@acme.com"
                                className="w-full bg-accent/30 border border-border rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary outline-none transition-all"
                                value={formData.contactEmail}
                                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Tax ID / VAT Number</label>
                            <input
                                required
                                type="text"
                                placeholder="TX-9988-77"
                                className="w-full bg-accent/30 border border-border rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary outline-none transition-all"
                                value={formData.taxId}
                                onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Business Address</label>
                        <textarea
                            placeholder="123 Industrial Way, Suite 400..."
                            className="w-full bg-accent/30 border border-border rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary outline-none transition-all resize-none h-20"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>

                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
                        <Shield className="text-primary mt-1" size={16} />
                        <div>
                            <p className="text-[11px] font-bold text-primary uppercase tracking-wider">Security Note</p>
                            <p className="text-[11px] text-muted-foreground">A default password has been generated for their first login. They will be prompted to change it.</p>
                            <input
                                type="text"
                                className="mt-2 text-xs font-mono bg-white/50 border rounded px-2 py-1 w-full"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] border border-border hover:bg-accent transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-[2] bg-primary text-white px-4 py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin" size={16} />
                        ) : (
                            <>
                                Establish Relationship
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};
