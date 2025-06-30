export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const validatePhone = (phone: string): boolean => {
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Check if it's a valid Indian phone number (10 digits starting with 6-9)
  const indianPhoneRegex = /^[6-9]\d{9}$/;
  
  // Check if it's a valid international phone number (7-15 digits)
  const internationalPhoneRegex = /^\d{7,15}$/;
  
  return indianPhoneRegex.test(cleanPhone) || internationalPhoneRegex.test(cleanPhone);
};

export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  
  if (password.length > 128) {
    errors.push('Password must be less than 128 characters');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateName = (name: string): boolean => {
  const nameRegex = /^[a-zA-Z\s]{2,50}$/;
  return nameRegex.test(name.trim());
};

export const validateRequired = (value: string, fieldName: string): string | null => {
  if (!value || !value.trim()) {
    return `${fieldName} is required`;
  }
  return null;
};

export const validateMinLength = (
  value: string,
  minLength: number,
  fieldName: string
): string | null => {
  if (value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`;
  }
  return null;
};

export const validateMaxLength = (
  value: string,
  maxLength: number,
  fieldName: string
): string | null => {
  if (value.length > maxLength) {
    return `${fieldName} must be less than ${maxLength} characters`;
  }
  return null;
};

export const validateDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return !isNaN(date.getTime()) && date >= today;
};

export const validateTime = (timeString: string): boolean => {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(timeString);
};

export const validateDuration = (duration: number): boolean => {
  return duration > 0 && duration <= 24 && Number.isInteger(duration);
};

export const validateLatitude = (lat: number): boolean => {
  return lat >= -90 && lat <= 90;
};

export const validateLongitude = (lng: number): boolean => {
  return lng >= -180 && lng <= 180;
};

export const validateCoordinates = (lat: number, lng: number): boolean => {
  return validateLatitude(lat) && validateLongitude(lng);
};

export const validateBookingData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data.service_type) {
    errors.push('Service type is required');
  }
  
  if (!data.location) {
    errors.push('Location is required');
  }
  
  if (!data.latitude || !data.longitude) {
    errors.push('Location coordinates are required');
  } else if (!validateCoordinates(data.latitude, data.longitude)) {
    errors.push('Invalid location coordinates');
  }
  
  if (!data.booking_date) {
    errors.push('Booking date is required');
  } else if (!validateDate(data.booking_date)) {
    errors.push('Invalid booking date');
  }
  
  if (!data.booking_time) {
    errors.push('Booking time is required');
  } else if (!validateTime(data.booking_time)) {
    errors.push('Invalid booking time');
  }
  
  if (!data.duration) {
    errors.push('Duration is required');
  } else if (!validateDuration(data.duration)) {
    errors.push('Invalid duration');
  }
  
  if (!data.purpose) {
    errors.push('Purpose is required');
  }
  
  if (!data.drone_type) {
    errors.push('Drone type is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const validateFileSize = (fileSize: number, maxSizeMB: number = 5): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return fileSize <= maxSizeBytes;
};

export const validateFileType = (
  fileName: string,
  allowedTypes: string[] = ['jpg', 'jpeg', 'png', 'pdf']
): boolean => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  return allowedTypes.includes(extension || '');
};
