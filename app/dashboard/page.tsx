"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { css } from "../../styled-system/css";
import { Container } from "@/components/layout/Container";
import { Header } from "@/components/layout/Header";
import { MainContent } from "@/components/layout/MainContent";
import { ActionButton } from "@/components/ui/ActionButton";
import { MicIcon } from "@/components/ui/MicIcon";
import { InstallPWA } from "@/components/features/InstallPWA";

interface Expense {
  id: string;
  amountCents: number;
  description: string;
  paymentMethod: string;
  date: string;
}

export default function DashboardPage() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.push("/login");
    }
  }, [sessionStatus, router]);

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      fetchExpenses();
    }
  }, [sessionStatus]);

  const fetchExpenses = async () => {
    try {
      const response = await fetch("/api/gasto");
      if (response.ok) {
        const data = await response.json();
        setExpenses(data);
      }
    } catch (error) {
      console.error("Erro ao buscar gastos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este gasto?")) return;

    try {
      const response = await fetch(`/api/gasto/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setExpenses(expenses.filter((e) => e.id !== id));
      } else {
        alert("Erro ao excluir gasto");
      }
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  };

  const formatCurrency = (cents: number) => {
    return (cents / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  if (sessionStatus === "loading" || loading) {
    return (
      <Container>
        <div className={css({ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' })}>
          <p>Carregando seus gastos...</p>
        </div>
      </Container>
    );
  }

  const totalAmount = expenses.reduce((acc, curr) => acc + curr.amountCents, 0);

  return (
    <Container>
      <Header>
        <div className={css({ display: 'flex', alignItems: 'center', gap: '1rem' })}>
          <img src="/logo.svg" alt="Gast.ai" className={css({ width: '40px', height: '40px' })} />
          <h1 className={css({ fontSize: '1.5rem', fontWeight: 'bold' })}>Meus Gastos</h1>
        </div>
        <div className={css({ display: 'flex', alignItems: 'center', gap: '0.5rem' })}>
          <InstallPWA />
          <button
            onClick={() => router.push("/voice")}
            className={css({
              background: '#333',
              border: 'none',
              color: 'white',
              padding: '10px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.1)' }
            })}
            aria-label="Ir para Gravador de Voz"
          >
            <MicIcon recording={false} />
          </button>
        </div>
      </Header>

      <MainContent pushDown={false}>
        <div className={css({ 
          backgroundColor: '#222', 
          padding: '1.5rem', 
          borderRadius: '16px', 
          marginBottom: '2rem',
          border: '1px solid #333'
        })}>
          <p className={css({ color: '#888', fontSize: '0.9rem', marginBottom: '0.5rem' })}>Total Acumulado</p>
          <h2 className={css({ fontSize: '2rem', fontWeight: 'bold', color: '#4ade80' })}>
            {formatCurrency(totalAmount)}
          </h2>
        </div>

        <div className={css({ display: 'flex', flexDirection: 'column', gap: '1rem' })}>
          {expenses.length === 0 ? (
            <p className={css({ textAlign: 'center', color: '#666', marginTop: '2rem' })}>
              Nenhum gasto registrado ainda.
            </p>
          ) : (
            expenses.map((expense) => (
              <div 
                key={expense.id}
                className={css({
                  backgroundColor: '#1a1a1a',
                  padding: '1rem',
                  borderRadius: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: '1px solid #333'
                })}
              >
                <div>
                  <h3 className={css({ fontWeight: 'bold', fontSize: '1.1rem' })}>{expense.description}</h3>
                  <p className={css({ color: '#888', fontSize: '0.8rem' })}>
                    {formatDate(expense.date)} • {expense.paymentMethod}
                  </p>
                </div>
                <div className={css({ display: 'flex', alignItems: 'center', gap: '1rem' })}>
                  <span className={css({ fontWeight: 'bold', color: '#fff' })}>
                    {formatCurrency(expense.amountCents)}
                  </span>
                  <button
                    onClick={() => handleDelete(expense.id)}
                    className={css({
                      background: 'none',
                      border: 'none',
                      color: '#ef4444',
                      cursor: 'pointer',
                      padding: '5px',
                      '&:hover': { color: '#ff6666' }
                    })}
                    aria-label="Excluir gasto"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </MainContent>
    </Container>
  );
}
