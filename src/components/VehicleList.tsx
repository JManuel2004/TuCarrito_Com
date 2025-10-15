import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { localStorageService, Vehicle } from '../lib/localStorageService';
import { ArrowLeft, Search, Filter, Car, Calendar, Gauge, Fuel, Cog, Phone, Mail, Edit2, Trash2, Eye, CheckCircle } from 'lucide-react';

interface VehicleListProps {
  onBack: () => void;
  onEditVehicle: (vehicle: Vehicle) => void;
  showMyVehicles?: boolean;
}

export default function VehicleList({ onBack, onEditVehicle, showMyVehicles = false }: VehicleListProps) {
  const { profile } = useAuth();
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState({
    brand: '',
    model: '',
    minYear: '',
    maxYear: '',
    minPrice: '',
    maxPrice: '',
    transmission: '',
    fuelType: ''
  });

  useEffect(() => {
    loadVehicles();
  }, [showMyVehicles, profile]);

  const loadVehicles = () => {
    if (showMyVehicles && profile) {
      const myVehicles = localStorageService.getUserVehicles(profile.id);
      setFilteredVehicles(myVehicles);
    } else {
      // En el catálogo público, solo mostrar vehículos aprobados para venta
      const allVehicles = localStorageService.getVehiclesForSale();
      setFilteredVehicles(allVehicles);
    }
  };

  const applyFilters = () => {
    const filtered = localStorageService.searchVehicles({
      brand: filters.brand,
      model: filters.model,
      minYear: filters.minYear ? parseInt(filters.minYear) : undefined,
      maxYear: filters.maxYear ? parseInt(filters.maxYear) : undefined,
      minPrice: filters.minPrice ? parseFloat(filters.minPrice) : undefined,
      maxPrice: filters.maxPrice ? parseFloat(filters.maxPrice) : undefined,
      transmission: filters.transmission,
      fuelType: filters.fuelType
    });

    if (showMyVehicles && profile) {
      setFilteredVehicles(filtered.filter(v => v.userId === profile.id));
    } else {
      setFilteredVehicles(filtered);
    }
  };

  const clearFilters = () => {
    setFilters({
      brand: '',
      model: '',
      minYear: '',
      maxYear: '',
      minPrice: '',
      maxPrice: '',
      transmission: '',
      fuelType: ''
    });
    loadVehicles();
  };

  const handleDelete = async (vehicleId: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este vehículo?')) {
      return;
    }

    const result = await localStorageService.deleteVehicle(vehicleId);
    if (result.success) {
      loadVehicles();
      setSelectedVehicle(null);
      alert('Vehículo eliminado exitosamente');
    } else {
      alert('Error al eliminar el vehículo');
    }
  };

  const handleRegisterForSale = async (vehicleId: string) => {
    if (!window.confirm('¿Deseas registrar este vehículo para la venta? Se validarán los datos antes de publicarlo.')) {
      return;
    }

    const result = await localStorageService.registerVehicleForSale(vehicleId);
    if (result.success) {
      loadVehicles();
      alert(result.message);
    } else {
      alert(result.message);
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
        {/* Título y filtros */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
                <Car className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  {showMyVehicles ? 'Mis Vehículos Publicados' : 'Catálogo de Vehículos'}
                </h1>
                <p className="text-slate-600">
                  {filteredVehicles.length} vehículo{filteredVehicles.length !== 1 ? 's' : ''} {filteredVehicles.length !== 1 ? 'encontrados' : 'encontrado'}
                </p>
              </div>
            </div>

            {!showMyVehicles && (
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Filter className="w-5 h-5" />
                Filtros
              </button>
            )}
          </div>

          {/* Panel de filtros */}
          {showFilters && !showMyVehicles && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Filtrar Búsqueda</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Marca</label>
                  <input
                    type="text"
                    value={filters.brand}
                    onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: Toyota"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Modelo</label>
                  <input
                    type="text"
                    value={filters.model}
                    onChange={(e) => setFilters({ ...filters, model: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: Corolla"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Transmisión</label>
                  <select
                    value={filters.transmission}
                    onChange={(e) => setFilters({ ...filters, transmission: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Todas</option>
                    <option value="manual">Manual</option>
                    <option value="automatic">Automática</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Año Mínimo</label>
                  <input
                    type="number"
                    value={filters.minYear}
                    onChange={(e) => setFilters({ ...filters, minYear: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="2015"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Año Máximo</label>
                  <input
                    type="number"
                    value={filters.maxYear}
                    onChange={(e) => setFilters({ ...filters, maxYear: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="2024"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Combustible</label>
                  <select
                    value={filters.fuelType}
                    onChange={(e) => setFilters({ ...filters, fuelType: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Todos</option>
                    <option value="gasoline">Gasolina</option>
                    <option value="diesel">Diésel</option>
                    <option value="electric">Eléctrico</option>
                    <option value="hybrid">Híbrido</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Precio Mínimo</label>
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="10000000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Precio Máximo</label>
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="50000000"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={applyFilters}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Search className="w-4 h-4" />
                  Aplicar Filtros
                </button>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Limpiar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Lista de vehículos */}
        {filteredVehicles.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <Car className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No hay vehículos disponibles
            </h3>
            <p className="text-slate-600">
              {showMyVehicles 
                ? 'Aún no has publicado ningún vehículo'
                : 'No se encontraron vehículos con los filtros aplicados'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => (
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
                  
                  {/* Badge de estado de venta */}
                  {showMyVehicles && (
                    <div className="absolute top-2 right-2">
                      {vehicle.saleStatus === 'draft' && (
                        <span className="px-3 py-1 bg-gray-500 text-white text-xs font-medium rounded-full">
                          📝 Borrador
                        </span>
                      )}
                      {vehicle.saleStatus === 'pending_validation' && (
                        <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full animate-pulse">
                          ⏳ Validando
                        </span>
                      )}
                      {vehicle.saleStatus === 'for_sale' && (
                        <span className="px-3 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                          ✅ En Venta
                        </span>
                      )}
                      {vehicle.saleStatus === 'rejected' && (
                        <span className="px-3 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                          ❌ Rechazado
                        </span>
                      )}
                    </div>
                  )}
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

                  {/* Mensaje de estado de validación */}
                  {showMyVehicles && vehicle.saleStatus === 'pending_validation' && (
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-xs text-yellow-800">
                        <strong>⏳ Validando datos:</strong> {vehicle.validationMessage}
                      </p>
                    </div>
                  )}

                  {showMyVehicles && vehicle.saleStatus === 'rejected' && vehicle.validationMessage && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-xs text-red-800">
                        <strong>❌ Rechazado:</strong> {vehicle.validationMessage}
                      </p>
                    </div>
                  )}

                  {showMyVehicles && vehicle.saleStatus === 'for_sale' && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-xs text-green-800">
                        <strong>✅ Aprobado:</strong> Tu vehículo está visible en el catálogo público
                      </p>
                    </div>
                  )}

                  {/* Acciones */}
                  <div className="flex flex-col gap-2">
                    {showMyVehicles ? (
                      <>
                        {/* Botón de Registrar para Venta (solo si está en borrador) */}
                        {vehicle.saleStatus === 'draft' && (
                          <button
                            onClick={() => handleRegisterForSale(vehicle.id)}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Registrar para Venta
                          </button>
                        )}

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
                      </>
                    ) : (
                      <button
                        onClick={() => setSelectedVehicle(vehicle)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        Ver Detalles
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal de detalles */}
      {selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header del modal */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">
                    {selectedVehicle.brand} {selectedVehicle.model}
                  </h2>
                  <p className="text-3xl font-bold text-blue-600">
                    {formatPrice(selectedVehicle.price)}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedVehicle(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <span className="text-2xl text-slate-400">×</span>
                </button>
              </div>

              {/* Imágenes */}
              <div className="mb-6">
                <div className="grid grid-cols-2 gap-4">
                  {selectedVehicle.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${selectedVehicle.brand} ${selectedVehicle.model} - ${index + 1}`}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>

              {/* Especificaciones */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Especificaciones</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-slate-600 mb-2" />
                    <p className="text-sm text-slate-600">Año</p>
                    <p className="font-semibold text-slate-900">{selectedVehicle.year}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <Gauge className="w-5 h-5 text-slate-600 mb-2" />
                    <p className="text-sm text-slate-600">Kilometraje</p>
                    <p className="font-semibold text-slate-900">{selectedVehicle.mileage.toLocaleString()} km</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <Cog className="w-5 h-5 text-slate-600 mb-2" />
                    <p className="text-sm text-slate-600">Transmisión</p>
                    <p className="font-semibold text-slate-900">{getTransmissionLabel(selectedVehicle.transmission)}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <Fuel className="w-5 h-5 text-slate-600 mb-2" />
                    <p className="text-sm text-slate-600">Combustible</p>
                    <p className="font-semibold text-slate-900">{getFuelTypeLabel(selectedVehicle.fuelType)}</p>
                  </div>
                </div>
              </div>

              {/* Descripción */}
              {selectedVehicle.description && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">Descripción</h3>
                  <p className="text-slate-700 leading-relaxed">{selectedVehicle.description}</p>
                </div>
              )}

              {/* Información de contacto */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Información del Vendedor</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Email</p>
                      <p className="font-medium text-slate-900">{selectedVehicle.userEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg">
                      <Phone className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Teléfono</p>
                      <p className="font-medium text-slate-900">{selectedVehicle.userPhone}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
