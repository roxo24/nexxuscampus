// src/App.jsx
import React from 'react';
import Inicio from './pages/Inicio';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Navbar Superior */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md shadow-purple-600/30">
            N
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-600">
            NexusCampus
          </span>
        </div>
        <span className="text-xs bg-purple-50 text-purple-700 font-semibold px-3 py-1.5 rounded-full border border-purple-200">
          UNP - Universidad Nacional de Piura
        </span>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto">
        <Inicio />
      </main>
    </div>
  );
}