"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { setCookie, deleteCookie, getCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface User {
    id: number;
    email: string;
    roles: string[];
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (credentials: any) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (token) {
            try {
                const storedUser = sessionStorage.getItem("user");
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                logout();
            }
        }
        setLoading(false);
    }, [router]);

    const login = async (credentials: any) => {
        try {
            const response = await api.post("auth/signin", credentials);
            const { token, id, email, roles } = response.data;

            sessionStorage.setItem("token", token);
            const userData = { id, email, roles };
            setUser(userData);
            sessionStorage.setItem("user", JSON.stringify(userData));

            router.push("/dashboard");
        } catch (error: any) {
            throw error.response?.data?.message || "Login failed";
        }
    };

    const logout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        setUser(null);
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
