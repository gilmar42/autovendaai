"use client";
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { FiLogOut, FiUser } from 'react-icons/fi';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="fixed top-0 w-full z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto glass px-8 py-3 flex justify-between items-center bg-white/10 backdrop-blur-md rounded-2xl shadow-sm border border-white/5">
        <Link href="/" className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
          VendAI
        </Link>
        
        <div className="flex gap-8 items-center font-medium">
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className="hover:text-indigo-400 transition-colors">Dashboard</Link>
              <Link href="/catalog" className="hover:text-indigo-400 transition-colors">Catálogo</Link>
              <Link href="/inventory" className="hover:text-indigo-400 transition-colors">Estoque</Link>
              <Link href="/sales" className="hover:text-indigo-400 transition-colors">Vendas</Link>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('toggle-ai-chat'))}
                className="hover:text-indigo-400 transition-colors font-medium cursor-pointer"
              >
                Agente IA
              </button>
              <Link href="/ai-settings" className="hover:text-indigo-400 transition-colors">AI Engine</Link>
              
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-white/10">
                <div className="flex items-center gap-2 text-sm">
                  <FiUser className="text-indigo-400" />
                  <span className="text-muted-foreground">{user?.name?.split(' ')[0]}</span>
                </div>
                <button 
                  onClick={logout}
                  className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-full hover:bg-destructive/10"
                  title="Sair"
                >
                  <FiLogOut />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-indigo-400 transition-colors">
                Entrar
              </Link>
              <Link href="/register" className="btn-primary shadow-lg shadow-indigo-500/20 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-all">
                Criar Conta
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
