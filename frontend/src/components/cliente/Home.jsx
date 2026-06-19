

function Home({ irALogin, irALoginAsesor }) {
  return (
    <div className="min-h-screen bg-[#F4F6F9] font-sans text-gray-700 flex flex-col">
      
      {/* BARRA SUPERIOR DE NAVEGACIÓN INSTITUCIONAL */}
      <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-sm border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="font-black text-2xl text-[#B91C1C] tracking-wider">CAJA ICA</span>
          <span className="text-[9px] bg-red-100 text-[#B91C1C] font-bold px-1.5 py-0.5 rounded uppercase font-mono tracking-tight">
            Oficina Virtual
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={irALogin} 
            className="bg-[#B91C1C] hover:bg-red-700 text-white font-bold px-5 py-2 rounded shadow-sm transition text-xs uppercase tracking-wider cursor-pointer"
          >
            Banca Personas
          </button>
          <button 
            onClick={irALoginAsesor} 
            className="bg-slate-700 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded shadow-sm transition text-xs uppercase tracking-wider cursor-pointer"
          >
            🔑 Asesor Interno
          </button>
        </div>
      </nav>

      {/* SECCIÓN HERO PRINCIPAL */}
      <div className="bg-gradient-to-r from-[#B91C1C] to-red-800 text-white py-16 px-8 relative overflow-hidden shadow-md">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-8 relative z-10">
          <div className="space-y-4">
            <span className="bg-amber-400 text-red-950 font-black text-[10px] px-2.5 py-1 rounded-full uppercase tracking-widest">
              🔥 CAMPAÑA CRÉDITO AL INSTANTE
            </span>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              ¡Son S/5,000 en premios y tasas preferenciales!
            </h1>
            <p className="text-red-100 text-sm max-w-md leading-relaxed">
              Simula tus créditos y ahorros en nuestra banca por internet. Elige los meses de devolución que mejor se adapten a ti con aprobación interna inmediata.
            </p>
            <div className="pt-2">
              <button 
                onClick={irALogin}
                className="bg-amber-400 hover:bg-amber-500 text-red-950 font-black px-6 py-3 rounded-xl transition text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 cursor-pointer"
              >
                Simular Crédito Ahora 💰
              </button>
            </div>
          </div>
          
          {/* NUEVA CAJA LIMPIA ESTILO PUBLICIDAD DE CAJA ICA */}
          <div className="hidden md:block bg-white p-8 rounded-2xl shadow-2xl border border-red-200/20 text-gray-800 transform hover:scale-[1.02] transition duration-300">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] bg-emerald-100 text-emerald-700 font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                  Aprobación Rápida
                </span>
                <h4 className="text-xl font-black text-gray-900 mt-1">Crédito Personal Digital</h4>
              </div>
              <span className="text-3xl">🐷</span>
            </div>
            
            <p className="text-xs text-gray-500 mb-4">
              Solicita tu préstamo desde la comodidad de tu hogar y realiza el seguimiento de tus cuotas mensualmente.
            </p>

            <div className="space-y-3 border-t border-gray-100 pt-4">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400 font-medium">Tasa de Interés (TEA)</span>
                <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">15.00% Fija</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400 font-medium">Evaluación de Riesgo</span>
                <span className="font-bold text-slate-700">100% Online</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400 font-medium">Moneda</span>
                <span className="font-bold text-gray-900">Soles (S/)</span>
              </div>
            </div>

            <div className="mt-5 bg-gradient-to-r from-red-50 to-amber-50 p-3 rounded-xl border border-red-100 flex items-center gap-2">
              <span className="text-sm">⚡</span>
              <p className="text-[11px] text-red-900 font-medium">
                Sincronizado directamente con nuestra bandeja de asesores principales.
              </p>
            </div>
          </div>
        </div>
        
        {/* Círculos decorativos de fondo */}
        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-red-600/20 rounded-full blur-3xl"></div>
        <div className="absolute left-1/3 top-10 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl"></div>
      </div>

      {/* SECCIÓN INFORMATIVA DE BENEFICIOS */}
      <div className="max-w-6xl mx-auto px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full flex-grow">
        
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition space-y-3">
          <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center text-xl font-bold shadow-inner">
            📈
          </div>
          <h3 className="font-extrabold text-sm text-gray-900 uppercase tracking-wide">Tasas Competitivas</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Ofrecemos amortizaciones calculadas con la Tasa de Interés Compensatoria oficial regulada, garantizando cuotas fijas de inicio a fin.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition space-y-3">
          <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center text-xl font-bold shadow-inner">
            ⏱️
          </div>
          <h3 className="font-extrabold text-sm text-gray-900 uppercase tracking-wide">Plazos a tu Medida</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Flexibilidad total en la elección de cuotas. Simula cronogramas dinámicos de devolución desde nuestra plataforma en segundos.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition space-y-3">
          <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center text-xl font-bold shadow-inner">
            🔒
          </div>
          <h3 className="font-extrabold text-sm text-gray-900 uppercase tracking-wide">Evaluación en Core</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Toda solicitud se inyecta directamente en el sistema de gestión de riesgos para la aprobación o rechazo del analista asignado.
          </p>
        </div>

      </div>

      {/* PIE DE PÁGINA */}
      <footer className="bg-white border-t border-gray-100 py-4 px-8 text-center text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
        © 2026 Caja Ica — Sistema de Simulación de Créditos Integrado. Todos los derechos reservados.
      </footer>

    </div>
  );
}

export default Home;