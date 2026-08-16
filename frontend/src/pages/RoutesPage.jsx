import { useEffect, useState } from 'react';
import api from '../services/api';

export default function RoutesPage() {
  const [routes, setRoutes] = useState([]);
  const [form, setForm] = useState({ origin: '', destination: '', stops: '', startTime: '', endTime: '' });
  const [error, setError] = useState('');

  const loadRoutes = async () => {
    const res = await api.get('/routes');
    setRoutes(res.data);
  };

  useEffect(() => {
    loadRoutes();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/routes', form);
      setForm({ origin: '', destination: '', stops: '', startTime: '', endTime: '' });
      loadRoutes();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar la ruta.');
    }
  };

  const handleDelete = async (id) => {
    await api.delete(`/routes/${id}`);
    loadRoutes();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Gestión de Rutas</h1>

      <form onSubmit={handleSubmit} className="flex gap-3 mb-6 flex-wrap">
        <input name="origin" value={form.origin} onChange={handleChange} placeholder="Origen" className="border p-2 rounded" required />
        <input name="destination" value={form.destination} onChange={handleChange} placeholder="Destino" className="border p-2 rounded" required />
        <input name="stops" value={form.stops} onChange={handleChange} placeholder="Paradas (separadas por coma)" className="border p-2 rounded" />
        <input name="startTime" value={form.startTime} onChange={handleChange} type="time" className="border p-2 rounded" required />
        <input name="endTime" value={form.endTime} onChange={handleChange} type="time" className="border p-2 rounded" required />
        <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded">Registrar</button>
      </form>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <table className="w-full bg-white border rounded">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Origen</th>
            <th className="p-2">Destino</th>
            <th className="p-2">Paradas</th>
            <th className="p-2">Horario</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((route) => (
            <tr key={route.id} className="border-t">
              <td className="p-2">{route.origin}</td>
              <td className="p-2">{route.destination}</td>
              <td className="p-2">{route.stops}</td>
              <td className="p-2">{route.startTime} - {route.endTime}</td>
              <td className="p-2">
                <button onClick={() => handleDelete(route.id)} className="text-red-600 underline">
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
