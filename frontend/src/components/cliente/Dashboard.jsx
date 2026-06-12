import React, { useState, useEffect } from 'react';

function DashboardCliente({ usuario, irAHome, prestamosGlobales, setPrestamosGlobales }) {
  // 1. Estados para el simulador financiero (Formulario)
  const [monto, setMonto] = useState('1000');
  const [plazo, setPlazo] = useState('12');
  const [tea, setTea] = useState('43.92'); 
  const [diaPago, setDiaPago] = useState('3');
  
  // Estado para la previsualización del cliente ANTES de enviar
  const [cronogramaPrevisualizado, setCronogramaPrevisualizado] = useState([]);
  const [cuotaPrevisualizada, setCuotaPrevisualizada] = useState(0);
  const [mostrarSimulacionLocal, setMostrarSimulacionLocal] = useState(false);

  // Estado que detectará las respuestas del Asesor desde el Core Bancario
  const [prestamoAprobadoOficial, setPrestamoAprobadoOficial] = useState(null);
  const [solicitudEnviada, setSolicitudEnviada] = useState(false);
  const [cargandoSolicitud, setCargandoSolicitud] = useState(false);

  // 2. EFECTO: Sincronizar el estado de la solicitud con el LocalStorage
  useEffect(() => {
    const cache = localStorage.getItem('core_dsolicitud');
    const listado = cache ? JSON.parse(cache) : (prestamosGlobales || []);
    
    const miDni = usuario?.dni || "43217654";
    const aprobado = listado.find(p => p.dni === miDni && p.pksolicitudestado === 2);
    const pendiente = listado.find(p => p.dni === miDni && p.pksolicitudestado === 1);

    if (aprobado) {
      setPrestamoAprobadoOficial(aprobado);
    } else {
      setPrestamoAprobadoOficial(null);
    }

    if (pendiente) {
      setSolicitudEnviada(true);
    } else {
      setSolicitudEnviada(false); 
    }
  }, [prestamosGlobales, usuario]);

  // 3. PASO 1: CALCULAR Y MOSTRAR LA TABLA EN PANTALLA (SIN RESTRICCIONES)
  const handleCalcularSimulacion = (e) => {
    if (e) e.preventDefault();
    
    const p = parseFloat(monto);
    const n = parseInt(plazo);
    const teaPorcentaje = parseFloat(tea) / 100;
    
    if (isNaN(p) || isNaN(n) || isNaN(teaPorcentaje)) return;
    
    const tem = Math.pow(1 + teaPorcentaje, 1 / 12) - 1;
    const cuota = (p * tem * Math.pow(1 + tem, n)) / (Math.pow(1 + tem, n) - 1);
    setCuotaPrevisualizada(cuota.toFixed(2));

    let saldoRestante = p;
    let listaCuotas = [];
    
    let añoActual = 2026;
    let mesActual = 2; // Marzo 2026

    for (let i = 1; i <= n; i++) {
      const interesMes = saldoRestante * tem;
      const capitalMes = cuota - interesMes;
      saldoRestante -= capitalMes;

      const fechaPago = new Date(añoActual, mesActual, parseInt(diaPago || 3));
      const fechaFormateada = fechaPago.toLocaleDateString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });

      listaCuotas.push({
        num: i,
        fecha: fechaFormateada,
        cuota: cuota.toFixed(2),
        capital: capitalMes.toFixed(2),
        interes: interesMes.toFixed(2),
        saldo: Math.max(0, saldoRestante).toFixed(2)
      });

      mesActual++;
      if (mesActual > 11) {
        mesActual = 0;
        añoActual++;
      }
    }

    setCronogramaPrevisualizado(listaCuotas);
    setMostrarSimulacionLocal(true); // <--- Esto forzará la apertura de la tabla inmediatamente
  };

  // 4. PASO 2: SI AL CLIENTE LE INTERESA, ENVÍA LA SOLICITUD AL ANALISTA
  const handleSolicitarPrestamoOficial = () => {
    setCargandoSolicitud(true);
    
    setTimeout(() => {
      const nuevaSolicitud = {
        pksolicitud: Date.now(), 
        cliente: usuario?.nombre || "Castor Pérez", 
        dni: usuario?.dni || "43217654",
        codsolicitud: `SOL-${Math.floor(1000 + Math.random() * 9000)}`,
        montosolicitudcredito: parseFloat(monto),
        nrocuotasolicitud: parseInt(plazo),
        tasainterescompensatoria: parseFloat(tea),
        diaPagoSeleccionado: diaPago,
        pagoMensual: cuotaPrevisualizada,
        pksolicitudestado: 1, // Entra como Pendiente
        cronogramaDetallado: cronogramaPrevisualizado 
      };

      const historialPrevio = localStorage.getItem('core_dsolicitud');
      const listaActual = historialPrevio ? JSON.parse(historialPrevio) : (prestamosGlobales || []);
      
      // Mantenemos solo la última enviada para la simulación limpia
      const listaLimpia = listaActual.filter(p => p.dni !== nuevaSolicitud.dni);
      const listaActualizada = [nuevaSolicitud, ...listaLimpia];

      if (typeof setPrestamosGlobales === 'function') {
        setPrestamosGlobales(listaActualizada);
      }
      localStorage.setItem('core_dsolicitud', JSON.stringify(listaActualizada));

      setSolicitudEnviada(true);
      setMostrarSimulacionLocal(false); // Ocultamos la previsualización para mostrar el estado oficial
      setCronogramaPrevisualizado([]);
      setCargandoSolicitud(false);
      alert('🚀 ¡Solicitud enviada al Core Bancario! Esperando auditoría del Asesor.');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] font-sans flex flex-col">
      {/* BARRA DE NAVEGACIÓN */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <span className="font-black text-xl text-[#B91C1C] tracking-wider">CAJA ICA</span>
          <span className="bg-red-50 text-[#B91C1C] text-[10px] px-2.5 py-1 rounded-full font-bold uppercase">Banca Personas</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-gray-400 font-medium">Bienvenido cliente</p>
            <p className="text-sm font-bold text-gray-800">{usuario?.nombre || 'Usuario Web'}</p>
          </div>
          <button onClick={irAHome} className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold px-4 py-2 rounded-xl cursor-pointer">
            Salir 🚪
          </button>
        </div>
      </header>

      <main className="p-8 max-w-7xl w-full mx-auto space-y-6 flex-1">
        
        {/* BLOQUE DE ENTRADA DE DATOS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-1 bg-gradient-to-br from-[#B91C1C] to-red-700 text-white p-8 rounded-2xl shadow-xl space-y-4">
            <span className="bg-white/20 backdrop-blur-sm font-extrabold text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider inline-block">Paso Inicial</span>
            <h2 className="text-2xl font-black tracking-tight uppercase leading-tight">Simulador de Créditos</h2>
            <p className="text-red-100 text-xs">Modifica tus montos y calcula tus cuotas. Si estás de acuerdo con el plan, envíalo a evaluación con un solo clic.</p>
          </div>

          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-md border border-gray-100">
            <form onSubmit={handleCalcularSimulacion} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider block mb-1">Monto del Préstamo (S/)</label>
                  <input type="number" value={monto} onChange={(e) => setMonto(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-sm font-semibold" required />
                </div>
                <div>
                  <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider block mb-1">Plazo (Meses)</label>
                  <input type="number" value={plazo} onChange={(e) => setPlazo(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-sm font-semibold" required />
                </div>
                <div>
                  <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider block mb-1">TEA (%)</label>
                  <input type="number" step="0.01" value={tea} onChange={(e) => setTea(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-sm font-semibold" required />
                </div>
                <div>
                  <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider block mb-1">Día Fijo de Pago</label>
                  <input type="number" min="1" max="31" value={diaPago} onChange={(e) => setDiaPago(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-sm font-semibold" required />
                </div>
              </div>
              
              <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-3 rounded-xl text-xs uppercase tracking-wider transition cursor-pointer shadow-md">
                📊 Calcular y Estructurar Cuotas
              </button>
            </form>
          </div>
        </div>

        {/* -------------------------------------------------------------------------------------- */}
        {/* CASO A: RECUADRO DE PREVISUALIZACIÓN LOCAL (SÓLO DEPENDE DE HACER CLIC EN EL BOTÓN) */}
        {/* -------------------------------------------------------------------------------------- */}
        {mostrarSimulacionLocal && (
          <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-dashed border-red-200 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-4 gap-4">
              <div>
                <span className="bg-red-100 text-[#B91C1C] text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider">Previsualización Temporal</span>
                <h4 className="font-black text-gray-900 text-sm uppercase mt-1">¿Te interesa esta estructura de pagos?</h4>
              </div>
              <div className="flex items-center gap-6 w-full sm:w-auto justify-end">
                <div className="text-right">
                  <span className="text-[10px] font-bold text-gray-400 block uppercase">CUOTA CALCULADA</span>
                  <span className="text-xl font-black text-[#B91C1C]">S/ {cuotaPrevisualizada}</span>
                </div>
                
                {/* Botón de envío oficial */}
                <button
                  onClick={handleSolicitarPrestamoOficial}
                  disabled={cargandoSolicitud}
                  className="bg-[#B91C1C] hover:bg-red-700 text-white font-black text-xs px-5 py-3 rounded-xl shadow-md transition uppercase tracking-wider cursor-pointer"
                >
                  {cargandoSolicitud ? '⌛ Enviando...' : '🚀 Enviar a Evaluación'}
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50 text-gray-400 font-bold border-b border-gray-200">
                    <th className="p-3 text-center w-20">N° Cuota</th>
                    <th className="p-3">Fecha Estimada</th>
                    <th className="p-3 text-right">Cuota</th>
                    <th className="p-3 text-right">Capital</th>
                    <th className="p-3 text-right">Interés</th>
                    <th className="p-3 text-right">Saldo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {cronogramaPrevisualizado.map((item) => (
                    <tr key={item.num}>
                      <td className="p-3 text-center font-bold text-gray-400">{item.num}</td>
                      <td className="p-3 font-semibold text-gray-900">{item.fecha}</td>
                      <td className="p-3 text-right font-bold">S/ {item.cuota}</td>
                      <td className="p-3 text-right text-emerald-600">S/ {item.capital}</td>
                      <td className="p-3 text-right text-amber-600">S/ {item.interes}</td>
                      <td className="p-3 text-right font-mono text-gray-500">S/ {item.saldo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------------------------------- */}
        {/* CASO B: EL RECUADRO FIJO BLANCO CON EL BOTÓN VERDE CUANDO EL ASESOR YA LO ACEPTÓ */}
        {/* -------------------------------------------------------------------------------------- */}
        {prestamoAprobadoOficial && (
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 space-y-6">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <div>
                <h4 className="font-black text-gray-900 text-sm uppercase tracking-wide">PLAN DE AMORTIZACIÓN GENERADO</h4>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">CUOTA MENSUAL</span>
                  <span className="text-xl font-black text-[#B91C1C]">S/ {prestamoAprobadoOficial.pagoMensual}</span>
                </div>
                <span className="bg-[#059669] text-white font-black text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm uppercase tracking-wider select-none">
                  ✓ SOLICITADO
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50/70 text-gray-400 font-bold border-b border-gray-200">
                    <th className="p-3 text-center w-20">N° Cuota</th>
                    <th className="p-3">Fecha de Pago</th>
                    <th className="p-3 text-right">Cuota</th>
                    <th className="p-3 text-right">Capital</th>
                    <th className="p-3 text-right">Interés</th>
                    <th className="p-3 text-right">Saldo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {prestamoAprobadoOficial.cronogramaDetallado?.map((item) => (
                    <tr key={item.num} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3 text-center font-bold text-gray-400">{item.num}</td>
                      <td className="p-3 font-medium text-gray-900">{item.fecha}</td>
                      <td className="p-3 text-right font-bold text-gray-900">S/ {item.cuota}</td>
                      <td className="p-3 text-right text-emerald-600 font-medium">S/ {item.capital}</td>
                      <td className="p-3 text-right text-amber-600 font-medium">S/ {item.interes}</td>
                      <td className="p-3 text-right font-mono text-gray-500">S/ {item.saldo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MENSAJE DE ESPERA EN TRÁNSITO (Aparecerá abajo si hay una solicitud enviada pendiente) */}
        {solicitudEnviada && !prestamoAprobadoOficial && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center text-amber-900 text-xs shadow-inner">
            <p className="font-bold uppercase tracking-wider mb-1">⌛ Operación en Tránsito Financiero</p>
            <p className="font-medium text-amber-700">
              Tu plan ya está cargado en la base de datos `dsolicitud`. En cuanto tu Analista de Créditos (**Carlos Mendoza**) haga clic en **Aprobar**, este panel cargará de inmediato tu cronograma oficial.
            </p>
          </div>
        )}

      </main>
    </div>
  );
}

export default DashboardCliente;