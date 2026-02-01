"use client";

import React, { useState } from "react";
import { X, Upload, Loader2, FileText, CheckCircle2 } from "lucide-react";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

interface InvoiceFormProps {
    onClose: () => void;
    onSuccess: () => void;
    vendorId?: number;
}

export const InvoiceForm = ({ onClose, onSuccess, vendorId }: InvoiceFormProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [formData, setFormData] = useState({
        vendorId: vendorId || "",
        invoiceNumber: "",
        poNumber: "",
        amountTotal: "",
        issueDate: new Date().toISOString().split("T")[0],
        dueDate: "",
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const data = new FormData();

        // Create a blob for the JSON part
        const invoiceBlob = new Blob([JSON.stringify({
            ...formData,
            vendorId: Number(formData.vendorId),
            amountTotal: Number(formData.amountTotal)
        })], { type: "application/json" });

        data.append("invoice", invoiceBlob);
        if (file) {
            data.append("file", file);
        }

        try {
            await api.post("/invoices", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setIsUploaded(true);
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 1500);
        } catch (error) {
            console.error("Failed to create invoice", error);
            alert("Error creating invoice. Please check your data.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isUploaded) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
                <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center text-success animate-bounce">
                    <CheckCircle2 size={40} />
                </div>
                <h3 className="text-xl font-bold">Invoice Uploaded!</h3>
                <p className="text-muted-foreground">The system is now processing your billing request.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold tracking-tight">Generate New invoice</h3>
                <button onClick={onClose} className="p-2 hover:bg-accent rounded-full text-muted-foreground transition-colors">
                    <X size={20} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Invoice Number</label>
                        <input
                            required
                            type="text"
                            placeholder="INV-XXXXX"
                            className="w-full bg-accent/30 border border-border rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary outline-none transition-all"
                            value={formData.invoiceNumber}
                            onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">PO Number (Optional)</label>
                        <input
                            type="text"
                            placeholder="PO-XXXXX"
                            className="w-full bg-accent/30 border border-border rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary outline-none transition-all"
                            value={formData.poNumber}
                            onChange={(e) => setFormData({ ...formData, poNumber: e.target.value })}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Total Amount ($)</label>
                        <input
                            required
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className="w-full bg-accent/30 border border-border rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary outline-none transition-all"
                            value={formData.amountTotal}
                            onChange={(e) => setFormData({ ...formData, amountTotal: e.target.value })}
                        />
                    </div>
                    {!vendorId && (
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Vendor ID</label>
                            <input
                                required
                                type="number"
                                placeholder="1"
                                className="w-full bg-accent/30 border border-border rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary outline-none transition-all"
                                value={formData.vendorId}
                                onChange={(e) => setFormData({ ...formData, vendorId: e.target.value })}
                            />
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Issue Date</label>
                        <input
                            required
                            type="date"
                            className="w-full bg-accent/30 border border-border rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary outline-none transition-all"
                            value={formData.issueDate}
                            onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Due Date</label>
                        <input
                            required
                            type="date"
                            className="w-full bg-accent/30 border border-border rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary outline-none transition-all"
                            value={formData.dueDate}
                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Supporting Document (PDF/IMG)</label>
                    <div className={cn(
                        "relative border-2 border-dashed border-border rounded-2xl p-8 transition-all group",
                        file ? "bg-primary/5 border-primary/50" : "hover:border-primary/30 hover:bg-accent/20"
                    )}>
                        <input
                            type="file"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={handleFileChange}
                            accept=".pdf,image/*"
                        />
                        <div className="flex flex-col items-center justify-center text-center">
                            {file ? (
                                <>
                                    <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary mb-3">
                                        <FileText size={24} />
                                    </div>
                                    <p className="text-sm font-bold truncate max-w-[200px]">{file.name}</p>
                                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB • Ready
                                    </p>
                                </>
                            ) : (
                                <>
                                    <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center text-muted-foreground mb-3 group-hover:scale-110 transition-transform">
                                        <Upload size={24} />
                                    </div>
                                    <p className="text-sm font-bold">Drop files here or click to upload</p>
                                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1">Maximum 10MB per file</p>
                                </>
                            )}
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
                                Initiate Verification
                                <CheckCircle2 className="group-hover:translate-x-1 transition-transform" size={14} />
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};
