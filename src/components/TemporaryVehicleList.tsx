import { useState, useEffect } from 'react';
import { localStorageService, TemporaryVehicle } from '../lib/localStorageService';
import { ArrowLeft, Car, Calendar, Gauge, Fuel, Cog, Phone, Mail, User, Edit2, Trash2, AlertCircle } from 'lucide-react';

interface TemporaryVehicleListProps {
  onBack: () => void;
  onEditVehicle: (vehicle: TemporaryVehicle) => void;
}

export default function TemporaryVehicleList({ onBack, onEditVehicle }: TemporaryVehicleListProps) {
  const [vehicles, setVehicles] = useState<TemporaryVehicle[]>([]);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = () => {
    const tempVehicles = localStorageService.getSessionTemporaryVehicles();
    setVehicles(tempVehicles);
  };

  const handleDelete = async (vehicleId: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este registro temporal?')) {
      return;
    }

    const result = await localStorageService.deleteTemporaryVehicle(vehicleId);
    if (result.success) {
      loadVehicles();
      alert('Registro temporal eliminado exitosamente');
    } else {
      alert('Error al eliminar el registro');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getTransmissionLabel = (transmission: string) => {
    return transmission === 'manual' ? 'Manual' : 'Automática';
  };

  const getFuelTypeLabel = (fuelType: string) => {
    const labels: Record<string, string> = {
      gasoline: 'Gasolina',
      diesel: 'Diésel',
      electric: 'Eléctrico',
      hybrid: 'Híbrido'
    };
    return labels[fuelType] || fuelType;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Título */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
              <Car className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Mis Registros Temporales
              </h1>
              <p className="text-slate-600">
                {vehicles.length} vehículo{vehicles.length !== 1 ? 's' : ''} registrado{vehicles.length !== 1 ? 's' : ''} temporalmente
              </p>
            </div>
          </div>

          {/* Info sobre registros temporales */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">¿Qué son los registros temporales?</p>
                <p>
                  Los registros temporales te permiten listar vehículos sin necesidad de crear una cuenta. 
                  Tus datos se guardan localmente en tu navegador. Para publicar de forma permanente y 
                  acceder desde otros dispositivos, <strong>crea una cuenta</strong> en la plataforma.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de vehículos */}
        {vehicles.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <Car className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No tienes registros temporales
            </h3>
            <p className="text-slate-600 mb-4">
              Comienza registrando tu primer vehículo temporalmente
            </p>
            <button
              onClick={onBack}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Registrar Vehículo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Imagen principal */}
                <div className="relative h-48 bg-slate-100">
                  {vehicle.images.length > 0 ? (
                    <img
                      src={vehicle.images[0]}
                      alt={`${vehicle.brand} ${vehicle.model}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Car className="w-16 h-16 text-slate-300" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 px-3 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full">
                    Temporal
                  </div>
                </div>

                {/* Información */}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {vehicle.brand} {vehicle.model}
                  </h3>
                  
                  <p className="text-2xl font-bold text-blue-600 mb-4">
                    {formatPrice(vehicle.price)}
                  </p>

                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Calendar className="w-4 h-4" />
                      <span>{vehicle.year}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Gauge className="w-4 h-4" />
                      <span>{vehicle.mileage.toLocaleString()} km</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Cog className="w-4 h-4" />
                      <span>{getTransmissionLabel(vehicle.transmission)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Fuel className="w-4 h-4" />
                      <span>{getFuelTypeLabel(vehicle.fuelType)}</span>
                    </div>
                  </div>

                  {vehicle.description && (
                    <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                      {vehicle.description}
                    </p>
                  )}

                  {/* Información de contacto */}
                  <div className="mb-4 p-3 bg-slate-50 rounded-lg text-xs space-y-1">
                    <div className="flex items-center gap-2 text-slate-700">
                      <User className="w-3 h-3" />
                      <span>{vehicle.contactName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <Mail className="w-3 h-3" />
                      <span className="truncate">{vehicle.contactEmail}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <Phone className="w-3 h-3" />
                      <span>{vehicle.contactPhone}</span>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEditVehicle(vehicle)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <Edit2 className="w-4 h-4" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(vehicle.id)}
                      className="flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer con info adicional */}
        {vehicles.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">
              💡 Consejos
            </h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>• Los registros temporales se guardan en tu navegador y no son visibles para otros usuarios</li>
              <li>• Si limpias el caché de tu navegador, perderás estos registros</li>
              <li>• Para publicar de forma permanente, crea una cuenta y podrás transferir estos vehículos</li>
              <li>• Puedes editar o eliminar estos registros en cualquier momento</li>
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
