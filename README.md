# BusManager

Sistema web para la gestión centralizada de una flota de autobuses: unidades, choferes, rutas y asignaciones.

## Tecnologías
- Frontend: React + Tailwind CSS
- Backend: Node.js + Express
- Base de datos: MySQL
- Control de versiones: Git + GitHub
- Gestión ágil: Jira

## Estructura del repositorio
```
busmanager/
├── backend/       -> API REST (Node.js + Express + MySQL)
├── frontend/      -> Interfaz web (React + Tailwind)
└── README.md
```

## Primer Release - Módulos
- Gestión de autobuses (CRUD)
- Gestión de choferes (CRUD)
- Gestión de rutas (CRUD)
- Asignación de chofer + autobús a ruta (con validación de conflictos de horario)
- Listado y filtros básicos

## Cómo correr el proyecto

### Backend
```
cd backend
npm install
cp .env.example .env   # completar variables de entorno
npm run dev
```

### Frontend
```
cd frontend
npm install
npm start
```
