"use client";
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto glass px-8 py-3 flex justify-between items-center bg-white/10 backdrop-blur-md">
        <Link href="/" className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
          VendAI
        </Link>
        <div className="flex gap-8 items-center font-medium">
          <Link href="/dashboard" className="hover:text-indigo-400 transition-colors">Dashboard</Link>
          <Link href="/catalog" className="hover:text-indigo-400 transition-colors">Catálogo</Link>
          <Link href="/inventory" className="hover:text-indigo-400 transition-colors">Estoque</Link>
          <Link href="/sales" className="hover:text-indigo-400 transition-colors">Vendas</Link>
          <Link href="/ai-settings" className="hover:text-indigo-400 transition-colors">AI Engine</Link>
          <button 
            onClick={() => window.dispatchEvent(new Event('toggle-ai-chat'))}
            className="btn-primary shadow-lg shadow-indigo-500/20"
          >
            Falar com IA
          </button>
        </div>
      </div>
    </nav>
  );
}
