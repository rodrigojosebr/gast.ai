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

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao registrar");
        setLoading(false);
      } else {
        const signInRes = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });

        if (signInRes?.error) {
          setError(signInRes.error);
          setLoading(false);
        } else {
          router.push("/voice");
        }
      }
    } catch (err: any) {
      setError("Erro de rede. Tente novamente.");
      setLoading(false);
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
            Cadastrar
          </h2>
          
          <form onSubmit={handleRegister} className={css({ display: "flex", flexDirection: "column", gap: "1.5rem" })}>
            <div>
              <label className={css({ color: "#aaa", fontSize: "0.9rem", marginBottom: "0.5rem", display: "block", textAlign: "left" })}>
                Nome
              </label>
              <TextInput 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Seu nome" 
                required 
              />
            </div>
            
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
                  placeholder="Mínimo de 6 caracteres" 
                  required 
                  minLength={6}
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

            <div>
              <label className={css({ color: "#aaa", fontSize: "0.9rem", marginBottom: "0.5rem", display: "block", textAlign: "left" })}>
                Confirmar Senha
              </label>
              <div className={css({ position: "relative", width: "100%" })}>
                <TextInput 
                  type={isConfirmPasswordVisible ? "text" : "password"} 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  placeholder="Confirme sua senha" 
                  required 
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
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
                  aria-label={isConfirmPasswordVisible ? "Esconder senha" : "Mostrar senha"}
                >
                  {isConfirmPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {error && <p className={css({ color: "#ff4d4f", fontSize: "0.9rem", textAlign: "center", margin: "0.5rem 0" })}>{error}</p>}
            
            <div className={css({ marginTop: "1rem" })}>
              <ActionButton width="100%" disabled={loading} type="submit">
                {loading ? "Cadastrando..." : "Criar Conta"}
              </ActionButton>
            </div>
          </form>

          <div className={css({ marginTop: "1.5rem", textAlign: "center", color: "#888", fontSize: "0.9rem" })}>
            Já tem uma conta? <Link href="/login" className={css({ color: "#007aff", textDecoration: "none", _hover: { textDecoration: "underline" } })}>Faça login</Link>
          </div>
        </div>
      </MainContent>
    </Container>
  );
}
