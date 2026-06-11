import React, { useState } from 'react';

function Login({ rol, irAHome, alIngresar }) {
  const [dni, setDni] = useState('');
  const [password, setPassword] = useState('');

  const esAsesor = rol === 'asesor';

  const manejarEnvio = (e) => {
    e.preventDefault();
    if (!dni || !password) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    // Simulando base de datos del core o usuarios de prueba
    if (esAsesor) {
      if (dni === '11223344' && password === 'admin') {
        alIngresar({ nombre: 'Carlos Mendoza', cargo: 'Analista de Créditos Principal', pkasesor: 1 });
      } else {
        alert('Credenciales de Asesor incorrectas (Prueba con DNI: 11223344 y clave: admin)');
      }
    } else {
      // Simulación Cliente (DNI por defecto del mockup)
      if (dni === '11223344') {
        alIngresar({ nombre: 'Pablo', pkcliente: 'CLI-007', dni: '11223344' });
      } else {
        // Permitir registrar o usar cualquier DNI dinámico para pruebas
        alIngresar({ nombre: 'Usuario Web', pkcliente: 'CLI-' + Math.floor(Math.random() * 1000), dni: dni });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] font-sans flex flex-col md:flex-row">
      
      {/* LADO IZQUIERDO: PANEL DE BIENVENIDA MODERNO Y CON VIDA */}
      <div className={`w-full md:w-1/2 bg-gradient-to-tr ${esAsesor ? 'from-slate-800 to-slate-950' : 'from-[#B91C1C] to-red-600'} text-white p-12 flex flex-col justify-between relative overflow-hidden shadow-2xl`}>
        
        {/* Logo superior */}
        <div className="relative z-10">
          <span className="font-black text-2xl tracking-wider cursor-pointer" onClick={irAHome}>
            CAJA ICA
          </span>
        </div>

        {/* Texto central con iconos */}
        <div className="max-w-md my-auto space-y-4 relative z-10">
          <span className="bg-white/20 backdrop-blur-sm text-white font-extrabold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
            {esAsesor ? '🔒 Canal Interno' : '📱 Canal Oficial'}
          </span>
          <h1 className="text-4xl font-black tracking-tight leading-tight uppercase">
            {esAsesor ? 'Banca Asesor Interno' : 'Banca Personas'}
          </h1>
          <p className="text-red-100 text-sm leading-relaxed">
            {esAsesor 
              ? 'Accede al Core financiero integrado para evaluar, aprobar o rechazar solicitudes de crédito de la tabla dsolicitud en tiempo real.' 
              : 'Ingresa de forma 100% segura para simular tus préstamos, revisar tus cronogramas de amortización y gestionar tus solicitudes.'
            }
          </p>
          
          <div className="pt-4 flex gap-4 text-xs text-red-200">
            <div className="flex items-center gap-1.5 bg-black/10 px-3 py-1.5 rounded-lg border border-white/5">
              🛡️ Encriptación SSL
            </div>
            <div className="flex items-center gap-1.5 bg-black/10 px-3 py-1.5 rounded-lg border border-white/5">
              ⚡ Core Sincronizado
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

        {/* Elementos decorativos abstractos de fondo para darle modernidad */}
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-black/20 rounded-full blur-3xl"></div>
      </div>

      {/* LADO DERECHO: FORMULARIO FLOTANTE ESTILIZADO */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-[#F8FAFC]">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 max-w-md w-full space-y-6">
          
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-black text-gray-900">¡Hola de nuevo!</h3>
            <p className="text-xs text-gray-400 mt-1">Por seguridad, introduce tus credenciales de acceso.</p>
          </div>

          <form onSubmit={manejarEnvio} className="space-y-4">
            
            {/* Campo DNI */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider block">
                Número de Documento (DNI)
              </label>
              <div className="flex rounded-xl border border-gray-200 focus-within:border-red-500 shadow-sm transition overflow-hidden">
                <span className="bg-gray-50 text-gray-400 px-3.5 flex items-center justify-center font-bold text-xs border-r border-gray-100">
                  🪪
                </span>
                <input 
                  type="text" 
                  maxLength={8}
                  placeholder="Ingresa tus 8 dígitos" 
                  value={dni}
                  onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none"
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
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none"
                />
              </div>
            </div>

            {/* Botón de Ingreso con Animación */}
            <div className="pt-2">
              <button 
                type="submit"
                className={`w-full text-white font-bold py-3.5 rounded-xl text-sm uppercase tracking-wider shadow-md transition transform active:scale-95 cursor-pointer ${
                  esAsesor 
                    ? 'bg-slate-800 hover:bg-slate-900 shadow-slate-900/20' 
                    : 'bg-[#B91C1C] hover:bg-red-700 shadow-red-700/20'
                }`}
              >
                Ingresar Seguro →
              </button>
            </div>
          </form>

          {/* Enlaces de pie de formulario */}
          <div className="text-center pt-2 border-t border-gray-50">
            {esAsesor ? (
              <p className="text-[11px] text-amber-600 font-medium">
                ⚠️ Solo analistas autorizados por la Jefatura de Riesgos de Caja Ica.
              </p>
            ) : (
              <p className="text-xs text-gray-500">
                ¿No tienes cuenta? <span className="text-[#B91C1C] font-bold hover:underline cursor-pointer">Regístrate aquí</span>
              </p>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}

export default Login;