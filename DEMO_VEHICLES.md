# 🚗 Vehículos de Demostración - TuCarrito.com

## 📋 Resumen

El sistema ahora incluye **8 vehículos de demostración pre-aprobados** que se cargan automáticamente la primera vez que se inicia la aplicación. Estos vehículos están disponibles inmediatamente para que los compradores puedan explorar el catálogo sin necesidad de esperar a que los vendedores publiquen vehículos.

---

## 🎯 Características

### ✅ Vehículos Pre-aprobados
- Todos los vehículos están en estado `for_sale` (aprobados por el administrador)
- Aparecen inmediatamente en el catálogo público
- Los compradores pueden verlos sin necesidad de registro

### 👤 Propietario
- Todos pertenecen al usuario demo: **Juan Vendedor** (`vendedor@test.com`)
- Esto permite que al iniciar sesión como vendedor, ya tengas vehículos para gestionar

### 📸 Imágenes
- Actualmente usan imágenes placeholder (placeholders SVG)
- Puedes reemplazarlas con imágenes reales fácilmente

---

## 🚙 Catálogo de Vehículos Demo

### 1. Toyota Corolla 2020
- **Precio:** $85,000,000
- **Kilometraje:** 45,000 km
- **Transmisión:** Automática
- **Combustible:** Gasolina
- **Descripción:** Sedán confiable, único dueño, equipamiento completo

### 2. Mazda CX-5 2021
- **Precio:** $120,000,000
- **Kilometraje:** 28,000 km
- **Transmisión:** Automática
- **Combustible:** Gasolina
- **Descripción:** SUV Grand Touring, tracción AWD, como nueva

### 3. Chevrolet Spark GT 2019
- **Precio:** $35,000,000
- **Kilometraje:** 62,000 km
- **Transmisión:** Manual
- **Combustible:** Gasolina
- **Descripción:** Ideal para la ciudad, económico, primer vehículo

### 4. Renault Duster 2022
- **Precio:** $95,000,000
- **Kilometraje:** 15,000 km
- **Transmisión:** Automática
- **Combustible:** Gasolina
- **Descripción:** 4x4 lista para aventuras, pocos kilómetros

### 5. Nissan Versa 2020
- **Precio:** $55,000,000
- **Kilometraje:** 38,000 km
- **Transmisión:** Automática
- **Combustible:** Gasolina
- **Descripción:** Sedán espacioso, bajo consumo

### 6. Kia Sportage 2021
- **Precio:** $110,000,000
- **Kilometraje:** 22,000 km
- **Transmisión:** Automática
- **Combustible:** Gasolina
- **Descripción:** SUV moderna, pantalla táctil 10", cámara 360°

### 7. Hyundai Accent 2019
- **Precio:** $48,000,000
- **Kilometraje:** 55,000 km
- **Transmisión:** Manual
- **Combustible:** Gasolina
- **Descripción:** Confiable y económico, mantenimientos en agencia

### 8. Volkswagen Tiguan 2022
- **Precio:** $145,000,000
- **Kilometraje:** 12,000 km
- **Transmisión:** Automática
- **Combustible:** Gasolina
- **Descripción:** SUV premium alemana, equipamiento completo

---

## 🔧 Funcionamiento Técnico

### Inicialización Automática

El método `initializeDemoVehicles()` en `localStorageService.ts`:

1. **Verifica** si ya existen vehículos en localStorage
2. Si **NO hay vehículos**, crea los 8 vehículos de demostración
3. Si **YA hay vehículos**, no hace nada (evita duplicados)

```typescript
initializeDemoVehicles(): void {
  const vehicles = this.getVehicles();
  
  // Si ya hay vehículos, no crear más
  if (vehicles.length > 0) {
    return;
  }
  
  // Crear vehículos demo...
}
```

### Momento de Ejecución

Los vehículos se crean **automáticamente** cuando:
- La aplicación se carga por primera vez
- El localStorage está vacío de vehículos
- Se ejecuta al mismo tiempo que se crean los usuarios de prueba

```typescript
// Al final de localStorageService.ts
localStorageService.initializeTestUsers();      // Crea usuarios
localStorageService.initializeDemoVehicles();   // Crea vehículos
```

---

## 🛠️ Personalización

### Cambiar las Imágenes

Para agregar imágenes reales a los vehículos:

1. **Opción 1: Imágenes Base64**
   ```typescript
   images: [
     'data:image/jpeg;base64,/9j/4AAQSkZJRg...',  // Tu imagen en base64
   ]
   ```

2. **Opción 2: URLs Externas**
   ```typescript
   images: [
     'https://ejemplo.com/toyota-corolla.jpg',
     'https://ejemplo.com/toyota-corolla-2.jpg',
   ]
   ```

3. **Opción 3: Imágenes de Unsplash (gratis)**
   ```typescript
   images: [
     'https://images.unsplash.com/photo-car-toyota',
   ]
   ```

