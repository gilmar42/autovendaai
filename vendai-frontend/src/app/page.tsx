"use client";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] -z-10"></div>

      <main className="max-w-7xl mx-auto px-6 pt-20 pb-32">
        {/* Hero Section */}
        <div className="text-center space-y-8 py-20">
          <div className="inline-block px-4 py-1.5 glass text-indigo-400 text-sm font-bold tracking-widest uppercase mb-4 animate-bounce">
            Nova Era de Vendas Chegou
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-6">
            A Revolução das <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Vendas com IA
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-400 font-medium leading-relaxed">
            Sua plataforma SaaS multi-tenant definitiva para automação de vendas, 
            atendimento multicanal e inteligência comercial de ponta.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
            <Link href="/dashboard" className="btn-primary text-lg py-5 px-10 shadow-2xl shadow-indigo-500/40">
              Acessar Painel Analítico
            </Link>
            <Link href="/sales" className="glass px-10 py-5 font-bold hover:bg-white/5 transition-all text-lg border-white/10 flex items-center justify-center">
              Ver Demonstração
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-20">
          <div className="glass p-10 hover:border-indigo-500/40 transition-all group">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
              🚀
            </div>
            <h3 className="text-2xl font-bold mb-4">Escala Infinita</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              Atenda milhares de clientes simultaneamente sem perder a qualidade ou o toque humano na conversão.
            </p>
          </div>
          <div className="glass p-10 hover:border-purple-500/40 transition-all group">
            <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
              🤖
            </div>
            <h3 className="text-2xl font-bold mb-4">IA Generativa</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              Motor de IA treinado para entender intenções de compra, lidar com objeções e fechar pedidos sozinho.
            </p>
          </div>
          <div className="glass p-10 hover:border-pink-500/40 transition-all group">
            <div className="w-12 h-12 bg-pink-500/10 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
              🌍
            </div>
            <h3 className="text-2xl font-bold mb-4">Multi-Tenant</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              Arquitetura robusta preparada para múltiplos parceiros e empresas, totalmente isolada e segura.
            </p>
          </div>
        </div>

        {/* Social Proof Placeholder */}
        <div className="mt-32 text-center opacity-50">
          <p className="text-xs uppercase font-black tracking-[0.3em] mb-8">Tecnologia de Confiança</p>
          <div className="flex flex-wrap justify-center gap-12 grayscale">
            <div className="text-2xl font-black">FastAPI</div>
            <div className="text-2xl font-black">Next.js</div>
            <div className="text-2xl font-black">MongoDB</div>
            <div className="text-2xl font-black">Redis</div>
          </div>
        </div>
      </main>
    </div>
  );
}
