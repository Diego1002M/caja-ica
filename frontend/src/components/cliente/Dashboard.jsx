import React, { useState } from 'react';

function Dashboard({ usuario, irAHome, prestamosGlobales, setPrestamosGlobales }) {
  const nombreCliente = usuario?.nombre || 'Juan Perez';
  const dniCliente = usuario?.dni || '74859612';
  
  // El saldo inicial se calcula sumando los préstamos aprobados que tenga este cliente
  const prestamosAprobadosMonto = prestamosGlobales
    .filter(p => p.dni === dniCliente && p.estado === 'Aprobado')
    .reduce((total, p) => total + p.monto, 0);

  const saldoInicialBase = usuario?.saldo || 2550.80;
  const saldoTotal = saldoInicialBase + prestamosAprobadosMonto;
  const interesesCliente = usuario?.intereses || '145.20';

  const [mostrarSimulador, setMostrarSimulador] = useState(false);
  const [montoPrestamo, setMontoPrestamo] = useState('');
  const [cuotas, setCuotas] = useState('12');

  const enviarSolicitudPrestamo = (e) => {
    e.preventDefault();
    if (!montoPrestamo || montoPrestamo <= 0) return;

    const montoTotalConInteres = parseFloat(montoPrestamo) * 1.15;
    const pagoMensual = montoTotalConInteres / parseInt(cuotas);

    // Creamos la nueva solicitud y la inyectamos a la lista compartida que verá el asesor
    const nuevaSolicitud = {
      id: Date.now(),
      cliente: nombreCliente,
      dni: dniCliente,
      monto: parseFloat(montoPrestamo),
      cuotas: cuotas,
      pagoMensual: pagoMensual.toFixed(2),
      estado: 'Pendiente' // Empieza en evaluación
    };

    setPrestamosGlobales([...prestamosGlobales, nuevaSolicitud]);
    setMostrarSimulador(false);
    setMontoPrestamo('');
    alert('¡Solicitud enviada con éxito! Queda en espera de la aprobación del asesor.');
  };

  // Construimos la lista de movimientos uniendo los base más los créditos aprobados
  const movimientosBase = [
    { id: 1, tipo: 'deposito', titulo: 'Depósito en Efectivo', detalle: 'Agencia Ica Principal - 10 May 2024', monto: 500.00 },
    { id: 2, tipo: 'pago', titulo: 'Pago de Servicios (Luz del Sur)', detalle: 'Banca por Internet - 08 May 2024', monto: -120.50 }
  ];

  const misCreditosAprobados = prestamosGlobales
    .filter(p => p.dni === dniCliente && p.estado === 'Aprobado')
    .map(p => ({
      id: p.id,
      tipo: 'deposito',
      titulo: 'Crédito Aprobado por Asesor',
      detalle: `Desembolso online - ${p.cuotas} meses`,
      monto: p.monto
    }));

  const todosLosMovimientos = [...misCreditosAprobados, ...movimientosBase];

  return (
    <div className="min-h-screen bg-[#F4F6F8] py-10 px-6 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* ENCABEZADO */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-[#1F2937]">Hola, {nombreCliente}</h2>
            <p className="text-gray-500 text-sm mt-0.5">Módulo de Cliente</p>
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
              <p className="text-red-200 text-xs mb-0.5">Saldo Disponible</p>
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

        {/* ACCIONES RÁPIDAS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col items-center justify-center gap-2 font-bold text-xs text-gray-400">
            Transferir
          </div>

          <button 
            onClick={() => setMostrarSimulador(!mostrarSimulador)} 
            className="bg-white p-4 rounded-xl shadow border-2 border-amber-500 flex flex-col items-center justify-center gap-2 font-bold text-xs text-amber-700 hover:bg-amber-50 transition cursor-pointer"
          >
            💰 Simular Préstamo
          </button>

          <div className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col items-center justify-center gap-2 font-bold text-xs text-gray-400">
            Abrir Ahorro
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col items-center justify-center gap-2 font-bold text-xs text-gray-400">
            Pagar Servicios
          </div>
        </div>

        {/* FORMULARIO SIMULADOR */}
        {mostrarSimulador && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
            <h3 className="font-extrabold text-amber-900 mb-3">💰 Simulador de Crédito Personal</h3>
            <form onSubmit={enviarSolicitudPrestamo} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-xs font-bold text-amber-800 mb-1">Monto (S/)</label>
                <input type="number" value={montoPrestamo} onChange={(e) => setMontoPrestamo(e.target.value)} className="w-full bg-white border p-2 rounded text-sm outline-none" placeholder="Monto" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-amber-800 mb-1">Plazo</label>
                <select value={cuotas} onChange={(e) => setCuotas(e.target.value)} className="w-full bg-white border p-2 rounded text-sm outline-none">
                  <option value="6">6 Meses</option>
                  <option value="12">12 Meses</option>
                </select>
              </div>
              <button type="submit" className="bg-amber-600 text-white font-bold py-2 px-4 rounded text-sm cursor-pointer">Solicitar</button>
            </form>
          </div>
        )}

        {/* HISTORIAL */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h3 className="font-extrabold text-gray-800 text-sm uppercase tracking-wider mb-4">Últimos Movimientos</h3>
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