### Agregar Más Vehículos

Para agregar más vehículos de demostración, edita el array `demoVehicles` en `initializeDemoVehicles()`:

```typescript
{
  id: 'demo-9',
  userId: 'test-seller-1',
  userEmail: 'vendedor@test.com',
  userName: 'Juan Vendedor',
  userPhone: '3001234567',
  brand: 'Honda',
  model: 'Civic',
  year: 2021,
  price: 95000000,
  description: 'Honda Civic Sport 2021...',
  mileage: 30000,
  transmission: 'automatic',
  fuelType: 'gasoline',
  images: demoImages,
  status: 'active',
  saleStatus: 'for_sale',
  validationMessage: 'Vehículo validado y aprobado para la venta',
  validationDate: new Date().toISOString(),
  createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date().toISOString()
}
```

### Modificar Datos Existentes

Para cambiar precios, marcas, modelos, etc.:

1. Abre `src/lib/localStorageService.ts`
2. Busca el método `initializeDemoVehicles()`
3. Edita los valores del array `demoVehicles`
4. Guarda el archivo
5. Para aplicar cambios:
   - Abre la consola del navegador (F12)
   - Ejecuta: `localStorage.removeItem('tucarrito_vehicles'); location.reload();`

---

## 🔄 Gestión de Vehículos Demo

### Ver Vehículos Actuales

En la consola del navegador (F12):

```javascript
// Ver todos los vehículos
console.log(JSON.parse(localStorage.getItem('tucarrito_vehicles')));

// Contar vehículos
JSON.parse(localStorage.getItem('tucarrito_vehicles')).length
```

### Eliminar Vehículos Demo

```javascript
// Eliminar todos los vehículos
localStorage.removeItem('tucarrito_vehicles');
location.reload();

// Se volverán a crear automáticamente
```

### Recrear Vehículos Demo

```javascript
// 1. Limpiar vehículos existentes
localStorage.removeItem('tucarrito_vehicles');

// 2. Recargar página (se recrearán automáticamente)
location.reload();
```

---

## 💡 Casos de Uso

### Para Compradores
- Pueden ver vehículos inmediatamente al entrar a la plataforma
- No necesitan esperar a que vendedores publiquen
- Pueden probar las funciones de búsqueda y filtrado

### Para Vendedores
- Al iniciar sesión como `vendedor@test.com`, ven los vehículos demo en "Mis Vehículos"
- Pueden editarlos, eliminarlos o cambiar su estado
- Sirven como ejemplo de cómo publicar vehículos

### Para Administradores
- Los vehículos demo ya están aprobados
- No aparecen en "Vehículos Pendientes"
- Pueden usarlos para demostrar el flujo de aprobación

### Para Demostraciones
- Ideal para presentaciones del proyecto
- El catálogo se ve poblado desde el inicio
- Muestra variedad de marcas, modelos y precios

---

## 📊 Datos Técnicos

### Estados de los Vehículos Demo

| Campo | Valor |
|-------|-------|
| `status` | `active` |
| `saleStatus` | `for_sale` |
| `validationMessage` | "Vehículo validado y aprobado para la venta" |
| `validationDate` | Fecha actual |
| `userId` | `test-seller-1` |
| `userEmail` | `vendedor@test.com` |

### Fechas de Creación

Los vehículos tienen fechas de creación variadas:
- 2 días atrás
- 3 días atrás
- 5 días atrás
- 6 días atrás
- 7 días atrás
- 10 días atrás
- 12 días atrás
- 15 días atrás

Esto hace que el catálogo se vea más realista y natural.

---

## ⚠️ Consideraciones Importantes

### LocalStorage
- Los vehículos se guardan en el navegador del usuario
- Se pierden si el usuario limpia el navegador
- No se sincronizan entre dispositivos

### Producción
- Para producción real, implementar backend con base de datos
- Usar Supabase, PostgreSQL, MongoDB, etc.
- Implementar carga de imágenes real (AWS S3, Cloudinary, etc.)

### Imágenes Placeholder
- Las imágenes actuales son SVG genéricos
- Para demo se ven bien pero no son fotos reales
- Considera usar API de imágenes gratuitas como Unsplash

---

## 🎨 Mejoras Futuras

1. **Imágenes Reales**
   - Integrar con API de imágenes de autos
   - Permitir múltiples fotos por vehículo
   - Galería de imágenes en el detalle

2. **Más Variedad**
   - Agregar vehículos eléctricos e híbridos
   - Incluir motos y camionetas
   - Diferentes rangos de precio

3. **Categorías**
   - Agrupar por tipo (Sedán, SUV, Hatchback, etc.)
   - Filtros por año, precio, marca
   - Ordenamiento personalizado

4. **Datos Realistas**
   - Descripciones más detalladas
   - Especificaciones técnicas completas
   - Historial de mantenimiento

---

**Última actualización:** 14 de octubre de 2025
