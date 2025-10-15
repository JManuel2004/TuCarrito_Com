import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import * as supabaseService from '../lib/supabaseService';
import type { Vehicle } from '../lib/supabaseService';
import { Car, LogOut, User, CheckCircle, Plus, Search, Settings, List } from 'lucide-react';
import VehicleForm from './VehicleForm';
import VehicleList from './VehicleList';

type ViewType = 'dashboard' | 'publish' | 'catalog' | 'my-vehicles' | 'edit-vehicle';

export default function SimpleDashboard() {
  const { profile, user, signOut } = useAuth();
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [vehicleToEdit, setVehicleToEdit] = useState<Vehicle | null>(null);
  const [myVehiclesCount, setMyVehiclesCount] = useState(0);

  useEffect(() => {
    const loadUserVehicles = async () => {
      if (user?.id) {
        const vehicles = await supabaseService.getUserVehicles(user.id);
        setMyVehiclesCount(vehicles.length);
      }
    };
    loadUserVehicles();
  }, [user, currentView]);

  const handleLogout = async () => {
    await signOut();
  };

  const getUserTypeLabel = () => {
    switch (profile?.user_type) {
      case 'buyer': return 'Comprador';
      case 'seller': return 'Vendedor';
      case 'admin': return 'Administrador';
      default: return 'Usuario';
    }
  };

  const handlePublishSuccess = () => {
    setCurrentView('my-vehicles');
    setVehicleToEdit(null);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setVehicleToEdit(vehicle);
    setCurrentView('edit-vehicle');
  };

  const handleCancelEdit = () => {
    setVehicleToEdit(null);
    setCurrentView('dashboard');
  };

  // Renderizar la vista de formulario de vehículo
  if (currentView === 'publish' || currentView === 'edit-vehicle') {
    return (
      <VehicleForm
        vehicleToEdit={vehicleToEdit}
        onSuccess={handlePublishSuccess}
        onCancel={handleCancelEdit}
      />
    );
  }

  // Renderizar la vista de catálogo
  if (currentView === 'catalog') {
    return (
      <VehicleList
        onBack={() => setCurrentView('dashboard')}
        onEditVehicle={handleEditVehicle}
        showMyVehicles={false}
      />
    );
  }

  // Renderizar la vista de mis vehículos
  if (currentView === 'my-vehicles') {
    return (
      <VehicleList
        onBack={() => setCurrentView('dashboard')}
        onEditVehicle={handleEditVehicle}
        showMyVehicles={true}
      />
    );
  }

  // Vista principal del dashboard

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Car className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-slate-900">TuCarrito.com</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* User Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-blue-50 rounded-lg">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-900 mb-1">
                Bienvenido, {profile?.full_name}
              </h2>
              <p className="text-slate-600 mb-2">
                Email: {profile?.email}
              </p>
              <p className="text-slate-600 mb-2">
                Teléfono: {profile?.phone}
              </p>
              <p className="text-slate-600">
                Tipo de usuario: <span className="font-medium">{getUserTypeLabel()}</span>
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-700">
                Cuenta Validada
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div 
            onClick={() => setCurrentView('catalog')}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Search className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900">Buscar Vehículos</h3>
            </div>
            <p className="text-slate-600 text-sm">
              Explora nuestro catálogo de vehículos disponibles
            </p>
          </div>

          {(profile?.user_type === 'seller' || profile?.user_type === 'admin') && (
            <>
              <div 
                onClick={() => setCurrentView('publish')}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Plus className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900">Publicar Vehículo</h3>
                </div>
                <p className="text-slate-600 text-sm">
                  Anuncia tu vehículo en la plataforma
                </p>
              </div>

              <div 
                onClick={() => setCurrentView('my-vehicles')}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <List className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900">Mis Vehículos</h3>
                </div>
                <p className="text-slate-600 text-sm">
                  Gestiona tus {myVehiclesCount} vehículo{myVehiclesCount !== 1 ? 's' : ''} publicado{myVehiclesCount !== 1 ? 's' : ''}
                </p>
              </div>
            </>
          )}

          {profile?.user_type === 'buyer' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Settings className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-slate-900">Configuración</h3>
              </div>
              <p className="text-slate-600 text-sm">
                Administra tu perfil y preferencias
              </p>
            </div>
          )}
        </div>

        {/* Información del Sistema */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 text-center">
            Sistema de Publicación de Vehículos
          </h3>
          <p className="text-slate-600 text-center max-w-2xl mx-auto">
            Publica tus vehículos de forma segura. Cada publicación pasa por un proceso de validación antes de aparecer en el catálogo público.
          </p>
        </div>
      </main>
    </div>
  );
}