import React from 'react';

// Asegúrate de recibir los dos parámetros en la función principal:
function Home({ irALogin, irALoginAsesor }) {
  return (
    <div>
      {/* BARRA SUPERIOR DE NAVEGACIÓN CORREGIDA */}
      <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-sm">
        <div className="font-black text-xl text-red-700">CAJA ICA</div>
        <div className="flex gap-4">
          <button 
            onClick={irALogin} 
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded shadow transition text-sm cursor-pointer"
          >
            Banca Personas
          </button>
          <button 
            onClick={irALoginAsesor} 
            className="bg-slate-700 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded shadow transition text-sm cursor-pointer"
          >
            Acceso Asesor Interno
          </button>
        </div>
      </nav>

      {/* El resto del contenido de tu Home que ya tenías abajo... */}
      <div className="p-8 text-center">
        <h1 className="text-3xl font-bold mt-10">¡Son S/5,000 en premios!</h1>
        <p className="text-gray-500 mt-2">Simula tus créditos y ahorros en nuestra banca por internet.</p>
      </div>
    </div>
  );
}

export default Home;