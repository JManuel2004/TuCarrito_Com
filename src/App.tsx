import { useState } from 'react';
import { SimpleAuthProvider, useSimpleAuth } from './contexts/SimpleAuthContext';
import SimpleRegisterForm from './components/SimpleRegisterForm';
import SimpleLoginForm from './components/SimpleLoginForm';
import SimpleDashboard from './components/SimpleDashboard';
import AdminDashboard from './components/AdminDashboard';
import { Car, UserPlus, LogIn } from 'lucide-react';

function AuthPage() {
  const [showRegister, setShowRegister] = useState(false);
  const { user, loading } = useSimpleAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si es administrador, mostrar panel de administración
  if (user && user.userRole === 'admin') {
    return <AdminDashboard />;
  }

  // Si es usuario aprobado, mostrar dashboard normal
  if (user && user.validationStatus === 'approved' && user.isApproved) {
    return <SimpleDashboard />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
              <Car className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">TuCarrito.com</h1>
          <p className="text-slate-600">Plataforma de compra y venta de vehículos</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
          <div className="flex border-b border-slate-200 mb-6">
            <button
              onClick={() => setShowRegister(false)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 font-medium transition-colors ${
                !showRegister
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <LogIn className="w-5 h-5" />
              Iniciar Sesión
            </button>
            <button
              onClick={() => setShowRegister(true)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 font-medium transition-colors ${
                showRegister
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <UserPlus className="w-5 h-5" />
              Registrarse
            </button>
          </div>

          {showRegister ? (
            <>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Crear Cuenta</h2>
              <p className="text-slate-600 mb-6 text-sm">
                Completa el formulario para registrarte en la plataforma
              </p>
              <SimpleRegisterForm onSuccess={() => setShowRegister(false)} />
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Iniciar Sesión</h2>
              <p className="text-slate-600 mb-6 text-sm">
                Ingresa tus credenciales para acceder a tu cuenta
              </p>
              <SimpleLoginForm onSuccess={() => {}} />
            </>
          )}
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800 text-center">
            <strong>Nota:</strong> Los usuarios registrados pasan por un proceso de validación de identidad
            antes de poder acceder a la plataforma.
          </p>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <SimpleAuthProvider>
      <AuthPage />
    </SimpleAuthProvider>
  );
}

export default App;
