import React from 'react';

function Home({ irALogin }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="shadow-md bg-white transition-all">
        <div className="bg-cajaRojo text-white py-3 px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <svg className="w-8 h-8" fill="white" viewBox="0 0 24 24"><path d="M12 2.1L1 12h3v9h6v-6h4v6h6v-9h3L12 2.1z"/></svg>
            <span className="text-3xl font-bold tracking-tight">CAJA ICA</span>
          </div>
          <div className="flex gap-2 text-sm">
            {/* AQUÍ ESTÁ LA MAGIA: onClick={irALogin} */}
            <button onClick={irALogin} className="bg-white cursor-pointer text-cajaRojo px-4 py-1.5 rounded font-bold hover:bg-gray-100 transition flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
              Personas
            </button>
            <button className="bg-cajaRojo border border-white text-white px-4 py-1.5 rounded font-bold hover:bg-red-800 transition flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/></svg>
              Empresas
            </button>
          </div>
        </div>
        <div className="bg-[#B8860B] text-white py-2 px-6 flex justify-center gap-8 text-sm font-semibold">
          <span className="hover:underline cursor-pointer">Créditos</span>
          <span className="hover:underline cursor-pointer">Ahorros</span>
          <span className="hover:underline cursor-pointer">Seguros</span>
          <span className="hover:underline cursor-pointer">Servicios</span>
        </div>
      </header>

      <main className="flex-grow flex flex-col">
        <div className="bg-cajaRojo text-white flex items-stretch h-[400px]">
          <div className="w-1/2 p-16 flex flex-col justify-center items-start gap-4">
            <span className="text-sm border border-white px-3 py-1 rounded-full bg-white/20">Actualiza tus datos y participa</span>
            <h1 className="text-5xl font-extrabold leading-tight">¡Son S/5,000 en premios!</h1>
            <p className="text-xl">Serán 10 ganadores.</p>
          </div>
          <div className="w-1/2 bg-red-900 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')" }}>
          </div>
        </div>
        <div className="max-w-6xl mx-auto py-10 grid grid-cols-4 gap-6 text-center w-full mb-10">
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-cajaRojo font-bold text-gray-700">Créditos rápidos</div>
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-cajaRojo font-bold text-gray-700">Ahorros rentables</div>
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-cajaRojo font-bold text-gray-700">Canales efectivos</div>
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-cajaRojo font-bold text-gray-700">Mejores servicios</div>
        </div>
      </main>

      <footer className="bg-cajaRojo text-white py-8 px-10 text-sm border-t border-red-800 mt-auto">
        <div className="text-center text-xs text-red-200">
          © 2024 Caja Municipal de Ahorro y Crédito Ica S.A. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}

export default Home;