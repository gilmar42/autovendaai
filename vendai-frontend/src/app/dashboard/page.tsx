"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Stat = { label: string; value: string; trend: string };
type Activity = { id: string; message: string; date: string; amount: number };

export default function Dashboard() {
  const [stats, setStats] = useState<Stat[]>([
    { label: "Vendas Totais", value: "R$ 0,00", trend: "..." },
    { label: "Conversão IA", value: "0%", trend: "..." },
    { label: "Leads Ativos", value: "0", trend: "..." },
    { label: "Economia (Horas)", value: "0h", trend: "..." },
  ]);
  
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get("/dashboard/stats");
        if (response.data) {
          setStats(response.data.stats);
          setActivities(response.data.activities);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold mb-2">Painel Analítico</h1>
          <p className="text-gray-400 font-medium">Visão geral do desempenho do seu Agente de Vendas IA</p>
        </div>
        <div className="glass px-4 py-2 text-sm font-bold border-indigo-500/30">
          Últimos 30 dias
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="glass p-6 hover:border-indigo-500/50 transition-all cursor-pointer group relative overflow-hidden">
            {isLoading && <div className="absolute inset-0 bg-white/5 animate-pulse"></div>}
            <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
            <div className="flex justify-between items-end">
              <h2 className="text-3xl font-black">{stat.value}</h2>
              <span className="text-green-400 text-sm font-bold bg-green-400/10 px-2 py-1 rounded-lg">
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass p-8 min-h-[400px]">
          <h3 className="text-xl font-bold mb-6">Performance de Vendas (IA)</h3>
          <div className="h-64 w-full bg-indigo-500/5 rounded-xl border border-dashed border-indigo-500/20 flex items-center justify-center text-gray-500">
            [O gráfico dinâmico será implementado aqui]
          </div>
        </div>
        <div className="glass p-8 bg-indigo-500/5 relative overflow-hidden">
          {isLoading && <div className="absolute inset-0 bg-white/5 animate-pulse"></div>}
          <h3 className="text-xl font-bold mb-6">Atividades Recentes</h3>
          <div className="space-y-6">
            {activities.length > 0 ? (
              activities.map((act) => (
                <div key={act.id} className="flex gap-4 items-center">
                  <div className="w-2 h-2 rounded-full bg-indigo-400 shadow-lg shadow-indigo-400/50"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{act.message}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(act.date).toLocaleDateString("pt-BR", { hour: "2-digit", minute: "2-digit" })} • R$ {act.amount.toFixed(2).replace(".", ",")}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center mt-10">Nenhuma atividade recente.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
