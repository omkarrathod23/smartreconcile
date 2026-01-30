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
        <div className="min-h-screen flex items-stretch bg-[#0A0F1E] font-sans selection:bg-primary/30 text-zinc-100 overflow-hidden">
            {/* Left Section: Visual Branding & High-Impact Narrative */}
            <div className="hidden lg:flex lg:w-[55%] relative items-center justify-center border-r border-white/5">
                {/* Dynamic Background */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/login-bg-v2.png"
                        alt="Enterprise Fintech Visual"
                        className="w-full h-full object-cover opacity-40 scale-110 object-center transition-transform duration-[20000ms] ease-linear hover:scale-125"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0A0F1E] via-[#0A0F1E]/50 to-transparent" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
                </div>

                <div className="relative z-10 p-20 max-w-2xl">
                    <div className="mb-12 inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground/80">Enterprise Secure Portal</span>
                    </div>

                    <h1 className="text-6xl font-black tracking-tight leading-[1.1] mb-8 bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent">
                        Reconcile with <br />
                        <span className="text-primary italic">Absolute Precision.</span>
                    </h1>

                    <p className="text-xl text-zinc-400 leading-relaxed mb-12 max-w-lg">
                        SmartReconcile leverages next-generation automation to harmonize global vendor billing and payments.
                    </p>

                    <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-12">
                        <div>
                            <div className="text-3xl font-bold text-white mb-1">Global</div>
                            <div className="text-sm text-zinc-500 uppercase tracking-widest font-semibold italic">Standard</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white mb-1">Zero</div>
                            <div className="text-sm text-zinc-500 uppercase tracking-widest font-semibold italic">Error Policy</div>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute bottom-12 left-12 flex items-center gap-2 text-zinc-600 text-xs tracking-tighter uppercase font-mono">
                    <div className="w-8 h-[1px] bg-zinc-800" />
                    <span>System Version 2.0.4 - Core Architecture</span>
                </div>
            </div>

            {/* Right Section: Refined Login Module */}
            <div className="w-full lg:w-[45%] flex flex-col items-center justify-center p-8 lg:p-16 relative bg-[#0A0F1E]">
                {/* Ambient Glows */}
                <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -mr-[250px] pointer-events-none" />
                <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -ml-[200px] pointer-events-none" />

                <div className="w-full max-w-[420px] relative z-10">
                    <div className="text-center lg:text-left mb-12">
                        <div className="inline-flex lg:hidden mb-6 w-16 h-16 rounded-2xl bg-primary/20 backdrop-blur-xl border border-primary/30 items-center justify-center text-primary shadow-2xl shadow-primary/20">
                            <ShieldCheck size={36} />
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-3 tracking-tight">Login</h2>
                        <p className="text-zinc-500 font-medium">Please enter your authorized credentials</p>
                    </div>

                    {/* Ultra-Glass Form Container */}
                    <div className="relative group">
                        <div className="absolute -inset-[1px] bg-gradient-to-b from-white/10 to-transparent rounded-[32px] pointer-events-none" />
                        <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[32px] p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]">
                            <form className="space-y-8" onSubmit={handleLogin}>
                                {error && (
                                    <div className="bg-red-500/10 text-red-400 p-4 rounded-xl text-xs font-bold border border-red-500/20 animate-in fade-in slide-in-from-top-4 uppercase tracking-widest text-center">
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                                            Organization Email
                                        </label>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="admin@smartreconcile.com"
                                            className="w-full px-6 py-5 bg-white/[0.03] border border-white/5 rounded-2xl outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 focus:bg-white/[0.05] transition-all text-sm placeholder:text-zinc-700"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                                            Access Token
                                        </label>
                                        <a href="#" className="text-[10px] uppercase tracking-widest font-black text-primary/80 hover:text-primary transition-colors">
                                            Recovery
                                        </a>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            required
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            placeholder="••••••••••••"
                                            className="w-full px-6 py-5 bg-white/[0.03] border border-white/5 rounded-2xl outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 focus:bg-white/[0.05] transition-all text-sm placeholder:text-zinc-700"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full relative group/btn overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary via-[#4F46E5] to-primary bg-[length:200%_100%] animate-gradient group-hover/btn:scale-105 transition-transform duration-500" />
                                    <div className="relative flex items-center justify-center gap-3 bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-[0_20px_40px_-12px_rgba(59,130,246,0.5)] active:scale-[0.98] transition-all disabled:opacity-50">
                                        {isLoading ? (
                                            <Loader2 className="animate-spin" size={20} />
                                        ) : (
                                            <>
                                                System Access
                                                <div className="transition-transform group-hover/btn:translate-x-1">
                                                    <ShieldCheck size={16} />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="mt-12 text-center">
                        <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.2em]">
                            Global Infrastructure Support <br />
                            <a href="#" className="text-zinc-400 hover:text-primary transition-all inline-block mt-2 font-black border-b border-zinc-800 pb-0.5">
                                support@smartreconcile.io
                            </a>
                        </p>
                    </div>
                </div>
            </div>

            {/* Tailwind Custom Keyframes (should ideally be in globals.css but adding here for immediate effect if needed or reference) */}
            <style jsx global>{`
                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animate-gradient {
                    animation: gradient 6s linear infinite;
                }
                .animate-pulse-slow {
                    animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
            `}</style>
        </div>
    );
}
