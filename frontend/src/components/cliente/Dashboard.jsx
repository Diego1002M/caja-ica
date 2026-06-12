import React, { useState } from 'react';

function Dashboard({ usuario, irAHome, prestamosGlobales, setPrestamosGlobales }) {
  const nombreCliente = usuario?.nombre || 'Juan Perez';
  const dniCliente = usuario?.dni || '74859612';
  
  // 1. Filtrar las solicitudes usando el estado del Core del profesor (Ej: Estado 2 = Aprobado)
  const misPrestamosAprobados = prestamosGlobales ? prestamosGlobales.filter(
  (p) => (p.dni === dniCliente || p.pkcliente === usuario?.pkcliente) && p.pksolicitudestado === 2
) : [];

  const [pagosEfectuados, setPagosEfectuados] = useState(0);
  const [mostrarSimulador, setMostrarSimulador] = useState(false);
  const [montoSolicitud, setMontoSolicitud] = useState('');
  const [nroCuotas, setNroCuotas] = useState('12');

  // Cálculos financieros basados en dsolicitud del Core
  const totalMontoAprobado = misPrestamosAprobados.reduce((total, p) => total + parseFloat(p.montoaprobadocredito || p.montosolicitudcredito), 0);
  const saldoInicialBase = usuario?.saldo || 8292.35; 
  const saldoTotal = saldoInicialBase + totalMontoAprobado - pagosEfectuados;
  
  // Deuda total acumulando tasa de interés compensatoria del esquema
  const deudaTotalCreditos = misPrestamosAprobados.reduce((total, p) => {
    const tasa = parseFloat(p.tasainterescompensatoria || 15); // 15% por defecto si no viene del backend
    const montoSolicitado = parseFloat(p.montosolicitudcredito);
    const totalConInteres = montoSolicitado * (1 + (tasa / 100));
    const mensualidad = totalConInteres / parseInt(p.nrocuotasolicitud);
    const pagado = (p.cuotasPagadas || 0) * mensualidad;
    return total + (totalConInteres - pagado);
  }, misPrestamosAprobados.length > 0 ? 0 : 3116.36);

  // Función para enviar solicitud mapeada al esquema 'dsolicitud'
  const enviarSolicitudPrestamo = (e) => {
    e.preventDefault();
    if (!montoSolicitud || montoSolicitud <= 0) return;

    const tasaCompensatoria = 15.00; // Tasa base Caja Ica
    const totalConInteres = parseFloat(montoSolicitud) * (1 + (tasaCompensatoria / 100));
    const pagoMensual = totalConInteres / parseInt(nroCuotas);

    // OBJETO ESTRUCTURADO CON LAS COLUMNAS EXACTAS DE TU PROFESOR
    const nuevaSolicitudCore = {
      pksolicitud: Date.now(), // ID temporal
      codsolicitud: `SOL-${Date.now().toString().substring(8)}`,
      dni: dniCliente, // Para amarre de interfaz
      montosolicitudcredito: parseFloat(montoSolicitud),
      nrocuotasolicitud: parseInt(nroCuotas),
      pksolicitudestado: 1, // 1 = Pendiente en dsolicitudestado
      tasainterescompensatoria: tasaCompensatoria,
      
      // Campos calculados para control de la devolución en la tabla
      montoaprobadocredito: parseFloat(montoSolicitud), 
      nrocuotaaprobado: parseInt(nroCuotas),
      cuotasPagadas: 0,
      pagoMensual: pagoMensual.toFixed(2),
      montoTotalConInteres: totalConInteres.toFixed(2)
    };

    setPrestamosGlobales([...prestamosGlobales, nuevaSolicitudCore]);
    setMostrarSimulador(false);
    setMontoSolicitud('');
    alert('¡Solicitud registrada en dsolicitud! Enviada al Asesor con pksolicitudestado: 1 (Pendiente).');
  };

  // Función de devolución / amortización de cuota
  const pagarCuotaPrestamo = (pksolicitud, valorCuota) => {
    if (saldoTotal < valorCuota) {
      alert('⚠️ Saldo insuficiente en tu Cuenta Ahorro para realizar la amortización.');
      return;
    }

    const actualizados = prestamosGlobales.map((p) => {
      if (p.pksolicitud === pksolicitud) {
        const nuevasPagadas = (p.cuotasPagadas || 0) + 1;
        return { ...p, cuotasPagadas: nuevasPagadas };
      }
      return p;
    });

    setPrestamosGlobales(actualizados);
    setPagosEfectuados(pagosEfectuados + valorCuota); 
    alert(`✅ ¡Abono procesado! Cuota descontada de tu saldo disponible.`);
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] font-sans text-gray-700">
      
      {/* BANNER INSTITUTIONAL */}
      <div className="bg-[#B91C1C] text-white px-8 py-3 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2">
          <span className="font-black text-xl tracking-wider">CAJA ICA</span>
          <span className="text-xs bg-red-800 px-2 py-0.5 rounded text-red-200">CORE FINANCIERO v2.0</span>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-teal-600 rounded-full flex items-center justify-center font-bold text-white uppercase">
              {nombreCliente.substring(0,2)}
            </div>
            <span>{nombreCliente} (CLI-007)</span>
          </div>
          <button onClick={irAHome} className="bg-red-800 hover:bg-red-900 px-3 py-1.5 rounded font-bold transition cursor-pointer">
            🚪 Salir
          </button>
        </div>
      </div>

      {/* RESTRICCIÓN DE PESTAÑAS */}
      <div className="bg-[#B91C1C] border-t border-red-800 px-8 flex gap-6 text-white text-xs font-bold shadow-sm">
        <button className="py-3 px-4 bg-red-700">Inicio</button>
        <button className="py-3 px-4 hover:bg-red-700 opacity-80">Cuentas</button>
        <button onClick={() => setMostrarSimulador(!mostrarSimulador)} className="py-3 px-4 hover:bg-red-700 opacity-80 text-amber-300">⭐ Solicitar Préstamo ({nroCuotas} Meses)</button>
        <button className="py-3 px-4 hover:bg-red-700 opacity-80">Operaciones</button>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* TABLEROS PRINCIPALES */}
        <div className="lg:col-span-3 space-y-6">
          
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-sm font-bold text-gray-900">Bienvenido al Simulador Integrado a <code className="bg-gray-100 px-1 rounded text-red-600">dsolicitud</code></h2>
            <p className="text-gray-400 text-[11px] mt-0.5">Control global sincronizado con el esquema del core del curso.</p>
          </div>

          {/* INDICADORES ALINEADOS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-red-500 border flex justify-between items-center">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">TOTAL EN AHORROS</p>
                <h3 className="text-2xl font-black text-gray-800 mt-1">S/ {saldoTotal.toFixed(2)}</h3>
                <p className="text-[11px] text-gray-400 mt-0.5">Mapeado en tiempo real</p>
              </div>
              <span className="text-2xl">🐷</span>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-teal-500 border flex justify-between items-center">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">DEUDA TOTAL CREDITO</p>
                <h3 className="text-2xl font-black text-gray-800 mt-1">S/ {deudaTotalCreditos.toFixed(2)}</h3>
                <p className="text-[11px] text-gray-400 mt-0.5">{misPrestamosAprobados.length} activos en dsolicitud</p>
              </div>
              <span className="text-2xl">💳</span>
            </div>
          </div>

          {/* FORMULARIO SIMULADOR CORE */}
          {mostrarSimulador && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 shadow-inner">
              <h4 className="font-bold text-amber-900 text-xs uppercase mb-3 tracking-wide">📝 Nueva Entrada: Tabla dsolicitud</h4>
              <form onSubmit={enviarSolicitudPrestamo} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end text-xs">
                <div>
                  <label className="block font-bold text-amber-800 mb-1">montosolicitudcredito (S/)</label>
                  <input type="number" value={montoSolicitud} onChange={(e) => setMontoSolicitud(e.target.value)} className="w-full bg-white border p-2 rounded outline-none" placeholder="Ej: 4000" required />
                </div>
                <div>
                  <label className="block font-bold text-amber-800 mb-1">nrocuotasolicitud (Plazo)</label>
                  <select value={nroCuotas} onChange={(e) => setNroCuotas(e.target.value)} className="w-full bg-white border p-2 rounded outline-none font-bold text-gray-700">
                    <option value="6">6 Cuotas Mensuales</option>
                    <option value="12">12 Cuotas Mensuales</option>
                    <option value="24">24 Cuotas Mensuales</option>
                  </select>
                </div>
                <button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition cursor-pointer uppercase text-[10px]">
                  Insertar Solicitud
                </button>
              </form>
            </div>
          )}

          {/* CRONOGRAMA DE PAGOS Y DEVOLUCIÓN */}
          <div className="bg-white rounded-xl shadow-sm border p-5">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-red-700 flex items-center gap-2">
                📊 Monitoreo de Amortizaciones (Meses Elegidos)
              </h4>
              <span className="text-[10px] bg-teal-50 text-teal-700 px-2 py-0.5 rounded font-bold">Esquema: dsolicitud</span>
            </div>

            {misPrestamosAprobados.length === 0 ? (
              <div className="text-center py-6 text-xs text-gray-400 italic">
                Ningún crédito aprobado dinámico. Línea Base en pantalla: <br />
                <span className="font-bold text-gray-600 not-italic block mt-2">CRED-06 (Monto: S/ 3,116.36) — Tasa Compensatoria: 15%</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b text-gray-400 font-bold bg-gray-50 text-[10px] uppercase">
                      <th className="py-2.5 px-2">codsolicitud</th>
                      <th className="py-2.5 px-2">Meses Elegidos</th>
                      <th className="py-2.5 px-2">Cuota Mensual</th>
                      <th className="py-2.5 px-2">tasainterescompensatoria</th>
                      <th className="py-2.5 px-2">Progreso</th>
                      <th className="py-2.5 px-2 text-right">Devolución</th>
                    </tr>
                  </thead>
                  <tbody>
                    {misPrestamosAprobados.map((p) => {
                      const mensualidad = parseFloat(p.pagoMensual);
                      const totalConInteres = parseFloat(p.montoTotalConInteres);
                      const pagadas = p.cuotasPagadas || 0;
                      const estaCancelado = pagadas >= p.nrocuotasolicitud;

                      return (
                        <tr key={p.pksolicitud} className="border-b last:border-0 hover:bg-gray-50 font-medium">
                          <td className="py-3 px-2 font-bold text-gray-900">{p.codsolicitud} <span className="block font-normal text-gray-400 text-[10px]">S/ {p.montosolicitudcredito.toFixed(2)}</span></td>
                          <td className="py-3 px-2 text-gray-600">{p.nrocuotasolicitud} Meses</td>
                          <td className="py-3 px-2 text-teal-600 font-bold">S/ {mensualidad.toFixed(2)}</td>
                          <td className="py-3 px-2 font-bold text-amber-600">{p.tasainterescompensatoria}% TEA</td>
                          <td className="py-3 px-2">
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${estaCancelado ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                              {pagadas} de {p.nrocuotasolicitud} meses
                            </span>
                          </td>
                          <td className="py-3 px-2 text-right">
                            {estaCancelado ? (
                              <span className="text-green-600 font-bold text-[10px] tracking-wide">✓ TOTALIZADO</span>
                            ) : (
                              <button
                                onClick={() => pagarCuotaPrestamo(p.pksolicitud, mensualidad)}
                                className="bg-[#B91C1C] hover:bg-red-700 text-white font-bold px-2.5 py-1 rounded text-[10px] uppercase cursor-pointer transition shadow-sm"
                              >
                                Pagar Cuota
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

        {/* COMPONENTE DERECHO */}
        <div className="space-y-4">
          <div className="bg-teal-600 text-white px-4 py-3 rounded-t-xl font-bold text-xs uppercase tracking-wider shadow-sm">
            ⚡ Operaciones Frecuentes
          </div>
          <div className="bg-white rounded-b-xl border border-t-0 border-gray-100 shadow-sm divide-y text-xs font-semibold text-gray-700">
            <div className="p-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer">
              <span>✈️ Transferencias propias</span>
              <span className="text-gray-300">&gt;</span>
            </div>
            <div className="p-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer text-teal-600">
              <span>💳 Abonar a Crédito</span>
              <span className="text-teal-400">&gt;</span>
            </div>
            <div className="p-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer">
              <span>💧 Pago de servicios</span>
              <span className="text-gray-300">&gt;</span>
            </div>
            <div onClick={() => setMostrarSimulador(!mostrarSimulador)} className="p-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer text-red-600 font-bold">
              <span>💰 Solicitar préstamo inmediato</span>
              <span className="text-red-400">&gt;</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;