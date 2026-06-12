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

  const esAsesor = rol === 'asesor';

  // FUNCIÓN ESTRICTA DE INICIO DE SESIÓN CON POSTGRESQL (Mantenida intacta)
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMensajeExito('');
    setCargando(true);

    // Validación del Asesor Interno (Rol estático para la demo)
    if (rol === 'asesor') {
      if (dni === '60741323' && password === '218543') {
        alIngresar({
          nombre: 'Carlos Mendoza (Asesor Caja Ica)',
          dni: '60741323',
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
        alIngresar({
          nombre: datos.nombre,
          dni: datos.dni,
          saldo: parseFloat(datos.saldo),
          intereses: datos.intereses
        });
      } else {
        setError(datos.mensaje || 'Acceso denegado. El DNI o la contraseña no existen en el sistema.');
      }
    } catch (err) {
      setError('Error de comunicación: Asegúrate de encender el backend ejecutando python main.py en la raíz.');
    } finally {
      setCargando(false);
    }
  };

  // FUNCIÓN PARA REGISTRAR EN LA BD (Mantenida intacta)
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
    <div className="min-h-screen bg-[#F4F6F9] font-sans flex flex-col md:flex-row">
      
      {/* LADO IZQUIERDO: PANEL DE BIENVENIDA MODERNO Y ASINCRÓNICO */}
      <div className={`w-full md:w-1/2 bg-gradient-to-tr ${esAsesor ? 'from-slate-800 to-slate-950' : 'from-[#B91C1C] to-red-600'} text-white p-12 flex flex-col justify-between relative overflow-hidden shadow-2xl`}>
        
        {/* Logo superior */}
        <div className="relative z-10">
          <span className="font-black text-2xl tracking-wider cursor-pointer" onClick={irAHome}>
            CAJA ICA
          </span>
        </div>

        {/* Texto central adaptativo al modo Registro / Login */}
        <div className="max-w-md my-auto space-y-4 relative z-10">
          <span className="bg-white/20 backdrop-blur-sm text-white font-extrabold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
            {esAsesor ? '🔒 Canal Interno' : esModoRegistro ? '📝 Alta de Cliente' : '📱 Canal Oficial'}
          </span>
          <h1 className="text-4xl font-black tracking-tight leading-tight uppercase">
            {esAsesor ? 'Portal Asesores' : esModoRegistro ? 'Registro de Clientes' : 'Banca Personas'}
          </h1>
          <p className="text-red-100 text-sm leading-relaxed">
            {esAsesor 
              ? 'Ingresa tus credenciales de analista para evaluar transacciones en tiempo real.' 
              : esModoRegistro 
              ? 'Crea una cuenta oficial vinculada directamente a la base de datos PostgreSQL de nuestra caja.' 
              : 'Ingresa de forma 100% segura para simular tus préstamos y gestionar tus solicitudes vigentes.'
            }
          </p>
          
          <div className="pt-4 flex gap-4 text-xs text-red-200">
            <div className="flex items-center gap-1.5 bg-black/10 px-3 py-1.5 rounded-lg border border-white/5">
              🛡️ Encriptación SSL
            </div>
            <div className="flex items-center gap-1.5 bg-black/10 px-3 py-1.5 rounded-lg border border-white/5">
              🐘 PostgreSQL Activo
            </div>
          </div>
        </div>

        {/* Botón inferior para regresar */}
        <div className="relative z-10 pt-6">
          <button 
            onClick={irAHome}
            className="text-xs font-bold text-white/80 hover:text-white flex items-center gap-1 transition cursor-pointer"
          >
            ← Volver a la página web
          </button>
        </div>

        {/* Círculos estéticos modernos de fondo */}
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-black/20 rounded-full blur-3xl"></div>
      </div>

      {/* LADO DERECHO: FORMULARIO FLOTANTE ESTILIZADO */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-[#F8FAFC]">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 max-w-md w-full space-y-5">
          
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-black text-gray-900">
              {esModoRegistro ? 'Crea tu Cuenta' : '¡Hola de nuevo!'}
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              {esModoRegistro ? 'Introduce tus datos reales para el registro del Core.' : 'Introduce tus credenciales autorizadas.'}
            </p>
          </div>

          {/* Alertas de Base de Datos */}
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-semibold border border-red-100 shadow-sm">
              🚨 {error}
            </div>
          )}
          {mensajeExito && (
            <div className="bg-green-50 text-green-600 p-3 rounded-xl text-xs font-semibold border border-green-100 shadow-sm">
              ✅ {mensajeExito}
            </div>
          )}

          <form onSubmit={esModoRegistro ? handleRegistroSubmit : handleLoginSubmit} className="space-y-4">
            
            {/* Campo Nombre Completo (Solo visible si es modo registro) */}
            {esModoRegistro && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider block">
                  Nombre Completo
                </label>
                <div className="flex rounded-xl border border-gray-200 focus-within:border-red-500 shadow-sm transition overflow-hidden">
                  <span className="bg-gray-50 text-gray-400 px-3.5 flex items-center justify-center font-bold text-xs border-r border-gray-100">
                    👤
                  </span>
                  <input 
                    type="text" 
                    value={nuevoNombre}
                    onChange={(e) => setNuevoNombre(e.target.value)}
                    placeholder="Ej: Juan Perez" 
                    className="w-full px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none"
                    required
                  />
                </div>
              </div>
            )}

            {/* Campo DNI / COD */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider block">
                {esAsesor ? 'Código de Analista' : 'Número de Documento (DNI)'}
              </label>
              <div className="flex rounded-xl border border-gray-200 focus-within:border-red-500 shadow-sm transition overflow-hidden">
                <span className="bg-gray-50 text-gray-400 px-3.5 flex items-center justify-center font-extrabold text-[10px] border-r border-gray-100 text-slate-500">
                  {esAsesor ? 'COD' : 'DNI'}
                </span>
                <input 
                  type="text" 
                  maxLength={8}
                  value={dni}
                  onChange={(e) => setDni(e.target.value)}
                  placeholder={esAsesor ? 'Código Asesor' : 'Ingresa tus 8 dígitos'} 
                  className="w-full px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Campo Contraseña */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider block">
                Contraseña de Internet
              </label>
              <div className="flex rounded-xl border border-gray-200 focus-within:border-red-500 shadow-sm transition overflow-hidden">
                <span className="bg-gray-50 text-gray-400 px-3.5 flex items-center justify-center font-bold text-xs border-r border-gray-100">
                  🔑
                </span>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Botón de Submit Dinámico */}
            <div className="pt-2">
              <button 
                type="submit"
                disabled={cargando}
                className={`w-full text-white font-bold py-3.5 rounded-xl text-sm uppercase tracking-wider shadow-md transition transform active:scale-95 cursor-pointer disabled:bg-gray-300 disabled:transform-none ${
                  esAsesor 
                    ? 'bg-slate-800 hover:bg-slate-900 shadow-slate-900/20' 
                    : 'bg-[#B91C1C] hover:bg-red-700 shadow-red-700/20'
                }`}
              >
                {cargando ? '🔄 Verificando en BD...' : esModoRegistro ? 'Registrar en PostgreSQL' : 'Ingresar Seguro →'}
              </button>
            </div>
          </form>

          {/* BOTÓN CONMUTADOR DE REGISTRO E INICIO (Mantiene viva la lógica original) */}
          {(!esAsesor) && (
            <div className="text-center pt-2 border-t border-gray-100">
              <button 
                onClick={() => { setError(''); setMensajeExito(''); setEsModoRegistro(!esModoRegistro); }} 
                className="text-xs font-bold text-[#B91C1C] hover:underline cursor-pointer tracking-wide"
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