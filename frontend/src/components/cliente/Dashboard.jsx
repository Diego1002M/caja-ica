import React, { useState } from 'react';

function Dashboard({ usuario, irAHome, prestamosGlobales, setPrestamosGlobales }) {
  const nombreCliente = usuario?.nombre || 'Juan Perez';
  const dniCliente = usuario?.dni || '74859612';
  
  // 1. Filtrar los préstamos de este cliente que ya fueron APROBADOS por el asesor
  const misPrestamosAprobados = prestamosGlobales ? prestamosGlobales.filter(
    (p) => p.dni === dniCliente && p.estado === 'Aprobado'
  ) : [];

  // Calcular el saldo dinámico restando los pagos que haga el cliente
  const [pagosEfectuados, setPagosEfectuados] = useState(0);

  const prestamosAprobadosMonto = misPrestamosAprobados.reduce((total, p) => total + p.monto, 0);
  const saldoInicialBase = usuario?.saldo || 2550.80;
  const saldoTotal = saldoInicialBase + prestamosAprobadosMonto - pagosEfectuados;
  const interesesCliente = usuario?.intereses || '145.20';

  const [mostrarSimulador, setMostrarSimulador] = useState(false);
  const [montoPrestamo, setMontoPrestamo] = useState('');
  const [cuotas, setCuotas] = useState('12');

  // Función para enviar solicitud al Asesor Interno
  const enviarSolicitudPrestamo = (e) => {
    e.preventDefault();
    if (!montoPrestamo || montoPrestamo <= 0) return;

    const montoTotalConInteres = parseFloat(montoPrestamo) * 1.15; // 15% Interés Caja Ica
    const pagoMensual = montoTotalConInteres / parseInt(cuotas);

    const nuevaSolicitud = {
      id: Date.now(),
      cliente: nombreCliente,
      dni: dniCliente,
      monto: parseFloat(montoPrestamo),
      cuotas: parseInt(cuotas),
      cuotasPagadas: 0, 
      pagoMensual: pagoMensual.toFixed(2),
      montoTotalConInteres: montoTotalConInteres.toFixed(2),
      estado: 'Pendiente'
    };

    setPrestamosGlobales([...prestamosGlobales, nuevaSolicitud]);
    setMostrarSimulador(false);
    setMontoPrestamo('');
    alert('¡Solicitud enviada! El asesor interno debe ingresar y aprobarla para que se desembolse.');
  };

  // FUNCIÓN PARA PAGAR UNA CUOTA DEL PRÉSTAMO
  const pagarCuotaPrestamo = (id, valorCuota) => {
    if (saldoTotal < valorCuota) {
      alert('⚠️ Saldo insuficiente en tu Cuenta Ahorro para pagar esta cuota.');
      return;
    }

    const actualizados = prestamosGlobales.map((p) => {
      if (p.id === id) {
        const nuevasPagadas = (p.cuotasPagadas || 0) + 1;
        return { ...p, cuotasPagadas: nuevasPagadas };
      }
      return p;
    });

    setPrestamosGlobales(actualizados);
    setPagosEfectuados(pagosEfectuados + valorCuota); 
    alert(`✅ ¡Pago exitoso! Se cargó S/ ${valorCuota.toFixed(2)} a tu cuenta.`);
  };

  // Historial de Movimientos Base
  const movimientosBase = [
    { id: 1, tipo: 'deposito', titulo: 'Depósito en Efectivo', detalle: 'Agencia Ica Principal', monto: 500.00 },
    { id: 2, tipo: 'pago', titulo: 'Pago de Servicios (Luz)', detalle: 'Banca por Internet', monto: -120.50 }
  ];

  const misDesembolsosMov = misPrestamosAprobados.map(p => ({
    id: p.id,
    tipo: 'deposito',
    titulo: 'Crédito Online Aprobado',
    detalle: `Desembolso automático - ${p.cuotas} meses`,
    monto: p.monto
  }));

  const todosLosMovimientos = [...misDesembolsosMov, ...movimientosBase];

  return (
    <div className="min-h-screen bg-[#F4F6F8] py-10 px-6 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* ENCABEZADO */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-[#1F2937]">Hola, {nombreCliente}</h2>
            <p className="text-gray-500 text-sm mt-0.5">Módulo Banca Personas</p>
          </div>
          <button onClick={irAHome} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-lg font-bold text-xs shadow-sm cursor-pointer">
            Cerrar sesión
          </button>
        </div>

        {/* TARJETAS DE SALDO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2 bg-gradient-to-br from-[#B91C1C] to-[#991B1B] rounded-2xl shadow-md p-6 text-white flex flex-col justify-between min-h-[170px]">
            <div>
              <p className="text-red-200 text-xs font-bold uppercase mb-0.5">Cuenta Ahorro FlexiTotal</p>
              <p className="text-sm">DNI Vinculado: {dniCliente}</p>
            </div>
            <div>
              <p className="text-red-200 text-xs mb-0.5">Saldo Disponible Actual</p>
              <h3 className="text-4xl font-black">S/ {saldoTotal.toFixed(2)}</h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
            <div>
              <p className="text-gray-500 text-xs font-bold uppercase mb-2">Intereses Ganados</p>
              <h4 className="text-2xl font-black text-gray-800">S/ {interesesCliente}</h4>
            </div>
            <span className="text-xs text-amber-600 font-bold bg-amber-50 p-2 rounded-lg text-center">+ 7.00% TREA</span>
          </div>
        </div>

        {/* ACCIONES */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <button 
            onClick={() => setMostrarSimulador(!mostrarSimulador)} 
            className="bg-white p-4 rounded-xl shadow border-2 border-amber-500 flex flex-col items-center justify-center gap-2 font-bold text-xs text-amber-700 hover:bg-amber-50 transition cursor-pointer"
          >
            💰 Simular y Pedir Préstamo
          </button>
          <div className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col items-center justify-center text-xs text-gray-400">Transferir</div>
          <div className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col items-center justify-center text-xs text-gray-400">Abrir Ahorro</div>
          <div className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col items-center justify-center text-xs text-gray-400">Pagar Servicios</div>
        </div>

        {/* FORMULARIO SIMULADOR */}
        {mostrarSimulador && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
            <h3 className="font-extrabold text-amber-900 mb-3">💰 Simulador de Crédito Personal</h3>
            <form onSubmit={enviarSolicitudPrestamo} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-xs font-bold text-amber-800 mb-1">Monto a solicitar (S/)</label>
                <input type="number" value={montoPrestamo} onChange={(e) => setMontoPrestamo(e.target.value)} className="w-full bg-white border p-2 rounded text-sm outline-none" placeholder="Ej: 5000" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-amber-800 mb-1">Plazo de Devolución</label>
                <select value={cuotas} onChange={(e) => setCuotas(e.target.value)} className="w-full bg-white border p-2 rounded text-sm outline-none">
                  <option value="6">6 Meses</option>
                  <option value="12">12 Meses</option>
                  <option value="24">24 Meses</option>
                </select>
              </div>
              <button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded text-sm cursor-pointer">
                Enviar a Evaluación
              </button>
            </form>
          </div>
        )}

        {/* SECCIÓN: HISTORIAL DE PRÉSTAMOS ACTIVOS Y DEVOLUCIÓN */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 mb-8">
          <h3 className="font-extrabold text-gray-800 text-sm uppercase tracking-wider mb-4 text-red-700">
            📊 Mis Préstamos Activos (Seguimiento de Devolución)
          </h3>
          
          {misPrestamosAprobados.length === 0 ? (
            <p className="text-gray-400 text-xs italic py-2">No registras préstamos vigentes aprobados en este momento.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b text-gray-400 uppercase font-bold bg-gray-50 text-[10px]">
                    <th className="py-3 px-2">Monto Neto</th>
                    <th className="py-3 px-2">Meses Elegidos</th>
                    <th className="py-3 px-2">Pago Mensual</th>
                    <th className="py-3 px-2">Deuda Total (+Int)</th>
                    <th className="py-3 px-2">Progreso de Cuotas</th>
                    <th className="py-3 px-2 text-right">Acción de Devolución</th>
                  </tr>
                </thead>
                <tbody>
                  {misPrestamosAprobados.map((p) => {
                    const mensualidad = parseFloat(p.pagoMensual);
                    const totalConInteres = parseFloat(p.montoTotalConInteres || (p.monto * 1.15));
                    const cuotasPagadasTotales = p.cuotasPagadas || 0;
                    const estaCancelado = cuotasPagadasTotales >= p.cuotas;

                    return (
                      <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50 font-medium">
                        <td className="py-4 px-2 font-bold text-gray-800">S/ {p.monto.toFixed(2)}</td>
                        <td className="py-4 px-2 text-gray-600">{p.cuotas} Meses</td>
                        <td className="py-4 px-2 text-sky-600 font-bold">S/ {mensualidad.toFixed(2)}</td>
                        <td className="py-4 px-2 text-red-600 font-bold">S/ {totalConInteres.toFixed(2)}</td>
                        <td className="py-4 px-2">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${estaCancelado ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                            {cuotasPagadasTotales} de {p.cuotas} Pagadas
                          </span>
                        </td>
                        <td className="py-4 px-2 text-right">
                          {estaCancelado ? (
                            <span className="text-green-600 font-bold text-xs uppercase">✓ Deuda Pagada</span>
                          ) : (
                            <button
                              onClick={() => pagarCuotaPrestamo(p.id, mensualidad)}
                              className="bg-green-600 hover:bg-green-700 text-white font-bold px-3 py-1.5 rounded text-[11px] cursor-pointer shadow-sm transition"
                            >
                              💵 Pagar Cuota
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

        {/* HISTORIAL GENERAL DE MOVIMIENTOS */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h3 className="font-extrabold text-gray-800 text-sm uppercase tracking-wider mb-4">Historial General de Movimientos</h3>
          <div className="space-y-4">
            {todosLosMovimientos.map((mov) => (
              <div key={mov.id} className="flex justify-between items-center py-2 border-b last:border-0">
                <div>
                  <p className="font-bold text-sm text-gray-800">{mov.titulo}</p>
                  <p className="text-gray-400 text-xs">{mov.detalle}</p>
                </div>
                <span className={`font-bold text-sm ${mov.monto > 0 ? 'text-green-600' : 'text-gray-800'}`}>
                  {mov.monto > 0 ? `+ S/ ${mov.monto.toFixed(2)}` : `- S/ ${Math.abs(mov.monto).toFixed(2)}`}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;