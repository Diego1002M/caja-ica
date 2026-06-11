import React, { useState } from 'react';

function Login({ rol, irAHome, alIngresar }) {
  const [dni, setDni] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  // Estados para el formulario de Registro
  const [esModoRegistro, setEsModoRegistro] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');

  // FUNCIÓN ESTRICTA DE INICIO DE SESIÓN CON POSTGRESQL
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMensajeExito('');
    setCargando(true);

    // Validación del Asesor Interno (Rol estático para la demo)
    if (rol === 'asesor') {
      if (dni === '99999999' && password === 'asesor123') {
        alIngresar({
          nombre: 'Carlos Mendoza (Asesor Caja Ica)',
          dni: '99999999',
          cargo: 'Analista de Créditos Principal'
        });
      } else {
        setError('Código de Asesor o contraseña institucional incorrecta.');
      }
      setCargando(false);
      return;
    }

    // Validación Estricta para Clientes en Base de Datos
    try {
      const respuesta = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dni, password }),
      });

      const datos = await respuesta.json();

      if (respuesta.ok) {
        // Si el usuario existe en Postgres, se le da acceso al Dashboard
        alIngresar({
          nombre: datos.nombre,
          dni: datos.dni,
          saldo: parseFloat(datos.saldo),
          intereses: datos.intereses
        });
      } else {
        // SI NO EXISTE O SE EQUIVOCÓ, BLOQUEO ABSOLUTO
        setError(datos.mensaje || 'Acceso denegado. El DNI o la contraseña no existen en el sistema.');
      }
    } catch (err) {
      setError('Error de comunicación: Asegúrate de encender el backend ejecuntando python main.py en la raíz.');
    } finally {
      setCargando(false);
    }
  };

  // FUNCIÓN PARA REGISTRAR EN LA BD (INSERT INTO)
  const handleRegistroSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMensajeExito('');
    setCargando(true);

    try {
      const respuesta = await fetch('http://localhost:5000/api/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dni: dni,
          nombre: nuevoNombre,
          password: password
        }),
      });

      const datos = await respuesta.json();

      if (respuesta.ok) {
        setMensajeExito('¡Cuenta creada con éxito en PostgreSQL! Ya puedes iniciar sesión.');
        setEsModoRegistro(false); // Regresa al Login
        setNuevoNombre('');
        setPassword('');
      } else {
        setError(datos.mensaje || 'Error al intentar registrar el usuario.');
      }
    } catch (err) {
      setError('Error de conexión con el backend de Python.');
    } finally {
      setCargando(false);
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
            {rol === 'asesor' ? 'Portal Asesores' : esModoRegistro ? 'Registro de Clientes' : 'Banca Personas'}
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            {rol === 'asesor' ? 'Ingresa tus credenciales de analista.' : esModoRegistro ? 'Crea una cuenta oficial vinculada a PostgreSQL.' : 'Acceso exclusivo para clientes registrados.'}
          </p>
        </div>
        <button onClick={irAHome} className="absolute bottom-6 right-8 text-sm font-bold text-gray-600 hover:text-red-600 transition cursor-pointer">
          Volver a la web
        </button>
      </div>

      <div className="w-1/2 bg-white flex flex-col items-center justify-center">
        <div className="w-full max-w-sm px-4">
          
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm font-semibold mb-4 border border-red-200">{error}</div>}
          {mensajeExito && <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm font-semibold mb-4 border border-green-200">{mensajeExito}</div>}
          
          <form onSubmit={esModoRegistro ? handleRegistroSubmit : handleLoginSubmit} className="space-y-4">
            
            {esModoRegistro && (
              <input 
                type="text" 
                value={nuevoNombre}
                onChange={(e) => setNuevoNombre(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-red-600" 
                placeholder="Nombre Completo (Ej: Juan Perez)" 
                required
              />
            )}

            <div className="flex border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-red-600">
              <span className="bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-500 border-r border-gray-300 flex items-center justify-center">
                {rol === 'asesor' ? 'COD' : 'DNI'}
              </span>
              <input 
                type="text" 
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                maxLength={8}
                className="w-full px-4 py-3 text-sm outline-none" 
                placeholder={rol === 'asesor' ? 'Código Asesor' : 'Número de Documento'} 
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

            <button type="submit" disabled={cargando} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-md transition text-lg shadow-md cursor-pointer disabled:bg-gray-400">
              {cargando ? 'Verificando en BD...' : esModoRegistro ? 'Registrar en PostgreSQL' : 'Ingresar Seguro'}
            </button>
          </form>

          {rol !== 'asesor' && (
            <div className="text-center mt-4">
              <button 
                onClick={() => { setError(''); setMensajeExito(''); setEsModoRegistro(!esModoRegistro); }} 
                className="text-sm font-bold text-red-600 hover:underline cursor-pointer"
              >
                {esModoRegistro ? '¿Ya tienes cuenta? Inicia sesión aquí' : '¿No tienes cuenta? Regístrate aquí'}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Login;