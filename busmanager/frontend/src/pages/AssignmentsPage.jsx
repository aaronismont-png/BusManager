import { useEffect, useState } from 'react';
import api from '../services/api';

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    api.get('/assignments').then((res) => setAssignments(res.data));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Asignaciones</h1>
      {/* TODO: formulario de asignación (chofer + autobús + ruta) */}
      <ul>
        {assignments.map((a) => (
          <li key={a.id}>Asignación #{a.id}</li>
        ))}
      </ul>
    </div>
  );
}
