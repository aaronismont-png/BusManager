import { useEffect, useState } from 'react';
import api from '../services/api';

export default function RoutesPage() {
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    api.get('/routes').then((res) => setRoutes(res.data));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Gestión de Rutas</h1>
      {/* TODO: formulario de registro siguiendo el patrón de BusesPage.jsx */}
      <ul>
        {routes.map((r) => (
          <li key={r.id}>{r.origin} - {r.destination}</li>
        ))}
      </ul>
    </div>
  );
}
