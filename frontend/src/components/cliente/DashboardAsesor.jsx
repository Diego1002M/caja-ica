import React, { useEffect, useState } from 'react';

function DashboardAsesor({ usuario, irAHome, prestamosGlobales, setPrestamosGlobales }) {
  const nombreAsesor = usuario?.nombre || 'Carlos Mendoza';
  const cargoAsesor = usuario?.cargo || 'Analista de Créditos Principal';
  
  const [solicitudesLocales, setSolicitudesLocales] = useState([]);
  // ID para controlar qué cronograma expandir y ver en pantalla
  const [solicitudExpandida, setSolicitudExpandida] = useState(null);

  useEffect(() => {
    const cache = localStorage.getItem('core_dsolicitud');
    if (cache) {
      const datosParseados = JSON.parse(cache);
      setSolicitudesLocales(datosParseados);
      if (typeof setPrestamosGlobales === 'function') {
        setPrestamosGlobales(datosParseados);
      }
    } else if (prestamosGlobales && prestamosGlobales.length > 0) {
      setSolicitudesLocales(prestamosGlobales);
    }
  }, [prestamosGlobales, setPrestamosGlobales]);

  const resolverPrestamo = (pksolicitud, nuevoEstadoId, nombreEstadoTexto) => {
    const solicitudesActualizadas = solicitudesLocales.map(p => {
      if (p.pksolicitud === pksolicitud) {
        return { ...p, pksolicitudestado: nuevoEstadoId };
      }
      return p;
    });
    
    setSolicitudesLocales(solicitudesActualizadas);
    if (typeof setPrestamosGlobales === 'function') {
      setPrestamosGlobales(solicitudesActualizadas);
    }
    localStorage.setItem('core_dsolicitud', JSON.stringify(solicitudesActualizadas));
    
    alert(`Operación Procesada: El estado del préstamo es ahora ${nombreEstadoTexto.toUpperCase()}`);
  };

  return (
    <div className="min-h-screen bg-slate-900 py-10 px-6 font-sans text-slate-100">
      <div className="max-w-4xl mx-auto">
        
        {/* ENCABEZADO */}
        <div className="flex justify-between items-center border-b border-slate-700 pb-6 mb-8">
          <div>
            <span className="bg-red-600 text-white font-extrabold text-[10px] px-2.5 py-1 rounded uppercase tracking-wider">
              Core Bancario - Caja Ica
            </span>
            <h2 className="text-3xl font-black mt-1 text-white">{nombreAsesor}</h2>
            <p className="text-slate-400 text-xs">{cargoAsesor}</p>
          </div>
          <button onClick={irAHome} className="bg-slate-700 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-bold text-xs transition cursor-pointer">
            Salir del Sistema
          </button>
        </div>

        {/* CONTADORES */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-center">
            <p className="text-slate-400 text-xs uppercase font-bold">Pendientes (E-1)</p>
            <h3 className="text-2xl font-black text-amber-500">
              {solicitudesLocales.filter(p => p.pksolicitudestado === 1).length}
            </h3>
          </div>
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-center">
            <p className="text-slate-400 text-xs uppercase font-bold">Aprobados (E-2)</p>
            <h3 className="text-2xl font-black text-green-500">
              {solicitudesLocales.filter(p => p.pksolicitudestado === 2).length}
            </h3>
          </div>
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-center">
            <p className="text-slate-400 text-xs uppercase font-bold">Rechazados (E-3)</p>
            <h3 className="text-2xl font-black text-red-500">
              {solicitudesLocales.filter(p => p.pksolicitudestado === 3).length}
            </h3>
          </div>
        </div>

        {/* TABLA PRINCIPAL */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 shadow-xl">
          <h3 className="text-lg font-extrabold text-white mb-4">📥 Bandeja de Auditoría Financiera (dsolicitud)</h3>
          
          {solicitudesLocales.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm italic">
              No hay registros por evaluar.
            </div>
          ) : (
            <div className="space-y-4">
              {solicitudesLocales.map((solicitud) => (
                <div key={solicitud.pksolicitud} className="bg-slate-850 p-4 rounded-xl border border-slate-750 space-y-4">
                  
                  {/* Fila Básica de Información */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-base">{solicitud.cliente}</span>
                        <span className="text-slate-400 text-xs">(DNI: {solicitud.dni})</span>
                        <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded font-mono font-bold">
                          {solicitud.codsolicitud}
                        </span>
                      </div>
                      
                      {/* Datos Rápidos Solicitados */}
                      <div className="flex flex-wrap gap-4 mt-2 text-xs text-slate-400">
                        <span>Monto: <strong className="text-sky-400">S/ {parseFloat(solicitud.montosolicitudcredito).toFixed(2)}</strong></span>
                        <span>Plazo: <strong>{solicitud.nrocuotasolicitud} meses</strong></span>
                        <span>TEA: <strong className="text-amber-400">{solicitud.tasainterescompensatoria}%</strong></span>
                        <span>Día Pago: <strong>Día {solicitud.diaPagoSeleccionado || '3'}</strong></span>
                      </div>
                    </div>

                    {/* Botones de Acción */}
                    <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                      <button 
                        onClick={() => setSolicitudExpandida(solicitidExpandida === solicitud.pksolicitud ? null : solicitud.pksolicitud)}
                        className="bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs px-3 py-2 rounded font-semibold transition cursor-pointer"
                      >
                        {solicitudExpandida === solicitud.pksolicitud ? '▲ Ocultar Plan' : '👁 Ver Plan de Pagos'}
                      </button>

                      {solicitud.pksolicitudestado === 1 ? (
                        <>
                          <button 
                            onClick={() => resolverPrestamo(solicitud.pksolicitud, 2, 'Aprobado')}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-3 py-2 rounded transition cursor-pointer"
                          >
                            ✓ Aprobar
                          </button>
                          <button 
                            onClick={() => resolverPrestamo(solicitud.pksolicitud, 3, 'Rechazado')}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3 py-2 rounded transition cursor-pointer"
                          >
                            ✕ Rechazar
                          </button>
                        </>
                      ) : (
                        <span className={`font-bold text-xs px-3 py-1.5 rounded-full ${
                          solicitud.pksolicitudestado === 2 ? 'bg-green-950 text-green-400' : 'bg-red-950 text-red-400'
                        }`}>
                          {solicitud.pksolicitudestado === 2 ? 'Aprobado (E-2)' : 'Rechazado (E-3)'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 🧾 RECUADRO DESPLEGABLE CON TODO LO QUE SELECCIONÓ EL CLIENTE */}
                  {solicitudExpandida === solicitud.pksolicitud && (
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 space-y-3 animation-fade-in">
                      <div className="border-b border-slate-700 pb-2 flex justify-between items-center">
                        <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                          📋 Plan Detallado de Amortización Recibido
                        </h4>
                        <span className="text-[10px] text-slate-500 font-mono">Cuota mensual: S/ {solicitud.pagoMensual}</span>
                      </div>
                      
                      {solicitud.cronogramaDetallado && solicitud.cronogramaDetallado.length > 0 ? (
                        <div className="overflow-x-auto max-h-60 overflow-y-auto">
                          <table className="w-full text-left border-collapse text-[11px]">
                            <thead>
                              <tr className="bg-slate-800 text-slate-400 font-bold border-b border-slate-700">
                                <th className="p-2 text-center">N°</th>
                                <th className="p-2">Fecha de Vencimiento</th>
                                <th className="p-2 text-right">Cuota Fija</th>
                                <th className="p-2 text-right">Abono Capital</th>
                                <th className="p-2 text-right">Interés Comp.</th>
                                <th className="p-2 text-right">Saldo Restante</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800 text-slate-300">
                              {solicitud.cronogramaDetallado.map((cuota) => (
                                <tr key={cuota.num} className="hover:bg-slate-800/50">
                                  <td className="p-2 text-center text-slate-500 font-bold">{cuota.num}</td>
                                  <td className="p-2 font-semibold text-slate-200">{cuota.fecha}</td>
                                  <td className="p-2 text-right text-white font-bold">S/ {cuota.cuota}</td>
                                  <td className="p-2 text-right text-emerald-400">S/ {cuota.capital}</td>
                                  <td className="p-2 text-right text-amber-400">S/ {cuota.interes}</td>
                                  <td className="p-2 text-right font-mono text-slate-400">S/ {cuota.saldo}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500 italic">No se adjuntaron sub-cuotas detalladas para esta simulación antigua.</p>
                      )}
                    </div>
                  )}

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