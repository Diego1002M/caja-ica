import React, { useState } from 'react';

function Login({ irAHome, alIngresar }) {
  const [dni, setDni] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Si digitas el DNI de tu captura, cargamos los datos exactos
    if (dni === '74859612') {
      alIngresar({
        nombre: 'Juan Perez',
        dni: '74859612',
        saldo: '2550.8',
        intereses: '145.20'
      });
    } else {
      // Por si pones cualquier otro número
      alIngresar({
        nombre: 'Usuario General',
        dni: dni || '00000000',
        saldo: '1,500.00',
        intereses: '0.00'
      });
    }
  };

  return (
    <div className="flex w-full bg-white h-screen">
      <div className="w-1/2 bg-gray-50 flex flex-col items-center justify-center relative border-r border-gray-200">
        <div className="absolute top-6 left-8 flex items-center gap-2 text-cajaRojo font-bold text-2xl">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.1L1 12h3v9h6v-6h4v6h6v-9h3L12 2.1z"/></svg>
          CAJA ICA
        </div>

        <div className="text-center max-w-sm px-6">
          <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">
            Bienvenido al <br /> Homebanking Persona
          </h2>
          <p className="text-gray-500 text-sm mt-2">Ingresa tus datos para simular tu estado de cuenta.</p>
        </div>
        
        <button onClick={irAHome} className="absolute bottom-6 right-8 text-sm font-bold flex items-center gap-2 cursor-pointer text-gray-600 hover:text-cajaRojo transition">
          Volver a la web
        </button>
      </div>

      <div className="w-1/2 bg-white flex flex-col items-center justify-center">
        <div className="w-full max-w-sm px-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-cajaRojo focus-within:border-cajaRojo">
              <select className="bg-gray-50 px-3 py-3 border-r border-gray-300 text-sm font-semibold outline-none"><option>DNI</option></select>
              <input 
                type="text" 
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                maxLength={8}
                className="w-full px-4 py-3 text-sm outline-none" 
                placeholder="Número de Documento (Ej: 74859612)" 
                required
              />
            </div>

            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cajaRojo focus:border-cajaRojo" 
              placeholder="Contraseña" 
              required
            />

            <button type="submit" className="w-full bg-cajaRojoSuave hover:bg-cajaRojo text-white font-bold py-3 rounded-md transition text-lg shadow-md mt-2 cursor-pointer">
              Ingresar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;