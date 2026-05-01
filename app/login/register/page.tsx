"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Terminal, Loader2, ArrowLeft } from "lucide-react";
import { api } from "../../services/api";

export default function RegisterPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [theme, setTheme] = useState("green");

    useEffect(() => {
        if (typeof document !== "undefined") {
            const match = document.cookie.match(new RegExp(`(?:^|; )pref_theme=([^;]*)`));
            if (match) setTheme(decodeURIComponent(match[1]));
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg("");
        setSuccessMsg("");

        try {
            await api.post("/user", { email, password });

            setSuccessMsg("Conta criada com sucesso! Redirecionando...");

            setTimeout(() => {
                router.push("/login");
            }, 1500);

        } catch (err: any) {
            const serverMessage = err.response?.data?.message || err.response?.data;

            setErrorMsg(
                typeof serverMessage === "string"
                    ? serverMessage
                    : "Erro ao criar conta. Este e-mail já está em uso ou houve falha na conexão."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div data-theme={theme} className="min-h-screen w-full bg-sys-bg font-mono text-sys-fg flex flex-col items-center justify-center p-4 transition-colors duration-300">

            <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-sys-muted hover:text-sys-accent transition-colors">
                <ArrowLeft size={20} />
                <span className="text-sm tracking-widest uppercase">Voltar ao Terminal</span>
            </Link>

            <div className="w-full max-w-md bg-sys-bg border border-sys-border shadow-[0_0_20px_var(--sys-shadow)] p-8 relative">

                <div className="flex flex-col items-center border-b border-sys-border pb-6 mb-6">
                    <Terminal size={40} className="text-sys-accent mb-4" />
                    <h1 className="text-2xl font-bold tracking-widest text-sys-accent">SYS_REGISTER</h1>
                    <p className="text-xs text-sys-muted-light mt-2 uppercase">Solicitação de Acesso</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs uppercase text-sys-muted-light mb-2">Novo E-mail</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 bg-sys-panel/20 border border-sys-dark text-sys-fg focus:border-sys-accent outline-none transition-colors shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]"
                            placeholder="root@botboy.com"
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase text-sys-muted-light mb-2">Definir Senha</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 bg-sys-panel/20 border border-sys-dark text-sys-fg focus:border-sys-accent outline-none transition-colors shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]"
                            placeholder="••••••••"
                            minLength={6}
                        />
                    </div>

                    {errorMsg && (
                        <div className="text-xs p-3 border text-red-400 border-red-900 bg-red-950/20 animate-pulse">
                            [ ERRO ] {errorMsg}
                        </div>
                    )}

                    {successMsg && (
                        <div className="text-xs p-3 border text-sys-accent border-sys-accent bg-sys-dark/20">
                            [ OK ] {successMsg}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading || !!successMsg}
                        className="w-full p-4 mt-6 border border-sys-accent bg-sys-dark/20 text-sys-accent-light hover:bg-sys-dark/50 transition-all font-bold tracking-widest cursor-pointer flex justify-center items-center gap-3 shadow-[inset_2px_0_0_var(--sys-accent)] disabled:opacity-50"
                    >
                        {isLoading && <Loader2 size={18} className="animate-spin" />}
                        {isLoading ? "[ PROCESSANDO... ]" : "[ CADASTRAR ]"}
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-sys-border/50 pt-6">
                    <p className="text-xs text-sys-muted">
                        Já possui acesso autorizado? <br />
                        <Link href="/login" className="text-sys-accent hover:text-sys-accent-light font-bold mt-2 inline-block transition-colors">
                            [ VOLTAR PARA LOGIN ]
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    );
}