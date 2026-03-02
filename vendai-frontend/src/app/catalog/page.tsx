"use client";
import { useState, useEffect, useCallback } from 'react';
import api from '@/services/api';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0
  });

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('products');
      setProducts(res.data);
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleOpenModal = (product: Product | null = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', description: '', price: 0, stock: 0 });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.put(`products/${editingProduct.id}`, formData);
      } else {
        await api.post('products', formData);
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      console.error("Erro ao salvar produto:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Deseja realmente excluir este produto?")) {
      try {
        await api.delete(`products/${id}`);
        fetchProducts();
      } catch (err) {
        console.error("Erro ao excluir produto:", err);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pb-20">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold mb-2">Catálogo de Produtos</h1>
          <p className="text-gray-400">Gerencie seus produtos e ofertas para a IA</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="btn-primary"
        >
          + Novo Produto
        </button>
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
                <th className="px-8 py-4">Preço</th>
                <th className="px-8 py-4">Estoque</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="font-bold">{p.name}</div>
                    <div className="text-xs text-gray-500 truncate max-w-xs">{p.description}</div>
                  </td>
                  <td className="px-8 py-5 font-medium text-indigo-300">R$ {p.price.toFixed(2)}</td>
                  <td className="px-8 py-5 text-gray-300">{p.stock}</td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 bg-green-500/10 text-green-400 text-xs font-bold rounded-full border border-green-500/20">
                      Ativo
                    </span>
                  </td>
                  <td className="px-8 py-5 text-gray-500 flex gap-4">
                    <button 
                      onClick={() => handleOpenModal(p)}
                      className="hover:text-white transition-colors"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(p.id)}
                      className="hover:text-red-400 transition-colors"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-10 text-center text-gray-500">
                    Nenhum produto cadastrado. Comece adicionando um novo!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal CRUD */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="glass w-full max-w-lg relative p-8 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-bold mb-6">
              {editingProduct ? 'Editar Produto' : 'Cadastrar Novo Produto'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">Nome do Produto</label>
                <input 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500"
                  placeholder="Ex: Planilha de Gestão"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">Descrição</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 h-24"
                  placeholder="Detalhes do produto para a IA..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">Preço (R$)</label>
                  <input 
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">Estoque Inicial</label>
                  <input 
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value)})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 glass py-4 font-bold hover:bg-white/5 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 btn-primary py-4"
                >
                  {editingProduct ? 'Salvar Mudanças' : 'Cadastrar Produto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
