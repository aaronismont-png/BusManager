import { useEffect, useState } from 'react';
import api from '../services/api';

export default function DriversPage() {
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    api.get('/drivers').then((res) => setDrivers(res.data));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Gestión de Choferes</h1>
      {/* TODO: formulario de registro siguiendo el patrón de BusesPage.jsx */}
      <ul>
        {drivers.map((d) => (
          <li key={d.id}>{d.name} - {d.license}</li>
        ))}
      </ul>
    </div>
  );
}
