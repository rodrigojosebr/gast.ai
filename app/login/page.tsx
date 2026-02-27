"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Header } from "@/components/layout/Header";
import { MainContent } from "@/components/layout/MainContent";
import { TextInput } from "@/components/ui/TextInput";
import { ActionButton } from "@/components/ui/ActionButton";
import { EyeIcon, EyeOffIcon } from "@/components/ui/EyeIcons";
import { css } from "@/styled-system/css";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push("/voice");
    }
  };

  return (
    <Container>
      <Header>
        <div className={css({ display: "flex", alignItems: "center", gap: "0.6rem" })}>
          <img src="/logo.svg" alt="Gast.ai Logo" className={css({ width: "32px", height: "32px" })} />
          <h1 className={css({ fontSize: "1.6rem", color: "#fff", fontWeight: "900", margin: 0 })}>
            Gast.ai
          </h1>
        </div>
      </Header>
      
      <MainContent pushDown={false}>
        <div className={css({ maxWidth: "400px", margin: "0 auto", width: "100%", padding: "2rem", backgroundColor: "#1a1a1a", borderRadius: "12px", border: "1px solid #333" })}>
          <h2 className={css({ color: "#fff", marginBottom: "1.5rem", fontSize: "1.5rem", textAlign: "center" })}>
            Login
          </h2>
          
          <form onSubmit={handleLogin} className={css({ display: "flex", flexDirection: "column", gap: "1.5rem" })}>
            <div>
              <label className={css({ color: "#aaa", fontSize: "0.9rem", marginBottom: "0.5rem", display: "block", textAlign: "left" })}>
                Email
              </label>
              <TextInput 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="seu@email.com" 
                required 
              />
            </div>
            
            <div>
              <label className={css({ color: "#aaa", fontSize: "0.9rem", marginBottom: "0.5rem", display: "block", textAlign: "left" })}>
                Senha
              </label>
              <div className={css({ position: "relative", width: "100%" })}>
                <TextInput 
                  type={isPasswordVisible ? "text" : "password"} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="Sua senha" 
                  required 
                />
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  className={css({
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#888",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  })}
                  aria-label={isPasswordVisible ? "Esconder senha" : "Mostrar senha"}
                >
                  {isPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {error && <p className={css({ color: "#ff4d4f", fontSize: "0.9rem", textAlign: "center", margin: "0.5rem 0" })}>{error}</p>}
            
            <div className={css({ marginTop: "1rem" })}>
              <ActionButton width="100%" disabled={loading} type="submit">
                {loading ? "Entrando..." : "Entrar"}
              </ActionButton>
            </div>
          </form>

          <div className={css({ marginTop: "1.5rem", textAlign: "center", color: "#888", fontSize: "0.9rem" })}>
            Não tem uma conta? <Link href="/register" className={css({ color: "#007aff", textDecoration: "none", _hover: { textDecoration: "underline" } })}>Cadastre-se</Link>
          </div>
        </div>
      </MainContent>
    </Container>
  );
}
