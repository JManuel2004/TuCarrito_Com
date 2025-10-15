import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserProfile } from '../lib/supabase';
import * as supabaseService from '../lib/supabaseService';
import { Shield, LogOut, Users, Car, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

type AdminView = 'dashboard' | 'pending-users' | 'pending-vehicles' | 'all-users' | 'all-vehicles';

export default function AdminDashboard() {
  const { profile, signOut } = useAuth();
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');
  const [pendingUsers, setPendingUsers] = useState<UserProfile[]>([]);
  const [pendingVehicles, setPendingVehicles] = useState<supabaseService.Vehicle[]>([]);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [allVehicles, setAllVehicles] = useState<supabaseService.Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, [currentView]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      if (currentView === 'pending-users' || currentView === 'dashboard') {
        const users = await supabaseService.getPendingUsers();
        setPendingUsers(users);
      }
      if (currentView === 'pending-vehicles' || currentView === 'dashboard') {
        const vehicles = await supabaseService.getPendingVehicles();
        setPendingVehicles(vehicles);
      }
      if (currentView === 'all-users' || currentView === 'dashboard') {
        const users = await supabaseService.getAllUsers();
        setAllUsers(users);
      }
      if (currentView === 'all-vehicles' || currentView === 'dashboard') {
        const vehicles = await supabaseService.getAllVehicles();
        setAllVehicles(vehicles);
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar datos');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveUser = async (userId: string) => {
    setLoading(true);
    try {
      await supabaseService.approveUser(userId);
      alert('✅ Usuario aprobado exitosamente');
      loadData();
    } catch (err: any) {
      alert('❌ Error: ' + (err.message || 'Error al aprobar usuario'));
    } finally {
      setLoading(false);
    }
  };

  const handleRejectUser = async (userId: string) => {
    const confirmed = window.confirm('¿Estás seguro de rechazar este usuario?');
    if (!confirmed) return;

    setLoading(true);
    try {
      await supabaseService.rejectUser(userId);
      alert('Usuario rechazado');
      loadData();
    } catch (err: any) {
      alert('❌ Error: ' + (err.message || 'Error al rechazar usuario'));
    } finally {
      setLoading(false);
    }
  };

  const handleApproveVehicle = async (vehicleId: string) => {
    if (!profile?.id) return;
    setLoading(true);
    try {
      await supabaseService.approveVehicle(vehicleId, profile.id);
      alert('✅ Vehículo aprobado y ahora visible en el catálogo público');
      loadData();
    } catch (err: any) {
      alert('❌ Error: ' + (err.message || 'Error al aprobar vehículo'));
    } finally {
      setLoading(false);
    }
  };

  const handleRejectVehicle = async (vehicleId: string) => {
    if (!profile?.id) return;
    const reason = window.prompt('Ingresa el motivo del rechazo:');
    if (!reason) return;

    setLoading(true);
    try {
      await supabaseService.rejectVehicle(vehicleId, profile.id, reason);
      alert('Vehículo rechazado');
      loadData();
    } catch (err: any) {
      alert('❌ Error: ' + (err.message || 'Error al rechazar vehículo'));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    signOut();
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{pendingUsers.length}</p>
              <p className="text-sm text-slate-600">Usuarios Pendientes</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-50 rounded-lg">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{pendingVehicles.length}</p>
              <p className="text-sm text-slate-600">Vehículos Pendientes</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-50 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{allUsers.length}</p>
              <p className="text-sm text-slate-600">Total Usuarios</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Car className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{allVehicles.filter(v => v.validation_status === 'approved').length}</p>
              <p className="text-sm text-slate-600">Vehículos Publicados</p>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          onClick={() => setCurrentView('pending-users')}
          className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Users className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Aprobar Usuarios</h3>
          </div>
          <p className="text-slate-600 text-sm">
            {pendingUsers.length} usuario{pendingUsers.length !== 1 ? 's' : ''} esperando aprobación
          </p>
        </div>

        <div
          onClick={() => setCurrentView('pending-vehicles')}
          className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Car className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Aprobar Vehículos</h3>
          </div>
          <p className="text-slate-600 text-sm">
            {pendingVehicles.length} vehículo{pendingVehicles.length !== 1 ? 's' : ''} esperando validación
          </p>
        </div>
      </div>
    </div>
  );

  const renderPendingUsers = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Usuarios Pendientes de Aprobación</h2>
        <button
          onClick={() => setCurrentView('dashboard')}
          className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
        >
          Volver
        </button>
      </div>

      {pendingUsers.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <p className="text-slate-600">No hay usuarios pendientes de aprobación</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingUsers.map((pendingUser) => (
            <div key={pendingUser.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{pendingUser.full_name}</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-600">Email: <span className="font-medium text-slate-900">{pendingUser.email}</span></p>
                      <p className="text-slate-600">Teléfono: <span className="font-medium text-slate-900">{pendingUser.phone}</span></p>
                    </div>
                    <div>
                      <p className="text-slate-600">ID: <span className="font-medium text-slate-900">{pendingUser.id_number}</span></p>
                      <p className="text-slate-600">Tipo: <span className="font-medium text-slate-900">
                        {pendingUser.user_type === 'buyer' ? 'Comprador' : pendingUser.user_type === 'seller' ? 'Vendedor' : 'Ambos'}
                      </span></p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Registrado: {new Date(pendingUser.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleApproveUser(pendingUser.id)}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Aprobar
                  </button>
                  <button
                    onClick={() => handleRejectUser(pendingUser.id)}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4" />
                    Rechazar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderPendingVehicles = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Vehículos Pendientes de Validación</h2>
        <button
          onClick={() => setCurrentView('dashboard')}
          className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
        >
          Volver
        </button>
      </div>

      {pendingVehicles.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <p className="text-slate-600">No hay vehículos pendientes de validación</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pendingVehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              {vehicle.images.length > 0 && (
                <img
                  src={vehicle.images[0]}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {vehicle.brand} {vehicle.model} {vehicle.year}
                </h3>
                <p className="text-2xl font-bold text-blue-600 mb-4">
                  ${vehicle.price.toLocaleString()}
                </p>
                <div className="space-y-2 text-sm mb-4">
                  <p className="text-slate-600">Vendedor: <span className="font-medium">{vehicle.user_name}</span></p>
                  <p className="text-slate-600">Email: <span className="font-medium">{vehicle.user_email}</span></p>
                  <p className="text-slate-600">Teléfono: <span className="font-medium">{vehicle.user_phone}</span></p>
                  <p className="text-slate-600">Kilometraje: <span className="font-medium">{vehicle.mileage.toLocaleString()} km</span></p>
                  <p className="text-slate-600">Transmisión: <span className="font-medium">{vehicle.transmission === 'manual' ? 'Manual' : 'Automática'}</span></p>
                </div>
                <p className="text-slate-700 text-sm mb-4 line-clamp-2">{vehicle.description}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApproveVehicle(vehicle.id)}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Aprobar
                  </button>
                  <button
                    onClick={() => handleRejectVehicle(vehicle.id)}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4" />
                    Rechazar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-purple-600" />
              <div>
                <h1 className="text-xl font-bold text-slate-900">Panel de Administración</h1>
                <p className="text-xs text-slate-600">TuCarrito.com</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">{profile?.full_name}</p>
                <p className="text-xs text-slate-600">Administrador</p>
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
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {currentView === 'dashboard' && renderDashboard()}
        {currentView === 'pending-users' && renderPendingUsers()}
        {currentView === 'pending-vehicles' && renderPendingVehicles()}
      </main>
    </div>
  );
}
