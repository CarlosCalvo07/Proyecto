
import React, { useState } from "react";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";

function App() {

  // Control de las pantallas
  const [pantalla, setPantalla] = useState("inicio");

  // JWT almacenado temporalmente en memoria
  const [token, setToken] = useState(null);

  // Login exitoso
  const iniciarSesion = (nuevoToken) => {
    if (
      typeof nuevoToken !== "string" ||
      nuevoToken.length === 0
    ) {
      return;
    }

    setToken(nuevoToken);
    setPantalla("dashboard");
  };

  // Cerrar sesión
  const cerrarSesion = () => {
    setToken(null);
    setPantalla("login");
  };

  // Mostrar formulario de Login
  if (pantalla === "login") {
    return (
      <Login onLogin={iniciarSesion} />
    );
  }

  // Mostrar Dashboard solo si existe un token
  if (pantalla === "dashboard" && token) {
    return (
      <Dashboard
        token={token}
        onLogout={cerrarSesion}
      />
    );
  }

  // Página principal
  return (
    <div className="app-container">

      <header className="app-header">
        <h1>Sistema de Seguridad Zero Trust</h1>

        <p>
          Plataforma web segura basada en
          autenticación y defensa en profundidad.
        </p>
      </header>

      <main className="main-content">

        <section className="welcome-card">

          <h2>Bienvenido al Sistema Zero Trust</h2>

          <p>
            Esta plataforma permite administrar
            el acceso a recursos mediante
            autenticación JWT.
          </p>

          <p>
            Para acceder al Dashboard protegido,
            debes iniciar sesión con tus
            credenciales.
          </p>

          <button
            className="access-button"
            onClick={() => setPantalla("login")}
          >
            Iniciar sesión
          </button>

        </section>

        <section className="security-card">

          <h2>Controles de Seguridad</h2>

          <ul>
            <li>Autenticación mediante JWT</li>
            <li>Validación de solicitudes</li>
            <li>Comunicación privada entre VPC</li>
            <li>Protección mediante AWS WAF</li>
            <li>Protección contra fuerza bruta</li>
            <li>Monitoreo mediante CloudWatch</li>
          </ul>

          <p>
            Estado del proyecto: En desarrollo.
          </p>

        </section>

      </main>

      <footer className="app-footer">
        <p>
          Proyecto Zero Trust | Ciberseguridad
        </p>
      </footer>

    </div>
  );
}

export default App;
