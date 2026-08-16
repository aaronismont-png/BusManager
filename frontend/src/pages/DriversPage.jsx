import { useEffect, useState } from 'react';
import api from '../services/api';

export default function DriversPage() {
  const [drivers, setDrivers] = useState([]);
  const [form, setForm] = useState({ name: '', license: '' });
  const [error, setError] = useState('');

  const loadDrivers = async () => {
    const res = await api.get('/drivers');
    setDrivers(res.data);
  };

  useEffect(() => {
    loadDrivers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/drivers', form);
      setForm({ name: '', license: '' });
      loadDrivers();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar el chofer.');
    }
  };

  const toggleAvailability = async (driver) => {
    await api.put(`/drivers/${driver.id}`, {
      name: driver.name,
      available: !driver.available,
    });
    loadDrivers();
  };

  const handleDelete = async (id) => {
    await api.delete(`/drivers/${id}`);
    loadDrivers();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Gestión de Choferes</h1>

      <form onSubmit={handleSubmit} className="flex gap-3 mb-6 flex-wrap">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Nombre" className="border p-2 rounded" required />
        <input name="license" value={form.license} onChange={handleChange} placeholder="Número de licencia" className="border p-2 rounded" required />
        <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded">Registrar</button>
      </form>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <table className="w-full bg-white border rounded">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Nombre</th>
            <th className="p-2">Licencia</th>
            <th className="p-2">Disponibilidad</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map((driver) => (
            <tr key={driver.id} className="border-t">
              <td className="p-2">{driver.name}</td>
              <td className="p-2">{driver.license}</td>
              <td className="p-2">
                <span className={driver.available ? 'text-green-600' : 'text-red-600'}>
                  {driver.available ? 'Disponible' : 'No disponible'}
                </span>
              </td>
              <td className="p-2 flex gap-2">
                <button onClick={() => toggleAvailability(driver)} className="text-blue-700 underline">
                  Cambiar estado
                </button>
                <button onClick={() => handleDelete(driver.id)} className="text-red-600 underline">
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
