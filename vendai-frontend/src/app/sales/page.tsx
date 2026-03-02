"use client";
import { useState } from 'react';

export default function SalesTerminal() {
  const [cart] = useState([
    { id: 1, name: "Consultoria AI Express", price: 299.00, qty: 1 },
    { id: 2, name: "Planilha de Gestão Pro", price: 49.90, qty: 2 },
  ]);

  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2 space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Terminal de Vendas</h1>
          <p className="text-gray-400 font-medium">Histórico de transações e vendas assistidas</p>
        </div>

        <div className="glass p-8">
          <h3 className="text-xl font-bold mb-6">Últimas Transações</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5 hover:border-indigo-500/30 transition-all cursor-pointer">
                <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold">
                    #{1024 + i}
                  </div>
                  <div>
                    <p className="font-bold text-lg">Gilmar Dutra</p>
                    <p className="text-sm text-gray-500">Há {i * 15 + 10} minutos • 2 itens</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-xl text-indigo-300">R$ { (348.90 + i * 10).toFixed(2) }</p>
                  <p className="text-xs font-bold text-green-400">Pago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="glass p-8 border-indigo-500/40 shadow-2xl shadow-indigo-500/10">
          <h3 className="text-xl font-bold mb-6">Checkout em Aberto</h3>
          <div className="space-y-4 mb-8">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-bold">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.qty} un x R$ {item.price.toFixed(2)}</p>
                </div>
                <p className="font-bold text-gray-300">R$ {(item.price * item.qty).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-6 space-y-4 mb-8">
            <div className="flex justify-between text-gray-400">
              <span>Subtotal</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-black text-2xl text-white">
              <span>Total</span>
              <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-400">
                R$ {total.toFixed(2)}
              </span>
            </div>
          </div>

          <button className="btn-primary w-full py-4 text-lg shadow-xl shadow-indigo-500/40">
            Confirmar Pagamento
          </button>
        </div>

        <div className="glass p-6 bg-indigo-500/10 border-indigo-500/20">
          <p className="text-sm text-center text-indigo-300 font-medium italic">
            &quot;A IA recomendou o curso baseado no interesse em ferramentas de automação.&quot;
          </p>
        </div>
      </div>
    </div>
  );
}
