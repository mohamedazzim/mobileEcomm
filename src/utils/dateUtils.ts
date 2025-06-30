export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  return date.toLocaleDateString('en-US', options);
};

export const formatTime = (timeString: string): string => {
  const [hours, minutes] = timeString.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes);
  
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export const formatDateTime = (dateString: string, timeString: string): string => {
  const date = formatDate(dateString);
  const time = formatTime(timeString);
  return `${date} at ${time}`;
};

export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  }
  
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
};

export const isToday = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export const isTomorrow = (dateString: string): boolean => {
  const date = new Date(dateString);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return (
    date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getFullYear() === tomorrow.getFullYear()
  );
};

export const isYesterday = (dateString: string): boolean => {
  const date = new Date(dateString);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
};

export const getWeekday = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'long' });
};

export const getMonth = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'long' });
};

export const addDays = (dateString: string, days: number): string => {
  const date = new Date(dateString);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

export const subtractDays = (dateString: string, days: number): string => {
  return addDays(dateString, -days);
};

export const getDaysDifference = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffInTime = end.getTime() - start.getTime();
  return Math.ceil(diffInTime / (1000 * 3600 * 24));
};

export const isWeekend = (dateString: string): boolean => {
  const date = new Date(dateString);
  const dayOfWeek = date.getDay();
  return dayOfWeek === 0 || dayOfWeek === 6; // Sunday = 0, Saturday = 6
};

export const getStartOfWeek = (dateString: string): string => {
  const date = new Date(dateString);
  const dayOfWeek = date.getDay();
  const diff = date.getDate() - dayOfWeek;
  const startOfWeek = new Date(date.setDate(diff));
  return startOfWeek.toISOString().split('T')[0];
};

export const getEndOfWeek = (dateString: string): string => {
  const startOfWeek = getStartOfWeek(dateString);
  return addDays(startOfWeek, 6);
};

export const getStartOfMonth = (dateString: string): string => {
  const date = new Date(dateString);
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  return startOfMonth.toISOString().split('T')[0];
};

export const getEndOfMonth = (dateString: string): string => {
  const date = new Date(dateString);
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return endOfMonth.toISOString().split('T')[0];
};

export const getCurrentDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const getCurrentTime = (): string => {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
};

export const getCurrentDateTime = (): string => {
  return new Date().toISOString();
};

export const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

export const isValidTime = (timeString: string): boolean => {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(timeString);
};

export const isPastDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

export const isFutureDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return date > today;
};

export const isPastTime = (dateString: string, timeString: string): boolean => {
  const [hours, minutes] = timeString.split(':').map(Number);
  const date = new Date(dateString);
  date.setHours(hours, minutes, 0, 0);
  
  return date < new Date();
};

export const formatBookingDate = (dateString: string, timeString: string): string => {
  if (isToday(dateString)) {
    return `Today at ${formatTime(timeString)}`;
  }
  
  if (isTomorrow(dateString)) {
    return `Tomorrow at ${formatTime(timeString)}`;
  }
  
  if (isYesterday(dateString)) {
    return `Yesterday at ${formatTime(timeString)}`;
  }
  
  return formatDateTime(dateString, timeString);
};

export const getTimeSlots = (
  startHour: number = 6,
  endHour: number = 20,
  interval: number = 30
): string[] => {
  const slots: string[] = [];
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      const timeSlot = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push(timeSlot);
    }
  }
  
  return slots;
};

export const getAvailableTimeSlots = (
  dateString: string,
  bookedSlots: string[] = [],
  startHour: number = 6,
  endHour: number = 20,
  interval: number = 30
): string[] => {
  const allSlots = getTimeSlots(startHour, endHour, interval);
  
  // Filter out booked slots
  const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));
  
  // If the date is today, filter out past time slots
  if (isToday(dateString)) {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    return availableSlots.filter(slot => slot > currentTime);
  }
  
  return availableSlots;
};

export const formatDuration = (hours: number): string => {
  if (hours === 1) {
    return '1 hour';
  }
  
  if (hours < 1) {
    const minutes = Math.round(hours * 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  }
  
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  
  if (minutes === 0) {
    return `${wholeHours} hour${wholeHours > 1 ? 's' : ''}`;
  }
  
  return `${wholeHours} hour${wholeHours > 1 ? 's' : ''} ${minutes} minute${minutes > 1 ? 's' : ''}`;
};

export const parseTimeSlot = (timeSlot: string): { hours: number; minutes: number } => {
  const [hours, minutes] = timeSlot.split(':').map(Number);
  return { hours, minutes };
};

export const calculateEndTime = (startTime: string, durationHours: number): string => {
  const { hours, minutes } = parseTimeSlot(startTime);
  const startDate = new Date();
  startDate.setHours(hours, minutes, 0, 0);
  
  const endDate = new Date(startDate.getTime() + durationHours * 60 * 60 * 1000);
  
  return `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
};
