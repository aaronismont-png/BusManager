import { useEffect, useState } from 'react';
import api from '../services/api';

export default function BusesPage() {
  const [buses, setBuses] = useState([]);
  const [form, setForm] = useState({ brand: '', model: '', plate: '', capacity: '' });
  const [error, setError] = useState('');

  const loadBuses = async () => {
    const res = await api.get('/buses');
    setBuses(res.data);
  };

  useEffect(() => {
    loadBuses();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/buses', form);
      setForm({ brand: '', model: '', plate: '', capacity: '' });
      loadBuses();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar el autobús.');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Gestión de Autobuses</h1>

      <form onSubmit={handleSubmit} className="flex gap-3 mb-6 flex-wrap">
        <input name="brand" value={form.brand} onChange={handleChange} placeholder="Marca" className="border p-2 rounded" required />
        <input name="model" value={form.model} onChange={handleChange} placeholder="Modelo" className="border p-2 rounded" required />
        <input name="plate" value={form.plate} onChange={handleChange} placeholder="Placa" className="border p-2 rounded" required />
        <input name="capacity" value={form.capacity} onChange={handleChange} placeholder="Capacidad" type="number" className="border p-2 rounded" required />
        <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded">Registrar</button>
      </form>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <table className="w-full bg-white border rounded">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Marca</th>
            <th className="p-2">Modelo</th>
            <th className="p-2">Placa</th>
            <th className="p-2">Capacidad</th>
            <th className="p-2">Estado</th>
          </tr>
        </thead>
        <tbody>
          {buses.map((bus) => (
            <tr key={bus.id} className="border-t">
              <td className="p-2">{bus.brand}</td>
              <td className="p-2">{bus.model}</td>
              <td className="p-2">{bus.plate}</td>
              <td className="p-2">{bus.capacity}</td>
              <td className="p-2">{bus.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
