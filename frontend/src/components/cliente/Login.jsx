import React, { useState } from 'react';

function Login({ rol, irAHome, alIngresar }) {
  const [dni, setDni] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (rol === 'asesor') {
      // Credenciales exclusivas del asesor interno para la sustentación
      if (dni === '99999999' && password === 'asesor123') {
        alIngresar({
          nombre: 'Carlos Mendoza (Asesor Caja Ica)',
          dni: '99999999',
          cargo: 'Analista de Créditos Principal'
        });
      } else {
        setError('Código de Asesor o contraseña institucional incorrecta.');
      }
    } else {
      // Credenciales del cliente Juan Pérez
      if (dni === '74859612') {
        alIngresar({
          nombre: 'Juan Perez',
          dni: '74859612',
          saldo: 2550.80,
          intereses: '145.20'
        });
      } else {
        // Por si pones cualquier otro número en modo cliente
        alIngresar({
          nombre: 'Usuario de Prueba',
          dni: dni,
          saldo: 1500.00,
          intereses: '0.00'
        });
      }
    }
  };

  return (
    <div className="flex w-full bg-white h-screen">
      <div className="w-1/2 bg-gray-50 flex flex-col items-center justify-center relative border-r border-gray-200">
        <div className="absolute top-6 left-8 flex items-center gap-2 text-red-600 font-bold text-2xl">
          CAJA ICA
        </div>
        <div className="text-center max-w-sm px-6">
          <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">
            {rol === 'asesor' ? 'Portal Institucional Asesores' : 'Homebanking Persona'}
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            {rol === 'asesor' ? 'Ingresa tus credenciales de analista de riesgos.' : 'Ingresa tus datos para simular tu estado de cuenta.'}
          </p>
        </div>
        <button onClick={irAHome} className="absolute bottom-6 right-8 text-sm font-bold text-gray-600 hover:text-red-600 transition cursor-pointer">
          Volver a la web
        </button>
      </div>

      <div className="w-1/2 bg-white flex flex-col items-center justify-center">
        <div className="w-full max-w-sm px-4">
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm font-semibold mb-4 border border-red-200">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-red-600">
              <select className="bg-gray-50 px-3 py-3 border-r border-gray-300 text-sm font-semibold outline-none">
                <option>{rol === 'asesor' ? 'COD' : 'DNI'}</option>
              </select>
              <input 
                type="text" 
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                className="w-full px-4 py-3 text-sm outline-none" 
                placeholder={rol === 'asesor' ? 'Código de Asesor (Ej: 99999999)' : 'Número de Documento (Ej: 74859612)'} 
                required
              />
            </div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-red-600" 
              placeholder="Contraseña" 
              required
            />
            <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-md transition text-lg shadow-md cursor-pointer">
              Ingresar como {rol === 'asesor' ? 'Asesor' : 'Cliente'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;