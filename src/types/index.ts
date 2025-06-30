export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  role: 'user' | 'admin';
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface Booking {
  id: string;
  user_id: string;
  service_type: string;
  location: string;
  latitude: number;
  longitude: number;
  booking_date: string;
  booking_time: string;
  duration: number;
  purpose: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  total_amount: number;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  drone_type: string;
  pilot_assigned?: string;
  special_instructions?: string;
  created_at: string;
  updated_at: string;
}

export interface DroneType {
  id: string;
  name: string;
  description: string;
  price_per_hour: number;
  max_flight_time: number;
  max_range: number;
  camera_specs: string;
  availability: boolean;
  image_url?: string;
}

export interface BookingFormData {
  service_type: string;
  location: string;
  latitude: number;
  longitude: number;
  booking_date: string;
  booking_time: string;
  duration: number;
  purpose: string;
  drone_type: string;
  special_instructions?: string;
}

export interface PaymentOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface WebSocketMessage {
  type: 'booking_update' | 'notification' | 'chat_message' | 'drone_status';
  data: any;
  timestamp: string;
}

export interface NotificationData {
  id: string;
  title: string;
  body: string;
  type: 'booking' | 'payment' | 'general';
  booking_id?: string;
  read: boolean;
  created_at: string;
}

export interface DashboardStats {
  total_bookings: number;
  pending_bookings: number;
  completed_bookings: number;
  total_spent: number;
  upcoming_bookings: Booking[];
}

export interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string;
  country: string;
}
