// ─── Database entities ────────────────────────────────────────────────────────

export interface Business {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  description: string | null;
  address: string | null;
  street: string | null;
  street_number: string | null;
  neighborhood: string | null;
  city: string | null;
  zip_code: string | null;
  phone: string | null;
  cover_url: string | null;
  logo_url: string | null;
  maps_embed_url: string | null;
  created_at: string;
}

export interface Professional {
  id: string;
  business_id: string;
  name: string;
  photo_url: string | null;
  specialty: string | null;
  phone: string | null;
  created_at: string;
}

export interface Service {
  id: string;
  business_id: string;
  name: string;
  price: number;
  duration_minutes: number;
  created_at: string;
}

export interface ProfessionalService {
  professional_id: string;
  service_id: string;
}

export interface WorkingHours {
  id: string;
  professional_id: string;
  day_of_week: number; // 0 = Sunday, 6 = Saturday
  start_time: string; // HH:MM:SS
  end_time: string;
  lunch_start: string | null;
  lunch_end: string | null;
}

export interface BlockedPeriod {
  id: string;
  professional_id: string;
  date: string; // YYYY-MM-DD
  start_time: string; // HH:MM:SS
  end_time: string;
  reason: string | null;
  created_at: string;
}

export type AppointmentStatus = "scheduled" | "completed" | "cancelled" | "no_show";

export interface Appointment {
  id: string;
  business_id: string;
  professional_id: string;
  service_id: string;
  client_name: string;
  client_phone: string;
  client_email: string;
  date: string; // YYYY-MM-DD
  start_time: string; // HH:MM:SS
  end_time: string;
  status: AppointmentStatus;
  cancel_token: string;
  reschedule_token: string;
  created_at: string;
}

// ─── Joined / enriched types ──────────────────────────────────────────────────

export interface AppointmentWithDetails extends Appointment {
  professional: Pick<Professional, "id" | "name" | "photo_url" | "specialty">;
  service: Pick<Service, "id" | "name" | "price" | "duration_minutes">;
}

export interface ProfessionalWithServices extends Professional {
  services: Service[];
}

export interface BusinessWithDetails extends Business {
  professionals: ProfessionalWithServices[];
  services: Service[];
}

// ─── Availability ─────────────────────────────────────────────────────────────

export interface GetAvailableSlotsInput {
  workingHours: WorkingHours | null;
  appointments: (Pick<Appointment, "start_time" | "end_time"> & { status?: AppointmentStatus })[];
  blockedPeriods: Pick<BlockedPeriod, "start_time" | "end_time">[];
  serviceDuration: number;
  currentDateTime: Date;
}

// ─── Booking flow ─────────────────────────────────────────────────────────────

export interface BookingFormData {
  service: Service | null;
  professional: ProfessionalWithServices | null;
  date: string | null; // YYYY-MM-DD
  time: string | null; // HH:MM
  clientName: string;
  clientPhone: string;
  clientEmail: string;
}

// ─── Forms ────────────────────────────────────────────────────────────────────

export interface BusinessFormData {
  name: string;
  slug: string;
  description: string;
  street: string;
  street_number: string;
  neighborhood: string;
  city: string;
  zip_code: string;
  phone: string;
  maps_embed_url: string;
}

export interface WorkingHoursFormData {
  day_of_week: number;
  enabled: boolean;
  start_time: string;
  end_time: string;
  lunch_start: string;
  lunch_end: string;
}

export interface ServiceFormData {
  name: string;
  price: string; // string para máscara BRL, convertido para number ao salvar
  duration_minutes: number;
}

export interface ProfessionalFormData {
  name: string;
  specialty: string;
  phone: string;
  service_ids: string[];
}

// ─── Dashboard metrics ────────────────────────────────────────────────────────

export interface DashboardMetrics {
  appointmentsToday: number;
  revenueToday: number;
  weeklyOccupancyRate: number;
  nextAppointment: AppointmentWithDetails | null;
}
