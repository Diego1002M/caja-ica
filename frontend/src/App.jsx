import React, { useState } from 'react';
import Home from './components/cliente/Home';
import Login from './components/cliente/Login';
import Dashboard from './components/cliente/Dashboard';

function App() {
  const [pantallaActual, setPantallaActual] = useState('home');
  // Guardamos los datos del usuario logueado
  const [usuario, setUsuario] = useState(null);

  const manejarLogin = (datosUsuario) => {
    setUsuario(datosUsuario);
    setPantallaActual('dashboard');
  };

  const manejarCerrarSesion = () => {
    setUsuario(null);
    setPantallaActual('home');
  };

  return (
    <div className="font-sans text-gray-800">
      {pantallaActual === 'home' && (
        <Home irALogin={() => setPantallaActual('login')} />
      )}
      
      {pantallaActual === 'login' && (
        <Login 
          irAHome={() => setPantallaActual('home')} 
          alIngresar={manejarLogin} 
        />
      )}
      
      {pantallaActual === 'dashboard' && (
        <Dashboard 
          usuario={usuario} 
          irAHome={manejarCerrarSesion} 
        />
      )}
    </div>
  );
}

export default App;