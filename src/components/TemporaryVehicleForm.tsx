import { useState } from 'react';
import { localStorageService, TemporaryVehicle } from '../lib/localStorageService';
import { Car, Upload, X, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';

interface TemporaryVehicleFormProps {
  vehicleToEdit?: TemporaryVehicle | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function TemporaryVehicleForm({ vehicleToEdit, onSuccess, onCancel }: TemporaryVehicleFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imageError, setImageError] = useState('');

  const [formData, setFormData] = useState({
    contactName: vehicleToEdit?.contactName || '',
    contactEmail: vehicleToEdit?.contactEmail || '',
    contactPhone: vehicleToEdit?.contactPhone || '',
    brand: vehicleToEdit?.brand || '',
    model: vehicleToEdit?.model || '',
    year: vehicleToEdit?.year || new Date().getFullYear(),
    price: vehicleToEdit?.price.toString() || '',
    description: vehicleToEdit?.description || '',
    mileage: vehicleToEdit?.mileage.toString() || '',
    transmission: (vehicleToEdit?.transmission || 'manual') as 'manual' | 'automatic',
    fuelType: (vehicleToEdit?.fuelType || 'gasoline') as 'gasoline' | 'diesel' | 'electric' | 'hybrid'
  });

  const [images, setImages] = useState<string[]>(vehicleToEdit?.images || []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setImageError('');

    if (images.length + files.length > 10) {
      setImageError('Máximo 10 imágenes permitidas');
      return;
    }

    const newImages: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      const validation = localStorageService.validateImageFile(file);
      if (!validation.valid) {
        setImageError(validation.error || 'Error al validar imagen');
        continue;
      }

      try {
        const base64 = await localStorageService.fileToBase64(file);
        newImages.push(base64);
      } catch (err) {
        setImageError('Error al procesar la imagen');
      }
    }

    setImages([...images, ...newImages]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setImageError('');

    // Validaciones
    if (!formData.contactName.trim()) {
      setError('El nombre de contacto es obligatorio');
      return;
    }
    if (!formData.contactEmail.trim()) {
      setError('El email de contacto es obligatorio');
      return;
    }
    if (!formData.contactPhone.trim()) {
      setError('El teléfono de contacto es obligatorio');
      return;
    }
    if (!formData.brand.trim()) {
      setError('La marca es obligatoria');
      return;
    }
    if (!formData.model.trim()) {
      setError('El modelo es obligatorio');
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('El precio es obligatorio y debe ser mayor a 0');
      return;
    }
    if (images.length === 0) {
      setError('Debe agregar al menos una imagen del vehículo');
      return;
    }

    setLoading(true);

    try {
      if (vehicleToEdit) {
        const result = await localStorageService.updateTemporaryVehicle(vehicleToEdit.id, {
          contactName: formData.contactName.trim(),
          contactEmail: formData.contactEmail.trim(),
          contactPhone: formData.contactPhone.trim(),
          brand: formData.brand.trim(),
          model: formData.model.trim(),
          year: formData.year,
          price: parseFloat(formData.price),
          description: formData.description.trim(),
          mileage: parseFloat(formData.mileage) || 0,
          transmission: formData.transmission,
          fuelType: formData.fuelType,
          images: images
        });

        if (result.success) {
          setSuccess('¡Vehículo actualizado exitosamente!');
          setTimeout(() => {
            onSuccess();
          }, 1500);
        } else {
          setError(result.message);
        }
      } else {
        const result = await localStorageService.createTemporaryVehicle({
          contactName: formData.contactName.trim(),
          contactEmail: formData.contactEmail.trim(),
          contactPhone: formData.contactPhone.trim(),
          brand: formData.brand.trim(),
          model: formData.model.trim(),
          year: formData.year,
          price: parseFloat(formData.price),
          description: formData.description.trim(),
          mileage: parseFloat(formData.mileage) || 0,
          transmission: formData.transmission,
          fuelType: formData.fuelType,
          images: images
        });

        if (result.success) {
          setSuccess('¡Vehículo registrado temporalmente! Podrás gestionarlo sin necesidad de crear una cuenta.');
          setTimeout(() => {
            onSuccess();
          }, 2000);
        } else {
          setError(result.message);
        }
      }
    } catch (err) {
      setError('Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={onCancel}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
              <Car className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                {vehicleToEdit ? 'Editar Registro Temporal' : 'Registrar Vehículo Temporalmente'}
              </h1>
              <p className="text-slate-600">
                {vehicleToEdit ? 'Actualiza la información' : 'Sin necesidad de crear cuenta - Gestión rápida'}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-800">{success}</p>
            </div>
          )}

          {/* Información de Contacto */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Información de Contacto</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tu nombre completo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="correo@ejemplo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Teléfono <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="3001234567"
                />
              </div>
            </div>
          </div>

          {/* Información del Vehículo */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Información del Vehículo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Marca <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Toyota, Chevrolet"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Modelo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Corolla, Spark"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Año <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Precio (COP) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="45000000"
                  min="0"
                  step="100000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Kilometraje
                </label>
                <input
                  type="number"
                  value={formData.mileage}
                  onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="50000"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Transmisión
                </label>
                <select
                  value={formData.transmission}
                  onChange={(e) => setFormData({ ...formData, transmission: e.target.value as 'manual' | 'automatic' })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="manual">Manual</option>
                  <option value="automatic">Automática</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tipo de Combustible
                </label>
                <select
                  value={formData.fuelType}
                  onChange={(e) => setFormData({ ...formData, fuelType: e.target.value as any })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="gasoline">Gasolina</option>
                  <option value="diesel">Diésel</option>
                  <option value="electric">Eléctrico</option>
                  <option value="hybrid">Híbrido</option>
                </select>
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Descripción</h3>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={5}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe las características y condiciones del vehículo..."
            />
          </div>

          {/* Imágenes */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Imágenes <span className="text-red-500">*</span>
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              Formatos: JPG, JPEG, PNG, WEBP. Máx 2MB. Hasta 10 imágenes.
            </p>

            <div className="mb-4">
              <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer">
                <Upload className="w-5 h-5 text-slate-600" />
                <span className="text-sm font-medium text-slate-600">Seleccionar imágenes</span>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={images.length >= 10}
                />
              </label>
            </div>

            {imageError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{imageError}</p>
              </div>
            )}

            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Imagen ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-slate-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-slate-900 mb-2">📝 Registro Temporal</h4>
            <p className="text-sm text-slate-700">
              Este vehículo quedará registrado temporalmente en tu navegador. Podrás editarlo o eliminarlo en cualquier momento.
              Si deseas publicarlo de forma permanente, deberás crear una cuenta en la plataforma.
            </p>
          </div>

          {/* Botones */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
            >
              {loading ? 'Procesando...' : (vehicleToEdit ? 'Actualizar' : 'Registrar Temporalmente')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
