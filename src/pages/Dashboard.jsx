
import React, { useEffect, useState } from "react";

function Dashboard({ token, onLogout }) {
  const [datos, setDatos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const obtenerDashboard = async () => {
      setLoading(true);
      setError("");

      try {
        // Solicitud protegida mediante JWT
        const response = await fetch("/api/dashboard", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          },
          signal: controller.signal
        });

        if (response.status === 401 ||
            response.status === 403) {
          setError("Acceso denegado. Sesión no válida.");
          return;
        }

        if (!response.ok) {
          throw new Error("Error al cargar el Dashboard");
        }

        const resultado = await response.json();

        setDatos(resultado);

      } catch (err) {
        if (err.name !== "AbortError") {
          setError("No se pudo conectar con el servidor.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    if (token) {
      obtenerDashboard();
    } else {
      setLoading(false);
      setError("Se requiere autenticación.");
    }

    return () => controller.abort();
  }, [token]);

  return (
    <div className="dashboard-container">

      <header className="dashboard-header">
        <h1>Dashboard Zero Trust</h1>

        <button
          className="logout-button"
          onClick={onLogout}
        >
          Cerrar sesión
        </button>
      </header>

      <main className="dashboard-content">

        {loading && (
          <p>Verificando acceso al sistema...</p>
        )}

        {error && (
          <div className="error-message" role="alert">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && datos && (
          <section className="dashboard-card">

            <h2>Acceso autorizado</h2>

            <p>
              Bienvenido al panel de administración.
            </p>

            <p>
              {datos.message}
            </p>

            <h3>Información del usuario</h3>

            <p>
              Correo: {datos.user?.email || "No disponible"}
            </p>

            <h3>Controles del sistema</h3>

            <ul>
              <li>Autenticación JWT</li>
              <li>Validación de solicitudes</li>
              <li>Comunicación privada entre VPC</li>
              <li>Protección mediante AWS WAF</li>
              <li>Monitoreo con CloudWatch</li>
            </ul>

          </section>
        )}

      </main>

      <footer className="dashboard-footer">
        <p>
          Sistema Zero Trust - Acceso restringido
        </p>
      </footer>

    </div>
  );
}

export default Dashboard;
