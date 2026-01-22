"use client";

import React, { useState } from "react";
import { ShieldCheck, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { login } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            await login(formData);
        } catch (err: any) {
            setError(err || "Invalid credentials");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <div className="mx-auto w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white mb-4 shadow-lg shadow-primary/20">
                        <ShieldCheck size={28} />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
                    <p className="text-muted-foreground mt-2">Enter your credentials to access your account</p>
                </div>

                <div className="bg-card border rounded-2xl p-8 shadow-sm">
                    <form className="space-y-6" onSubmit={handleLogin}>
                        {error && (
                            <div className="bg-danger/10 text-danger p-3 rounded-lg text-sm font-medium border border-danger/20">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground ml-1">Email Address</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="admin@smartreconcile.com"
                                className="w-full px-4 py-3 bg-accent/50 border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-medium text-foreground">Password</label>
                                <a href="#" className="text-xs text-primary hover:underline font-medium">Forgot password?</a>
                            </div>
                            <input
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 bg-accent/50 border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary text-white py-3 rounded-xl font-semibold shadow-md shadow-primary/10 hover:bg-primary/90 transition-all active:scale-[0.98] flex items-center justify-center"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Sign In"}
                        </button>
                    </form>
                </div>

                <p className="text-center text-sm text-muted-foreground">
                    Don't have an account? <a href="#" className="text-primary font-medium hover:underline">Contact your administrator</a>
                </p>
            </div>
        </div>
    );
}
