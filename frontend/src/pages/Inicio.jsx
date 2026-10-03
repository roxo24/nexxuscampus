// src/pages/Inicio.jsx
import React from 'react';
import { Rocket, Sparkles } from 'lucide-react';

export default function Inicio() {
  return (
    <div className="p-8">
      {/* Banner Principal de Canva Slide 1 */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white rounded-3xl p-10 shadow-2xl relative overflow-hidden">
        <span className="bg-purple-500/20 text-purple-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-purple-500/30">
          Tu Campus de Ideas
        </span>
        <h1 className="text-4xl font-extrabold mt-4 max-w-xl leading-tight">
          Las grandes ideas no nacen solas.
        </h1>
        <p className="text-slate-300 mt-3 max-w-lg text-sm leading-relaxed">
          Descubre proyectos que están buscando una mente como la tuya o encuentra el talento multidisciplinario que llevará tu idea más lejos.
        </p>
        <div className="mt-8 flex gap-4">
          <button className="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2">
            <Sparkles size={18} /> Explorar Talento
          </button>
          <button className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl backdrop-blur-sm transition-all border border-white/10">
            Crear un proyecto +
          </button>
        </div>
      </div>
    </div>
  );
}