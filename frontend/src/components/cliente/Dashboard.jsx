import React from 'react';

function Dashboard({ usuario, irAHome }) {
  // Tomamos los datos dinámicos que vienen desde el Login, o por defecto los de Juan
  const nombreCliente = usuario?.nombre || 'Juan Perez';
  const dniCliente = usuario?.dni || '74859612';
  const saldoCliente = usuario?.saldo || '2550.8';
  const interesesCliente = usuario?.intereses || '145.20';

  return (
    <div className="min-h-screen bg-[#F4F6F8] py-10 px-6 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* ENCABEZADO */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-[#1F2937]">Hola, {nombreCliente}</h2>
            <p className="text-gray-500 text-sm mt-0.5">Última conexión: Hoy 10:45 AM</p>
          </div>
          <button 
            onClick={irAHome} 
            className="bg-[#E5E7EB] hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-lg font-bold text-xs shadow-sm transition cursor-pointer"
          >
            Cerrar sesión
          </button>
        </div>

        {/* CONTENEDOR PRINCIPAL: TARJETAS DE SALDO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* TARJETA ROJA (CUENTA DE AHORROS) */}
          <div className="md:col-span-2 bg-gradient-to-br from-[#B91C1C] to-[#991B1B] rounded-2xl shadow-md p-6 text-white relative overflow-hidden flex flex-col justify-between min-h-[200px]">
            <div>
              <p className="text-red-200 text-xs font-bold uppercase tracking-wider mb-0.5">Cuenta Ahorro FlexiTotal</p>
              <p className="text-sm font-medium text-red-100">DNI Vinculado: {dniCliente}</p>
            </div>
            
            <div className="mt-6">
              <p className="text-red-200 text-xs font-medium mb-0.5">Saldo Disponible</p>
              <h3 className="text-5xl font-black tracking-tight">S/ {saldoCliente}</h3>
            </div>

            {/* Icono de información decorativo gigante al fondo de la tarjeta */}
            <div className="absolute right-4 bottom-1/2 translate-y-1/2 opacity-10 pointer-events-none">
              <svg className="w-36 h-36" fill="white" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
              </svg>
            </div>
          </div>

          {/* TARJETA BLANCA (INTERESES GANADOS) */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Intereses Ganados</span>
                <span className="bg-[#FEF3C7] text-[#B45309] text-[10px] font-extrabold px-2 py-0.5 rounded-full">+ 7.00% TREA</span>
              </div>
              <h4 className="text-3xl font-black text-gray-800">S/ {interesesCliente}</h4>
              <p className="text-gray-400 text-xs mt-1">Acumulado este mes</p>
            </div>

            <button className="w-full text-center text-[#B8860B] font-bold text-xs py-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl transition border border-gray-100 cursor-pointer">
              Ver detalle de intereses
            </button>
          </div>

        </div>

        {/* ACCIONES RÁPIDAS (LOS 4 BOTONES REDONDEADOS) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <button className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 font-bold text-xs text-gray-700 hover:shadow-md transition cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-cajaRojo group-hover:bg-cajaRojo group-hover:text-white transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
            </div>
            Transferir
          </button>

          <button className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 font-bold text-xs text-gray-700 hover:shadow-md transition cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-cajaRojo group-hover:bg-cajaRojo group-hover:text-white transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            Préstamos
          </button>

          <button className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 font-bold text-xs text-gray-700 hover:shadow-md transition cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-cajaRojo group-hover:bg-cajaRojo group-hover:text-white transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            </div>
            Abrir Ahorro
          </button>

          <button className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 font-bold text-xs text-gray-700 hover:shadow-md transition cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-cajaRojo group-hover:bg-cajaRojo group-hover:text-white transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            Pagar Servicios
          </button>
        </div>

        {/* SECCIÓN DE ÚLTIMOS MOVIMIENTOS */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-extrabold text-gray-800 text-sm uppercase tracking-wider">Últimos Movimientos</h3>
            <button className="text-cajaRojo hover:underline text-xs font-bold cursor-pointer">Ver todos</button>
          </div>

          <div className="space-y-4">
            
            {/* MOVIMIENTO 1: DEPÓSITO */}
            <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-800">Depósito en Efectivo</p>
                  <p className="text-gray-400 text-xs">Agencia Ica Principal - 10 May 2024</p>
                </div>
              </div>
              <span className="font-bold text-green-600 text-sm">+ S/ 500.00</span>
            </div>

            {/* MOVIMIENTO 2: PAGO SERVICIOS */}
            <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-800">Pago de Servicios (Luz del Sur)</p>
                  <p className="text-gray-400 text-xs">Banca por Internet - 08 May 2024</p>
                </div>
              </div>
              <span className="font-bold text-gray-800 text-sm">- S/ 120.50</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;