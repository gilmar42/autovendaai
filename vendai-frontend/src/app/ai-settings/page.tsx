"use client";

export default function AISettings() {
  const steps = [
    { title: "Construtor de Contexto", desc: "Coleta histórico e metadados do cliente", status: "Ativo" },
    { title: "Classificador de Intenção", desc: "Identifica se o cliente quer comprar, perguntar ou reclamar", status: "Ativo" },
    { title: "Motor de Recuperação", desc: "Busca produtos e informações no catálogo", status: "Ativo" },
    { title: "Estratégia de Vendas", desc: "Aplica técnicas de gatilho mental e escassez", status: "Ativo" },
    { title: "Gerador de Respostas (IA)", desc: "Gera a resposta final personalizada", status: "Ativo" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2">Configurações da AI Engine</h1>
        <p className="text-gray-400 font-medium">Controle o cérebro do seu Agente de Vendas</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="glass p-8">
            <h3 className="text-xl font-bold mb-6 flex justify-between items-center">
              Pipeline de Processamento
              <span className="text-xs bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full border border-indigo-500/30">Pipeline v1.2</span>
            </h3>
            <div className="space-y-8 relative">
              <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-linear-to-b from-indigo-500 to-purple-500 opacity-20"></div>
              {steps.map((step, i) => (
                <div key={i} className="relative pl-10">
                  <div className="absolute left-0 w-8 h-8 rounded-full bg-indigo-500/10 border-2 border-indigo-500/50 flex items-center justify-center font-bold text-sm text-indigo-300 z-10 bg-background">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{step.title}</h4>
                    <p className="text-sm text-gray-500 mb-2">{step.desc}</p>
                    <span className="text-[10px] uppercase font-black text-green-400 tracking-widest">{step.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass p-8 bg-indigo-500/5">
            <h3 className="text-xl font-bold mb-6">Personalidade & Tom de Voz</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">
                  Comportamento Principal
                </label>
                <select className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-indigo-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236366f1%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-size-[20px] bg-position-[right_1rem_center] bg-no-repeat">
                  <option className="bg-[#1a1a2e] text-white">Consultor Proativo (Foco em Conversão)</option>
                  <option className="bg-[#1a1a2e] text-white">Suporte Amigável (Foco em Retenção)</option>
                  <option className="bg-[#1a1a2e] text-white">Especialista Técnico (Foco em Detalhes)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">
                  Nível de Persuasão
                </label>
                <div className="relative pt-2">
                  <input
                    type="range"
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400"
                  />
                  <div className="flex justify-between text-[10px] text-gray-500 mt-3 font-bold uppercase tracking-wider">
                    <span>Informativo</span>
                    <span>Equilibrado</span>
                    <span>Agressivo</span>
                  </div>
                </div>
              </div>
              <button className="btn-primary w-full py-4 mt-4">Salvar Configurações</button>
            </div>
          </div>

          <div className="glass p-8 border-dashed border-white/10 opacity-60">
            <h3 className="text-xl font-bold mb-4">Prompt Customizado (Pro)</h3>
            <p className="text-sm text-gray-400 mb-4 italic">
              &quot;Você é um corretor de imóveis de luxo focado em...&quot;
            </p>
            <div className="text-xs text-indigo-400 font-bold bg-indigo-400/10 p-4 rounded-xl">
              Disponível apenas no plano Premium
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
