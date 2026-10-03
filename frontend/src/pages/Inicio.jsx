import React, { useEffect, useState } from 'react';
import { AlertCircle, LoaderCircle, Rocket, Sparkles } from 'lucide-react';
import { getProyectos } from '../services/api';

export default function Inicio() {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function cargarProyectos() {
      try {
        setLoading(true);
        setError('');

        const data = await getProyectos();
        setProyectos(data.projects || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    cargarProyectos();
  }, []);

  return (
    <div className="p-8">
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

      <section className="mt-10">
        <div className="flex items-end justify-between mb-5">
          <div>
            <p className="text-sm font-semibold text-purple-600">Desde NexusCampus</p>
            <h2 className="text-2xl font-bold text-slate-900">Proyectos publicados</h2>
          </div>
          <span className="text-sm text-slate-500">{proyectos.length} proyecto(s)</span>
        </div>

        {loading && (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 flex items-center justify-center gap-3 text-slate-500">
            <LoaderCircle className="animate-spin" size={20} />
            Cargando proyectos desde Flask...
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex gap-3 text-red-700">
            <AlertCircle size={20} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">No pudimos conectar con el backend</p>
              <p className="text-sm mt-1">{error}</p>
              <p className="text-sm mt-2">Verifica que Flask esté ejecutándose en http://localhost:5000.</p>
            </div>
          </div>
        )}

        {!loading && !error && proyectos.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500">
            Todavía no hay proyectos publicados.
          </div>
        )}

        {!loading && !error && proyectos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {proyectos.map((proyecto) => (
              <article key={proyecto.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{proyecto.nombre}</h3>
                    <p className="text-sm text-purple-600 font-medium mt-1">{proyecto.sector}</p>
                  </div>
                  <Rocket size={22} className="text-purple-600 shrink-0" />
                </div>

                <p className="text-sm text-slate-600 mt-4 line-clamp-3">
                  {proyecto.descripcion}
                </p>

                <div className="mt-5 flex items-center justify-between">
                  <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full">
                    {proyecto.nivel_madurez}
                  </span>
                  <span className="text-xs text-slate-400">ID #{proyecto.id}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
