import React, { useState } from 'react';
import Home from './components/cliente/Home';
import Login from './components/cliente/Login';
import Dashboard from './components/cliente/Dashboard';
import DashboardAsesor from './components/cliente/DashboardAsesor'; // Nueva pantalla

function App() {
  const [pantallaActual, setPantallaActual] = useState('home');
  const [rolActual, setRolActual] = useState('cliente'); // 'cliente' o 'asesor'
  const [usuario, setUsuario] = useState(null);

  // Lista global de préstamos compartida para que el asesor los vea y el cliente los reciba
  const [prestamosGlobales, setPrestamosGlobales] = useState([]);

  const irALoginCliente = () => {
    setRolActual('cliente');
    setPantallaActual('login');
  };

  const irALoginAsesor = () => {
    setRolActual('asesor');
    setPantallaActual('login');
  };

  const manejarLogin = (datosUsuario) => {
    setUsuario(datosUsuario);
    if (rolActual === 'asesor') {
      setPantallaActual('dashboard-asesor');
    } else {
      setPantallaActual('dashboard');
    }
  };

  const manejarCerrarSesion = () => {
    setUsuario(null);
    setPantallaActual('home');
  };

  return (
    <div className="font-sans text-gray-800">
      {pantallaActual === 'home' && (
        <Home 
          irALogin={irALoginCliente} 
          irALoginAsesor={irALoginAsesor} 
        />
      )}
      
      {pantallaActual === 'login' && (
        <Login 
          rol={rolActual}
          irAHome={() => setPantallaActual('home')} 
          alIngresar={manejarLogin} 
        />
      )}
      
      {pantallaActual === 'dashboard' && (
        <Dashboard 
          usuario={usuario} 
          irAHome={manejarCerrarSesion} 
          prestamosGlobales={prestamosGlobales}
          setPrestamosGlobales={setPrestamosGlobales}
        />
      )}

      {pantallaActual === 'dashboard-asesor' && (
        <DashboardAsesor 
          usuario={usuario} 
          irAHome={manejarCerrarSesion} 
          prestamosGlobales={prestamosGlobales}
          setPrestamosGlobales={setPrestamosGlobales}
        />
      )}
    </div>
  );
}

export default App;