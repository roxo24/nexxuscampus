// Botón en la cabecera del chat
<button 
  onClick={handleActivarWhatsApp}
  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2 rounded-xl shadow-md transition-all text-sm"
>
  <span>📲</span>
  <span>{enlaceWhatsapp ? "Abrir WhatsApp del Equipo" : "Crear Grupo de WhatsApp"}</span>
</button>