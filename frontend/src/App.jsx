import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import BusesPage from './pages/BusesPage';
import DriversPage from './pages/DriversPage';
import RoutesPage from './pages/RoutesPage';
import AssignmentsPage from './pages/AssignmentsPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-blue-700 text-white px-6 py-4 flex gap-6">
          <span className="font-bold">BusManager</span>
          <Link to="/buses">Autobuses</Link>
          <Link to="/drivers">Choferes</Link>
          <Link to="/routes">Rutas</Link>
          <Link to="/assignments">Asignaciones</Link>
        </nav>

        <main className="p-6">
          <Routes>
            <Route path="/buses" element={<BusesPage />} />
            <Route path="/drivers" element={<DriversPage />} />
            <Route path="/routes" element={<RoutesPage />} />
            <Route path="/assignments" element={<AssignmentsPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
