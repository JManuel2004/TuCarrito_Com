# 🚗 TuCarrito.com - Plataforma de Compra y Venta de Vehículos

Plataforma web desarrollada con React, TypeScript y Vite para la compra y venta de vehículos usados. Incluye sistema de autenticación, roles de usuario, validación por administradores y catálogo de vehículos.

![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue)
![Vite](https://img.shields.io/badge/Vite-5.4.2-purple)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.1-cyan)

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [Arquitectura](#-arquitectura)
- [Credenciales de Prueba](#-credenciales-de-prueba)
- [Vehículos de Demostración](#-vehículos-de-demostración)
- [Despliegue](#-despliegue)

---

## ✨ Características

### 🔐 Sistema de Autenticación
- Registro de usuarios (vendedores y compradores)
- Validación de identidad por administradores
- Login seguro con roles diferenciados
- Gestión de sesión con localStorage

### 👥 Roles de Usuario

#### Administradores
- Aprobar/rechazar registro de nuevos usuarios
- Validar vehículos antes de publicarlos
- Panel de administración completo
- Estadísticas del sistema

#### Vendedores
- Publicar vehículos para la venta
- Gestionar sus publicaciones
- Editar y eliminar vehículos
- Ver estado de validación

#### Compradores
- Explorar catálogo de vehículos
- Buscar y filtrar vehículos
- Ver detalles completos
- Contactar vendedores

### 🚙 Gestión de Vehículos

**Flujo de Publicación:**
1. Vendedor publica vehículo → Estado: **Borrador**
2. Vendedor solicita registro para venta → Estado: **Pendiente de Validación**
3. Administrador valida → Estado: **En Venta** (visible públicamente)

**Características:**
- Carga de imágenes
- Información detallada (marca, modelo, año, precio, kilometraje, etc.)
- Estados de validación
- Búsqueda y filtros

### 📊 Panel de Administración
- Vista de usuarios pendientes de aprobación
- Lista de vehículos pendientes de validación
- Estadísticas en tiempo real
- Aprobación/rechazo con un clic

---

## 🛠️ Tecnologías

### Frontend
- **React 18.3.1** - Librería de UI
- **TypeScript 5.5.3** - Tipado estático
- **Vite 5.4.2** - Build tool y dev server
- **TailwindCSS 3.4.1** - Framework de CSS
- **Lucide React 0.344.0** - Iconos

### Backend (Simulado)
- **LocalStorage** - Persistencia de datos en el navegador
- Simulación de APIs con delays asíncronos

### Herramientas de Desarrollo
- ESLint - Linting
- PostCSS - Procesamiento de CSS
- TypeScript Compiler - Type checking

---

## 📦 Instalación

### Requisitos Previos
- Node.js 18 o superior
- npm o yarn

### Pasos

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/Computacion-2-2025/proyecto-final-thebeans.git
   cd proyecto-final-thebeans
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Iniciar servidor de desarrollo**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:5173
   ```

### Comandos Disponibles

```bash
npm run dev        # Inicia el servidor de desarrollo
npm run build      # Compila para producción
npm run preview    # Vista previa de la build
npm run lint       # Ejecuta ESLint
npm run typecheck  # Verifica tipos de TypeScript
```

---

## 🎮 Uso

### Primera Vez

Al iniciar la aplicación por primera vez:

1. **Usuarios pre-configurados** se crean automáticamente:
   - 2 Administradores
   - 1 Vendedor demo
   - 1 Comprador demo

2. **Vehículos de demostración** se cargan automáticamente:
   - 8 vehículos variados
   - Ya aprobados y visibles en el catálogo
   - Pertenecen al vendedor demo

### Flujos Principales

#### Como Comprador
1. Iniciar sesión con `comprador@test.com` / `123456`
2. Explorar catálogo de vehículos
3. Ver detalles de vehículos
4. Usar filtros de búsqueda

#### Como Vendedor
1. Iniciar sesión con `vendedor@test.com` / `123456`
2. Ir a "Publicar Vehículo"
3. Llenar formulario con datos del vehículo
4. Subir imágenes
5. Publicar (estado: Borrador)
6. En "Mis Vehículos", hacer clic en "Registrar para Venta"
7. Esperar aprobación del administrador

#### Como Administrador
1. Iniciar sesión con `admin1@tucarrito.com` / `Admin123!`
2. Ver usuarios pendientes de aprobación
3. Aprobar/rechazar usuarios
4. Ver vehículos pendientes de validación
5. Aprobar/rechazar vehículos

#### Registro de Nuevo Usuario
1. Clic en "Registrarse"
2. Llenar formulario completo
3. Seleccionar tipo (Vendedor, Comprador, o Ambos)
4. Enviar registro
5. Esperar aprobación del administrador
6. Iniciar sesión una vez aprobado

---

## 🏗️ Arquitectura

### Estructura del Proyecto

```
proyecto-final-thebeans/
├── src/
│   ├── components/         # Componentes React
│   │   ├── AdminDashboard.tsx
│   │   ├── SimpleDashboard.tsx
│   │   ├── SimpleLoginForm.tsx
│   │   ├── SimpleRegisterForm.tsx
│   │   ├── VehicleForm.tsx
│   │   └── VehicleList.tsx
│   ├── contexts/           # Context API
│   │   └── SimpleAuthContext.tsx
│   ├── lib/                # Utilidades y servicios
│   │   └── localStorageService.ts
│   ├── App.tsx             # Componente principal
│   ├── main.tsx            # Punto de entrada
│   └── index.css           # Estilos globales
├── public/                 # Archivos estáticos
├── ADMIN_CREDENTIALS.md    # Credenciales de admin
├── DEMO_VEHICLES.md        # Documentación de vehículos demo
├── TEST_CREDENTIALS.md     # Credenciales de prueba
└── package.json
```

### Componentes Principales

#### `localStorageService.ts`
Servicio central que maneja:
- Autenticación de usuarios
- CRUD de vehículos
- Validación y aprobación
- Persistencia en localStorage

#### `SimpleAuthContext.tsx`
Context de React que provee:
- Estado de autenticación
- Usuario actual
- Funciones de login/logout

#### `AdminDashboard.tsx`
Panel de administración con:
- Estadísticas del sistema
- Lista de usuarios pendientes
- Lista de vehículos pendientes
- Acciones de aprobación/rechazo

---

## 🔑 Credenciales de Prueba

### Administradores

**Admin 1:**
- Email: `admin1@tucarrito.com`
- Contraseña: `Admin123!`

**Admin 2:**
- Email: `admin2@tucarrito.com`
- Contraseña: `Admin456!`

### Usuarios Pre-aprobados

**Vendedor:**
- Email: `vendedor@test.com`
- Contraseña: `123456`

**Comprador:**
- Email: `comprador@test.com`
- Contraseña: `123456`

> **Nota:** Para más detalles, ver `ADMIN_CREDENTIALS.md` y `TEST_CREDENTIALS.md`

---

## 🚙 Vehículos de Demostración

El sistema incluye **8 vehículos pre-aprobados** que aparecen automáticamente:

1. **Toyota Corolla 2020** - $85,000,000
2. **Mazda CX-5 2021** - $120,000,000
3. **Chevrolet Spark GT 2019** - $35,000,000
4. **Renault Duster 2022** - $95,000,000
5. **Nissan Versa 2020** - $55,000,000
6. **Kia Sportage 2021** - $110,000,000
7. **Hyundai Accent 2019** - $48,000,000
8. **Volkswagen Tiguan 2022** - $145,000,000

**Características:**
- Ya están aprobados y visibles en el catálogo
- Pertenecen al vendedor demo
- Se crean automáticamente la primera vez
- Tienen descripciones detalladas

> **Nota:** Para personalizar, ver `DEMO_VEHICLES.md`

---

## 🚀 Despliegue

### Opción 1: Vercel (Recomendada)

1. Hacer push del código a GitHub
2. Ir a [vercel.com](https://vercel.com)
3. Importar el repositorio
4. Deploy automático ✅

### Opción 2: Netlify

1. Ir a [netlify.com](https://netlify.com)
2. Conectar repositorio de GitHub
3. Build command: `npm run build`
4. Publish directory: `dist`

### Opción 3: GitHub Pages

```bash
npm install --save-dev gh-pages
npm run deploy
```

> **Nota:** Para guía completa de despliegue, ver `DEPLOYMENT_GUIDE.md`

---

## ⚠️ Limitaciones Actuales

### LocalStorage
- Los datos se guardan solo en el navegador
- Se pierden si el usuario limpia el caché
- No hay sincronización entre dispositivos
- **No usar en producción real**

### Sin Backend Real
- No hay base de datos
- No hay API REST
- No hay autenticación real con JWT
- No hay carga de imágenes a servidor

### Imágenes
- Actualmente usa placeholders SVG
- No hay carga real de archivos al servidor
- Imágenes en base64 ocupan mucho espacio

---

## 🔮 Mejoras Futuras

### Fase 1: Backend Real
- [ ] Migrar a Supabase o Firebase
- [ ] Implementar API REST con Node.js
- [ ] Base de datos PostgreSQL/MySQL
- [ ] Autenticación JWT

### Fase 2: Funcionalidades
- [ ] Chat entre compradores y vendedores
- [ ] Sistema de favoritos
- [ ] Notificaciones por email
- [ ] Historial de vehículos
- [ ] Comparador de vehículos

### Fase 3: UX/UI
- [ ] Modo oscuro
- [ ] Responsive mejorado
- [ ] Animaciones avanzadas
- [ ] PWA (Progressive Web App)

### Fase 4: Avanzado
- [ ] Sistema de pagos
- [ ] Verificación de documentos
- [ ] Geolocalización
- [ ] Recomendaciones por IA
- [ ] Valuación automática

---

## 🐛 Solución de Problemas

### Las credenciales de admin no funcionan

```javascript
// En la consola del navegador (F12)
localStorage.clear();
location.reload();
```

### No aparecen vehículos en el catálogo

```javascript
// En la consola del navegador
localStorage.removeItem('tucarrito_vehicles');
location.reload();
```







