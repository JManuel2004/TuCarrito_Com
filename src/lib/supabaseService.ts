import { supabase } from './supabase';

// ============= TIPOS =============
export interface Vehicle {
  id: string;
  user_id: string;
  user_email: string;
  user_name: string;
  user_phone: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  description: string;
  mileage: number;
  transmission: 'manual' | 'automatic';
  fuel_type: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
  images: string[];
  status: 'draft' | 'pending_validation' | 'approved' | 'rejected' | 'sold';
  validation_status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
  validated_by?: string;
  validated_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateVehicleData {
  user_id: string;
  user_email: string;
  user_name: string;
  user_phone: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  description: string;
  mileage: number;
  transmission: 'manual' | 'automatic';
  fuel_type: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
  images: string[];
}

export interface UpdateVehicleData {
  brand?: string;
  model?: string;
  year?: number;
  price?: number;
  description?: string;
  mileage?: number;
  transmission?: 'manual' | 'automatic';
  fuel_type?: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
  images?: string[];
  status?: 'draft' | 'pending_validation' | 'approved' | 'rejected' | 'sold';
}

// ============= USUARIOS =============

// Obtener todos los usuarios (solo admin)
export async function getAllUsers() {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Obtener usuarios pendientes de aprobación (solo admin)
export async function getPendingUsers() {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('validation_status', 'pending')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Aprobar usuario (solo admin)
export async function approveUser(userId: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .update({
      validation_status: 'approved',
      validated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Rechazar usuario (solo admin)
export async function rejectUser(userId: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .update({
      validation_status: 'rejected',
      validated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============= VEHÍCULOS =============

// Crear vehículo
export async function createVehicle(vehicleData: CreateVehicleData) {
  const { data, error } = await supabase
    .from('vehicles')
    .insert([{
      user_id: vehicleData.user_id,
      user_email: vehicleData.user_email,
      user_name: vehicleData.user_name,
      user_phone: vehicleData.user_phone,
      brand: vehicleData.brand,
      model: vehicleData.model,
      year: vehicleData.year,
      price: vehicleData.price,
      description: vehicleData.description,
      mileage: vehicleData.mileage,
      transmission: vehicleData.transmission,
      fuel_type: vehicleData.fuel_type,
      images: vehicleData.images,
      status: 'draft',
      validation_status: 'pending'
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Actualizar vehículo
export async function updateVehicle(vehicleId: string, updates: UpdateVehicleData) {
  const { data, error } = await supabase
    .from('vehicles')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', vehicleId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Eliminar vehículo
export async function deleteVehicle(vehicleId: string) {
  const { error } = await supabase
    .from('vehicles')
    .delete()
    .eq('id', vehicleId);

  if (error) throw error;
}

// Obtener vehículos del usuario
export async function getUserVehicles(userId: string) {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Obtener vehículos aprobados para venta (catálogo público)
export async function getVehiclesForSale() {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('status', 'approved')
    .eq('validation_status', 'approved')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Obtener vehículos pendientes de validación (solo admin)
export async function getPendingVehicles() {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('validation_status', 'pending')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Registrar vehículo para venta (cambiar estado a pending_validation)
export async function registerVehicleForSale(vehicleId: string) {
  const { data, error } = await supabase
    .from('vehicles')
    .update({
      status: 'pending_validation',
      validation_status: 'pending',
      updated_at: new Date().toISOString()
    })
    .eq('id', vehicleId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Aprobar vehículo (solo admin)
export async function approveVehicle(vehicleId: string, adminId: string) {
  const { data, error } = await supabase
    .from('vehicles')
    .update({
      status: 'approved',
      validation_status: 'approved',
      validated_by: adminId,
      validated_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', vehicleId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Rechazar vehículo (solo admin)
export async function rejectVehicle(vehicleId: string, adminId: string, reason: string) {
  const { data, error } = await supabase
    .from('vehicles')
    .update({
      status: 'rejected',
      validation_status: 'rejected',
      rejection_reason: reason,
      validated_by: adminId,
      validated_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', vehicleId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Búsqueda de vehículos con filtros
export async function searchVehicles(filters: {
  brand?: string;
  model?: string;
  minYear?: number;
  maxYear?: number;
  minPrice?: number;
  maxPrice?: number;
  transmission?: string;
  fuelType?: string;
}) {
  let query = supabase
    .from('vehicles')
    .select('*')
    .eq('status', 'approved')
    .eq('validation_status', 'approved');

  if (filters.brand) {
    query = query.ilike('brand', `%${filters.brand}%`);
  }
  if (filters.model) {
    query = query.ilike('model', `%${filters.model}%`);
  }
  if (filters.minYear) {
    query = query.gte('year', filters.minYear);
  }
  if (filters.maxYear) {
    query = query.lte('year', filters.maxYear);
  }
  if (filters.minPrice) {
    query = query.gte('price', filters.minPrice);
  }
  if (filters.maxPrice) {
    query = query.lte('price', filters.maxPrice);
  }
  if (filters.transmission) {
    query = query.eq('transmission', filters.transmission);
  }
  if (filters.fuelType) {
    query = query.eq('fuel_type', filters.fuelType);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Marcar vehículo como vendido
export async function markVehicleAsSold(vehicleId: string) {
  const { data, error } = await supabase
    .from('vehicles')
    .update({
      status: 'sold',
      updated_at: new Date().toISOString()
    })
    .eq('id', vehicleId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Obtener todos los vehículos (solo admin)
export async function getAllVehicles() {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}
