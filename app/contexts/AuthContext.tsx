"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { api } from "../services/api";

interface AuthContextType {
    isLoggedIn: boolean;
    token: string | null;
    signIn: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const savedToken = Cookies.get("botboy_jwt");
        if (savedToken) {
            setToken(savedToken);
            setIsLoggedIn(true);
        }
        setIsReady(true);
    }, []);

    const signIn = async (email: string, password: string) => {
        try {
            // Chamada limpa usando o Axios
            const response = await api.post("/auth/login", { email, password });

            const jwtToken = response.data.token;

            Cookies.set("botboy_jwt", jwtToken, {
                expires: 7,
                path: "/",
                sameSite: "Lax"
            });

            setToken(jwtToken);
            setIsLoggedIn(true);
            router.push("/");

        } catch (error) {
            throw new Error("Credenciais inválidas ou erro no servidor");
        }
    };

    const logout = () => {
        Cookies.remove("botboy_jwt", { path: "/" });
        setToken(null);
        setIsLoggedIn(false);
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, token, signIn, logout }}>
            <div style={{ visibility: isReady ? "visible" : "hidden", height: "100%" }}>
                {children}
            </div>
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth deve ser usado dentro de um AuthProvider");
    }
    return context;
}