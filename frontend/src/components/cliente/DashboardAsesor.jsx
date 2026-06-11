import React from 'react';

function DashboardAsesor({ usuario, irAHome, prestamosGlobales, setPrestamosGlobales }) {
  const nombreAsesor = usuario?.nombre || 'Asesor de Caja Ica';
  const cargoAsesor = usuario?.cargo || 'Analista de Riesgos';

  // Acciones de control del asesor
  const resolverPrestamo = (id, nuevoEstado) => {
    const solicitudesActualizadas = prestamosGlobales.map(p => {
      if (p.id === id) {
        return { ...p, estado: nuevoEstado };
      }
      return p;
    });
    setPrestamosGlobales(solicitudesActualizadas);
    alert(`La solicitud ha sido marcada como: ${nuevoEstado}`);
  };

  return (
    <div className="min-h-screen bg-slate-900 py-10 px-6 font-sans text-slate-100">
      <div className="max-w-4xl mx-auto">
        
        {/* ENCABEZADO INSTITUCIONAL */}
        <div className="flex justify-between items-center border-b border-slate-700 pb-6 mb-8">
          <div>
            <span className="bg-red-600 text-white font-extrabold text-[10px] px-2.5 py-1 rounded uppercase tracking-wider">
              Sistema Interno Integrado
            </span>
            <h2 className="text-3xl font-black mt-1 text-white">{nombreAsesor}</h2>
            <p className="text-slate-400 text-xs">{cargoAsesor} — Agencia Principal</p>
          </div>
          <button 
            onClick={irAHome} 
            className="bg-slate-700 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-bold text-xs transition cursor-pointer shadow-md"
          >
            Salir del Sistema
          </button>
        </div>

        {/* CONTADOR DE ESTADOS RECOLECTADOS */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-center">
            <p className="text-slate-400 text-xs uppercase font-bold">Pendientes</p>
            <h3 className="text-2xl font-black text-amber-500">{prestamosGlobales.filter(p => p.estado === 'Pendiente').length}</h3>
          </div>
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-center">
            <p className="text-slate-400 text-xs uppercase font-bold">Aprobados</p>
            <h3 className="text-2xl font-black text-green-500">{prestamosGlobales.filter(p => p.estado === 'Aprobado').length}</h3>
          </div>
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-center">
            <p className="text-slate-400 text-xs uppercase font-bold">Rechazados</p>
            <h3 className="text-2xl font-black text-red-500">{prestamosGlobales.filter(p => p.estado === 'Rechazados').length}</h3>
          </div>
        </div>

        {/* BANDEJA DE ENTRADA CENTRAL */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 shadow-xl">
          <h3 className="text-lg font-extrabold text-white mb-4 tracking-wide">📥 Bandeja de Solicitudes de Crédito Online</h3>
          
          {prestamosGlobales.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm italic">
              No hay solicitudes registradas en el sistema actualmente.
            </div>
          ) : (
            <div className="space-y-4">
              {prestamosGlobales.map((solicitud) => (
                <div 
                  key={solicitud.id} 
                  className="bg-slate-850 p-4 rounded-xl border border-slate-750 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition hover:border-slate-600"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-base">{solicitud.cliente}</span>
                      <span className="text-slate-400 text-xs">(DNI: {solicitud.dni})</span>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-1.5 text-xs text-slate-400">
                      <span>Monto Solicitado: <strong className="text-sky-400 font-bold">S/ {solicitud.monto}</strong></span>
                      <span>Plazo: <strong>{solicitud.cuotas} meses</strong></span>
                      <span>Cuota: <strong>S/ {solicitud.pagoMensual}/mes</strong></span>
                    </div>
                  </div>

                  {/* CONTROL DE DECISIONES INTERNAS */}
                  <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    {solicitud.estado === 'Pendiente' ? (
                      <>
                        <button 
                          onClick={() => resolverPrestamo(solicitud.id, 'Aprobado')}
                          className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-3 py-2 rounded shadow transition cursor-pointer"
                        >
                          ✓ Aprobar
                        </button>
                        <button 
                          onClick={() => resolverPrestamo(solicitud.id, 'Rechazados')}
                          className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3 py-2 rounded shadow transition cursor-pointer"
                        >
                          ✕ Rechazar
                        </button>
                      </>
                    ) : (
                      <span className={`font-bold text-xs px-3 py-1.5 rounded-full ${
                        solicitud.estado === 'Aprobado' ? 'bg-green-950 text-green-400 border border-green-800' : 'bg-red-950 text-red-400 border border-red-800'
                      }`}>
                        {solicitud.estado}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default DashboardAsesor;