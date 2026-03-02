"use client";

export default function Dashboard() {
  const stats = [
    { label: "Vendas Totais", value: "R$ 45.280", trend: "+12%" },
    { label: "Conversão IA", value: "24.5%", trend: "+5%" },
    { label: "Leads Ativos", value: "1,240", trend: "+18%" },
    { label: "Economia (Horas)", value: "180h", trend: "+25%" },
  ];

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
          <div key={i} className="glass p-6 hover:border-indigo-500/50 transition-all cursor-pointer group">
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
            [O gráfico de conversão aparecerá aqui]
          </div>
        </div>
        <div className="glass p-8">
          <h3 className="text-xl font-bold mb-6">Atividades da IA</h3>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((_, i) => (
              <div key={i} className="flex gap-4 items-center">
                <div className="w-2 h-2 rounded-full bg-indigo-400 shadow-lg shadow-indigo-400/50"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Nova venda gerada pelo Agente #01</p>
                  <p className="text-xs text-gray-500">Há 5 minutos • R$ 240,00</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
