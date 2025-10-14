# 🔐 Credenciales de Prueba - TuCarrito.com

## Usuarios Pre-aprobados

Para facilitar el testing de la funcionalidad de publicación de vehículos, se han creado automáticamente dos usuarios con estado de validación APROBADO:

---

### 👤 Usuario Vendedor

**Email:** `vendedor@test.com`  
**Contraseña:** `123456`  
**Tipo:** Vendedor  
**Estado:** Aprobado ✅  
**Nombre:** Juan Vendedor  
**Teléfono:** 3001234567  
**ID:** 1234567890

**Funcionalidades disponibles:**
- ✅ Publicar vehículos
- ✅ Editar sus vehículos
- ✅ Eliminar sus vehículos
- ✅ Ver catálogo público
- ✅ Gestionar "Mis Vehículos"

---

### 🛒 Usuario Comprador

**Email:** `comprador@test.com`  
**Contraseña:** `123456`  
**Tipo:** Comprador  
**Estado:** Aprobado ✅  
**Nombre:** María Compradora  
**Teléfono:** 3009876543  
**ID:** 0987654321

**Funcionalidades disponibles:**
- ✅ Buscar vehículos
- ✅ Ver detalles de vehículos
- ✅ Filtrar búsquedas
- ✅ Ver información de contacto de vendedores

---

## 🚀 Cómo usar

### Iniciar la aplicación:
```bash
npm run dev
```

### Acceder:
1. Abrir http://localhost:5173/
2. Hacer clic en la pestaña "Iniciar Sesión"
3. Ingresar las credenciales de arriba
4. ¡Listo para usar!

---

## 📝 Notas Importantes

- ⚡ Los usuarios se crean **automáticamente** al cargar la aplicación
- 🔓 **NO requieren proceso de validación** (ya están aprobados)
- 💾 Los datos se almacenan en **localStorage**
- 🗑️ Para resetear todo: Limpiar caché del navegador o usar DevTools → Application → Clear Storage

---

## 🧪 Flujo de Testing Recomendado

### 1️⃣ Como Vendedor (vendedor@test.com):
1. Iniciar sesión
2. Click en "Publicar Vehículo"
3. Llenar formulario y subir imágenes
4. Publicar vehículo
5. Verificar en "Mis Vehículos"
6. Editar el vehículo
7. Verificar cambios guardados

### 2️⃣ Como Comprador (comprador@test.com):
1. Iniciar sesión
2. Click en "Buscar Vehículos"
3. Verificar vehículos publicados por vendedor
4. Usar filtros de búsqueda
5. Ver detalles del vehículo
6. Verificar información de contacto

### 3️⃣ Validaciones (cualquier usuario):
1. Intentar publicar sin campos obligatorios
2. Intentar subir imagen mayor a 2MB
3. Intentar subir imagen en formato incorrecto
4. Verificar mensajes de error

---

### 👤 Administrador 1

- **Nombre:** Carlos Administrador
- **Email:** `admin1@tucarrito.com`
- **Contraseña:** `Admin123!`
- **ID:** ADM-001
- **Teléfono:** 3101234567

---

### 👤 Administrador 2

- **Nombre:** Ana Administradora
- **Email:** `admin2@tucarrito.com`
- **Contraseña:** `Admin456!`
- **ID:** ADM-002
- **Teléfono:** 3109876543

---

## 🎯 Funcionalidades del Panel de Administración

### 1️⃣ Aprobación de Usuarios
Los usuarios que se registran en la plataforma quedan en estado **"Pendiente de Aprobación"** y no pueden iniciar sesión hasta que un administrador los apruebe.

**Proceso:**
- El administrador ve la lista de usuarios pendientes
- Revisa la información del usuario (nombre, email, teléfono, ID, tipo)
- Puede **Aprobar** ✅ o **Rechazar** ❌ el usuario
- Una vez aprobado, el usuario puede iniciar sesión normalmente

### 2️⃣ Validación de Vehículos
Cuando un vendedor registra un vehículo para venta, el vehículo entra en estado **"Pendiente de Validación"** y NO aparece en el catálogo público hasta que un administrador lo apruebe.

**Proceso:**
- El vendedor publica un vehículo (queda como "Borrador")
- El vendedor hace clic en "Registrar para Venta" (pasa a "Pendiente de Validación")
- El administrador ve el vehículo en la lista de pendientes
- El administrador revisa la información y fotos del vehículo
- Puede **Aprobar** ✅ o **Rechazar** ❌ con motivo
- Si se aprueba, el vehículo pasa a estado "En Venta" y aparece en el catálogo público
- Si se rechaza, el vendedor recibe el motivo del rechazo

### 3️⃣ Estadísticas del Dashboard
El panel de administración muestra:
- 📊 Número de usuarios pendientes de aprobación
- 🚗 Número de vehículos pendientes de validación
- 👥 Total de usuarios en el sistema
- 🚙 Total de vehículos publicados

---
---


---


