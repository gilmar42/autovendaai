"use client";
import { useState, useEffect, useCallback } from 'react';
import api from '@/services/api';

interface Product {
  id: string;
  name: string;
  stock: number;
}

export default function Inventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('products');
      setProducts(res.data);
    } catch (err) {
      console.error("Erro ao buscar estoque:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateStock = async (id: string, currentStock: number, delta: number) => {
    const newStock = Math.max(0, currentStock + delta);
    try {
      // No backend PUT completo, precisamos enviar o objeto todo. 
      // Buscamos o produto primeiro ou assumimos os outros campos
      const prodRes = await api.get(`products/${id}`);
      const updatedProd = { ...prodRes.data, stock: newStock };
      await api.put(`products/${id}`, updatedProd);
      
      // Update local state optimizing UX
      setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: newStock } : p));
    } catch (err) {
      console.error("Erro ao atualizar estoque:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pb-20">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2">Gestão de Estoque</h1>
        <p className="text-gray-400">Controle de suprimentos e alertas de reposição</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="glass p-8 border-indigo-500/20">
          <p className="text-gray-500 text-sm uppercase font-black mb-1">Total de Itens</p>
          <h2 className="text-4xl font-black">{products.reduce((acc, p) => acc + p.stock, 0)}</h2>
        </div>
        <div className="glass p-8 border-red-500/20">
          <p className="text-red-400 text-sm uppercase font-black mb-1">Estoque Crítico</p>
          <h2 className="text-4xl font-black text-red-500">
            {products.filter(p => p.stock < 10).length}
          </h2>
        </div>
        <div className="glass p-8 border-green-500/20">
          <p className="text-green-400 text-sm uppercase font-black mb-1">Status do Galpão</p>
          <h2 className="text-4xl font-black text-green-500">Operacional</h2>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="glass overflow-hidden border-indigo-500/20">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-gray-400 text-sm uppercase font-bold">
              <tr>
                <th className="px-8 py-4">Produto</th>
                <th className="px-8 py-4">Quantidade Atual</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4 text-center">Ajuste Rápido</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="font-bold">{p.name}</div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest font-black">ID: {p.id.slice(-6)}</div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`text-2xl font-black ${p.stock < 10 ? 'text-red-500' : 'text-white'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    {p.stock < 10 ? (
                      <span className="px-3 py-1 bg-red-500/10 text-red-400 text-[10px] font-black uppercase rounded-full border border-red-500/20 animate-pulse">
                        Sinal Crítico
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-green-500/10 text-green-400 text-[10px] font-black uppercase rounded-full border border-green-500/20">
                        Normal
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex justify-center gap-3">
                      <button 
                        onClick={() => updateStock(p.id, p.stock, -1)}
                        className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold hover:bg-red-500/20 hover:border-red-500/40 transition-all"
                      >
                        -
                      </button>
                      <button 
                        onClick={() => updateStock(p.id, p.stock, 1)}
                        className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold hover:bg-green-500/20 hover:border-green-500/40 transition-all"
                      >
                        +
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-10 text-center text-gray-500">
                    Nenhum produto em estoque.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
