import React from 'react';

function DashboardAsesor({ usuario, irAHome, prestamosGlobales, setPrestamosGlobales }) {
  const nombreAsesor = usuario?.nombre || 'Asesor de Caja Ica';
  const cargoAsesor = usuario?.cargo || 'Analista de Riesgos';

  // Acciones de control del asesor mapeadas a pksolicitud y pksolicitudestado
  // Estado 1 = Pendiente, Estado 2 = Aprobado, Estado 3 = Rechazado (Según dsolicitudestado)
  const resolverPrestamo = (pksolicitud, nuevoEstadoId, nombreEstadoTexto) => {
    const solicitudesActualizadas = prestamosGlobales.map(p => {
      if (p.pksolicitud === pksolicitud) {
        return { ...p, pksolicitudestado: nuevoEstadoId };
      }
      return p;
    });
    setPrestamosGlobales(solicitudesActualizadas);
    alert(`La solicitud en dsolicitud ha sido marcada como: ${nombreEstadoTexto} (Estado: ${nuevoEstadoId})`);
  };

  return (
    <div className="min-h-screen bg-slate-900 py-10 px-6 font-sans text-slate-100">
      <div className="max-w-4xl mx-auto">
        
        {/* ENCABEZADO INSTITUCIONAL */}
        <div className="flex justify-between items-center border-b border-slate-700 pb-6 mb-8">
          <div>
            <span className="bg-red-600 text-white font-extrabold text-[10px] px-2.5 py-1 rounded uppercase tracking-wider">
              Sistema Interno Integrado - Core Bancario
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

        {/* CONTADOR DE ESTADOS RECOLECTADOS (Alineados al esquema dsolicitudestado) */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-center">
            <p className="text-slate-400 text-xs uppercase font-bold">Pendientes (E-1)</p>
            <h3 className="text-2xl font-black text-amber-500">
              {prestamosGlobales.filter(p => p.pksolicitudestado === 1).length}
            </h3>
          </div>
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-center">
            <p className="text-slate-400 text-xs uppercase font-bold">Aprobados (E-2)</p>
            <h3 className="text-2xl font-black text-green-500">
              {prestamosGlobales.filter(p => p.pksolicitudestado === 2).length}
            </h3>
          </div>
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-center">
            <p className="text-slate-400 text-xs uppercase font-bold">Rechazados (E-3)</p>
            <h3 className="text-2xl font-black text-red-500">
              {prestamosGlobales.filter(p => p.pksolicitudestado === 3).length}
            </h3>
          </div>
        </div>

        {/* BANDEJA DE ENTRADA CENTRAL */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-extrabold text-white tracking-wide">📥 Bandeja de Solicitudes (Tabla dsolicitud)</h3>
            <span className="text-[10px] bg-slate-700 px-2 py-0.5 rounded text-sky-400 font-mono">schema.txt</span>
          </div>
          
          {prestamosGlobales.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm italic">
              No hay solicitudes registradas en dsolicitud actualmente.
            </div>
          ) : (
            <div className="space-y-4">
              {prestamosGlobales.map((solicitud) => (
                <div 
                  key={solicitud.pksolicitud} 
                  className="bg-slate-850 p-4 rounded-xl border border-slate-750 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition hover:border-slate-600"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-base">{solicitud.cliente || 'Cliente Web'}</span>
                      <span className="text-slate-400 text-xs">(DNI: {solicitud.dni})</span>
                      <span className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.2 rounded font-mono font-bold">
                        {solicitud.codsolicitud}
                      </span>
                    </div>
                    {/* Lectura de campos usando los nombres exactos del Core */}
                    <div className="flex flex-wrap gap-4 mt-1.5 text-xs text-slate-400">
                      <span>montosolicitudcredito: <strong className="text-sky-400 font-bold">S/ {parseFloat(solicitud.montosolicitudcredito).toFixed(2)}</strong></span>
                      <span>nrocuotasolicitud: <strong>{solicitud.nrocuotasolicitud} meses</strong></span>
                      <span>tasainterescompensatoria: <strong className="text-amber-400">{solicitud.tasainterescompensatoria}%</strong></span>
                      <span>pagoMensual: <strong>S/ {solicitud.pagoMensual}/mes</strong></span>
                    </div>
                  </div>

                  {/* CONTROL DE DECISIONES INTERNAS (Filtros basados en pksolicitudestado) */}
                  <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    {solicitud.pksolicitudestado === 1 ? (
                      <>
                        <button 
                          onClick={() => resolverPrestamo(solicitud.pksolicitud, 2, 'Aprobado')}
                          className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-3 py-2 rounded shadow transition cursor-pointer"
                        >
                          ✓ Aprobar
                        </button>
                        <button 
                          onClick={() => resolverPrestamo(solicitud.pksolicitud, 3, 'Rechazado')}
                          className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3 py-2 rounded shadow transition cursor-pointer"
                        >
                          ✕ Rechazar
                        </button>
                      </>
                    ) : (
                      <span className={`font-bold text-xs px-3 py-1.5 rounded-full ${
                        solicitud.pksolicitudestado === 2 
                          ? 'bg-green-950 text-green-400 border border-green-800' 
                          : 'bg-red-950 text-red-400 border border-red-800'
                      }`}>
                        {solicitud.pksolicitudestado === 2 ? 'Aprobado (E-2)' : 'Rechazado (E-3)'}
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