import { useAuth } from '../contexts/AuthContext';
import { Car, LogOut, User, CheckCircle } from 'lucide-react';

export default function Dashboard() {
  const { profile, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Car className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-slate-900">TuCarrito.com</h1>
            </div>
            <button
              onClick={signOut}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-blue-50 rounded-lg">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-900 mb-1">
                Bienvenido, {profile?.full_name}
              </h2>
              <p className="text-slate-600">
                Tipo de usuario: <span className="font-medium">{profile?.user_type === 'buyer' ? 'Comprador' : 'Vendedor'}</span>
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-700">
                Cuenta Validada
              </span>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Información de la Cuenta
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-slate-500 mb-1">Correo Electrónico</p>
                <p className="text-slate-900 font-medium">{profile?.email}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Teléfono</p>
                <p className="text-slate-900 font-medium">{profile?.phone}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Número de Identificación</p>
                <p className="text-slate-900 font-medium">{profile?.id_number}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Estado de Validación</p>
                <p className="text-slate-900 font-medium capitalize">{profile?.validation_status}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-slate-50 rounded-lg border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Sistema de Validación de Identidad
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Tu cuenta ha sido verificada exitosamente. Este proceso simula la verificación de identidad
              para garantizar perfiles reales en la plataforma TuCarrito.com, evitando cuentas falsas
              o fraudulentas y generando confianza entre compradores y vendedores.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
