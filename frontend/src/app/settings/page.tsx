"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { User, Bell, Shield, Globe, Moon } from "lucide-react";

export default function SettingsPage() {
    return (
        <DashboardLayout>
            <div className="max-w-4xl space-y-8">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
                    <p className="text-muted-foreground">Configure your platform preferences and security</p>
                </div>

                <div className="bg-card border rounded-xl shadow-sm divide-y">
                    {/* Profile Section */}
                    <div className="p-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                <User size={24} />
                            </div>
                            <div>
                                <h3 className="font-semibold">Profile Information</h3>
                                <p className="text-xs text-muted-foreground">Update your personal details and avatar</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase text-muted-foreground">Full Name</label>
                                <input type="text" defaultValue="Alex Rivera" className="w-full bg-accent/50 border-none rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase text-muted-foreground">Email Address</label>
                                <input type="email" defaultValue="alex@smartreconcile.com" className="w-full bg-accent/50 border-none rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary" />
                            </div>
                        </div>
                    </div>

                    {/* Security Section */}
                    <div className="p-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-warning/10 text-warning flex items-center justify-center">
                                <Shield size={24} />
                            </div>
                            <div>
                                <h3 className="font-semibold">Security & Access</h3>
                                <p className="text-xs text-muted-foreground">Manage password and two-factor authentication</p>
                            </div>
                        </div>
                        <button className="text-sm font-semibold border px-4 py-2 rounded-lg hover:bg-accent transition-colors">Change Password</button>
                    </div>

                    {/* System Section */}
                    <div className="p-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-success/10 text-success flex items-center justify-center">
                                <Globe size={24} />
                            </div>
                            <div>
                                <h3 className="font-semibold">System Preferences</h3>
                                <p className="text-xs text-muted-foreground">Localization and interface settings</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Moon size={18} className="text-muted-foreground" />
                                <span className="text-sm font-medium">Dark Mode Appearance</span>
                            </div>
                            <div className="w-10 h-5 bg-primary rounded-full relative">
                                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <button className="px-6 py-2 rounded-xl text-sm font-medium hover:bg-accent transition-colors">Cancel</button>
                    <button className="px-6 py-2 bg-primary text-white rounded-xl text-sm font-semibold shadow-sm hover:bg-primary/90 transition-all">Save Changes</button>
                </div>
            </div>
        </DashboardLayout>
    );
}
