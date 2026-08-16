import { useEffect, useState } from 'react';
import api from '../services/api';

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [buses, setBuses] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [form, setForm] = useState({ busId: '', driverId: '', routeId: '', date: '' });
  const [error, setError] = useState('');

  const loadAll = async () => {
    const [assignmentsRes, busesRes, driversRes, routesRes] = await Promise.all([
      api.get('/assignments'),
      api.get('/buses'),
      api.get('/drivers'),
      api.get('/routes'),
    ]);
    setAssignments(assignmentsRes.data);
    setBuses(busesRes.data);
    setDrivers(driversRes.data);
    setRoutes(routesRes.data);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/assignments', form);
      setForm({ busId: '', driverId: '', routeId: '', date: '' });
      loadAll();
    } catch (err) {
      // RF08: aquí llega el error de conflicto de horario si el backend lo detecta
      setError(err.response?.data?.message || 'Error al crear la asignación.');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Asignaciones</h1>

      <form onSubmit={handleSubmit} className="flex gap-3 mb-6 flex-wrap">
        <select name="busId" value={form.busId} onChange={handleChange} className="border p-2 rounded" required>
          <option value="">Selecciona autobús</option>
          {buses.map((b) => (
            <option key={b.id} value={b.id}>{b.brand} {b.model} - {b.plate}</option>
          ))}
        </select>

        <select name="driverId" value={form.driverId} onChange={handleChange} className="border p-2 rounded" required>
          <option value="">Selecciona chofer</option>
          {drivers.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>

        <select name="routeId" value={form.routeId} onChange={handleChange} className="border p-2 rounded" required>
          <option value="">Selecciona ruta</option>
          {routes.map((r) => (
            <option key={r.id} value={r.id}>{r.origin} → {r.destination} ({r.startTime}-{r.endTime})</option>
          ))}
        </select>

        <input name="date" value={form.date} onChange={handleChange} type="date" className="border p-2 rounded" required />

        <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded">Asignar</button>
      </form>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <table className="w-full bg-white border rounded">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Fecha</th>
            <th className="p-2">Autobús</th>
            <th className="p-2">Chofer</th>
            <th className="p-2">Ruta</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((a) => (
            <tr key={a.id} className="border-t">
              <td className="p-2">{a.date}</td>
              <td className="p-2">{a.Bus ? `${a.Bus.brand} ${a.Bus.model} - ${a.Bus.plate}` : a.busId}</td>
              <td className="p-2">{a.Driver ? a.Driver.name : a.driverId}</td>
              <td className="p-2">{a.Route ? `${a.Route.origin} → ${a.Route.destination}` : a.routeId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
