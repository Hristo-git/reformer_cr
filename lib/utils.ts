// Utility функции за управление на данните за класовете

export interface Class {
  id: number
  day: string
  time: string
  title: string
  instructor: string
  spotsTotal: number
  spotsBooked: number
  intensity: 'Low' | 'Medium' | 'High'
}

const STORAGE_KEY = 'pilates_classes'

// Зареждане на класовете от localStorage или връщане на default данни
export function loadClasses(): Class[] {
  if (typeof window === 'undefined') return []
  
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return getDefaultClasses()
    }
  }
  return getDefaultClasses()
}

// Запазване на класовете в localStorage
export function saveClasses(classes: Class[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(classes))
}

// Default данни за класовете
function getDefaultClasses(): Class[] {
  return [
    {
      id: 1,
      day: 'Понеделник',
      time: '09:00',
      title: 'Morning Flow',
      instructor: 'Мария Петрова',
      spotsTotal: 12,
      spotsBooked: 10,
      intensity: 'Low',
    },
    {
      id: 2,
      day: 'Понеделник',
      time: '18:00',
      title: 'Power Reformer',
      instructor: 'Иван Димитров',
      spotsTotal: 10,
      spotsBooked: 8,
      intensity: 'High',
    },
    {
      id: 3,
      day: 'Вторник',
      time: '10:30',
      title: 'Gentle Stretch',
      instructor: 'Анна Георгиева',
      spotsTotal: 12,
      spotsBooked: 12,
      intensity: 'Low',
    },
    {
      id: 4,
      day: 'Вторник',
      time: '19:00',
      title: 'Intermediate Reformer',
      instructor: 'Петър Стоянов',
      spotsTotal: 10,
      spotsBooked: 9,
      intensity: 'Medium',
    },
    {
      id: 5,
      day: 'Сряда',
      time: '08:00',
      title: 'Sunrise Pilates',
      instructor: 'Мария Петрова',
      spotsTotal: 12,
      spotsBooked: 11,
      intensity: 'Low',
    },
    {
      id: 6,
      day: 'Сряда',
      time: '17:30',
      title: 'Advanced Flow',
      instructor: 'Иван Димитров',
      spotsTotal: 8,
      spotsBooked: 6,
      intensity: 'High',
    },
    {
      id: 7,
      day: 'Четвъртък',
      time: '11:00',
      title: 'Restorative Reformer',
      instructor: 'Анна Георгиева',
      spotsTotal: 12,
      spotsBooked: 5,
      intensity: 'Low',
    },
    {
      id: 8,
      day: 'Четвъртък',
      time: '18:30',
      title: 'Evening Balance',
      instructor: 'Петър Стоянов',
      spotsTotal: 10,
      spotsBooked: 10,
      intensity: 'Medium',
    },
    {
      id: 9,
      day: 'Петък',
      time: '09:30',
      title: 'Weekend Prep',
      instructor: 'Мария Петрова',
      spotsTotal: 12,
      spotsBooked: 4,
      intensity: 'Medium',
    },
    {
      id: 10,
      day: 'Събота',
      time: '10:00',
      title: 'Saturday Strength',
      instructor: 'Иван Димитров',
      spotsTotal: 10,
      spotsBooked: 8,
      intensity: 'High',
    },
  ]
}

// Добавяне на нов клас
export function addClass(newClass: Omit<Class, 'id'>): Class {
  const classes = loadClasses()
  const maxId = classes.length > 0 ? Math.max(...classes.map(c => c.id)) : 0
  const classWithId: Class = { ...newClass, id: maxId + 1 }
  classes.push(classWithId)
  saveClasses(classes)
  return classWithId
}

// Обновяване на клас
export function updateClass(id: number, updatedClass: Partial<Class>): Class | null {
  const classes = loadClasses()
  const index = classes.findIndex(c => c.id === id)
  if (index === -1) return null
  
  classes[index] = { ...classes[index], ...updatedClass }
  saveClasses(classes)
  return classes[index]
}

// Изтриване на клас
export function deleteClass(id: number): boolean {
  const classes = loadClasses()
  const filtered = classes.filter(c => c.id !== id)
  if (filtered.length === classes.length) return false
  
  saveClasses(filtered)
  return true
}

// Получаване на клас по ID
export function getClassById(id: number): Class | null {
  const classes = loadClasses()
  return classes.find(c => c.id === id) || null
}

// Групиране на класовете по дни
export function groupClassesByDay(classes: Class[]): { [key: string]: Class[] } {
  const grouped: { [key: string]: Class[] } = {}
  classes.forEach((cls) => {
    if (!grouped[cls.day]) {
      grouped[cls.day] = []
    }
    grouped[cls.day].push(cls)
  })
  return grouped
}

// ========== РЕЗЕРВАЦИИ ==========

export interface Booking {
  id: number
  classId: number
  clientName: string
  clientEmail: string
  clientPhone: string
  date: string // YYYY-MM-DD
  status: 'confirmed' | 'cancelled' | 'waitlist'
  createdAt: string
  notes?: string
}

const BOOKINGS_STORAGE_KEY = 'pilates_bookings'

export function loadBookings(): Booking[] {
  if (typeof window === 'undefined') return []
  
  const stored = localStorage.getItem(BOOKINGS_STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return []
    }
  }
  return []
}

export function saveBookings(bookings: Booking[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings))
}

export function addBooking(booking: Omit<Booking, 'id' | 'createdAt'>): Booking {
  const bookings = loadBookings()
  const maxId = bookings.length > 0 ? Math.max(...bookings.map(b => b.id)) : 0
  const bookingWithId: Booking = {
    ...booking,
    id: maxId + 1,
    createdAt: new Date().toISOString(),
  }
  bookings.push(bookingWithId)
  
  // Обновяване на броя заети места в класа
  const classData = getClassById(booking.classId)
  if (classData && booking.status === 'confirmed') {
    updateClass(booking.classId, {
      spotsBooked: classData.spotsBooked + 1,
    })
  }
  
  saveBookings(bookings)
  return bookingWithId
}

export function updateBooking(id: number, updatedBooking: Partial<Booking>): Booking | null {
  const bookings = loadBookings()
  const index = bookings.findIndex(b => b.id === id)
  if (index === -1) return null
  
  const oldBooking = bookings[index]
  bookings[index] = { ...bookings[index], ...updatedBooking }
  
  // Обновяване на местата ако статусът се променя
  if (updatedBooking.status && oldBooking.status !== updatedBooking.status) {
    const classData = getClassById(oldBooking.classId)
    if (classData) {
      let newSpotsBooked = classData.spotsBooked
      if (oldBooking.status === 'confirmed' && updatedBooking.status !== 'confirmed') {
        newSpotsBooked = Math.max(0, newSpotsBooked - 1)
      } else if (oldBooking.status !== 'confirmed' && updatedBooking.status === 'confirmed') {
        newSpotsBooked = Math.min(classData.spotsTotal, newSpotsBooked + 1)
      }
      updateClass(oldBooking.classId, { spotsBooked: newSpotsBooked })
    }
  }
  
  saveBookings(bookings)
  return bookings[index]
}

export function deleteBooking(id: number): boolean {
  const bookings = loadBookings()
  const booking = bookings.find(b => b.id === id)
  if (!booking) return false
  
  // Намаляване на заетите места
  if (booking.status === 'confirmed') {
    const classData = getClassById(booking.classId)
    if (classData) {
      updateClass(booking.classId, {
        spotsBooked: Math.max(0, classData.spotsBooked - 1),
      })
    }
  }
  
  const filtered = bookings.filter(b => b.id !== id)
  saveBookings(filtered)
  return true
}

export function getBookingsByClassId(classId: number): Booking[] {
  return loadBookings().filter(b => b.classId === classId)
}

// ========== НАСТРОЙКИ ==========

export interface StudioSettings {
  studioName: string
  address: string
  phone: string
  email: string
  workingHours: {
    [key: string]: { open: string; close: string } | null
  }
  cancellationPolicy: string
  maxBookingDaysInAdvance: number
  minBookingHoursInAdvance: number
}

const SETTINGS_STORAGE_KEY = 'studio_settings'

const defaultSettings: StudioSettings = {
  studioName: 'Reformer Pilates Studio',
  address: 'София, България',
  phone: '+359 888 123 456',
  email: 'info@reformerstudio.bg',
  workingHours: {
    Понеделник: { open: '08:00', close: '20:00' },
    Вторник: { open: '08:00', close: '20:00' },
    Сряда: { open: '08:00', close: '20:00' },
    Четвъртък: { open: '08:00', close: '20:00' },
    Петък: { open: '08:00', close: '20:00' },
    Събота: { open: '09:00', close: '18:00' },
    Неделя: null,
  },
  cancellationPolicy: 'Резервациите могат да бъдат отменени до 24 часа преди класа без такса.',
  maxBookingDaysInAdvance: 30,
  minBookingHoursInAdvance: 2,
}

export function loadSettings(): StudioSettings {
  if (typeof window === 'undefined') return defaultSettings
  
  const stored = localStorage.getItem(SETTINGS_STORAGE_KEY)
  if (stored) {
    try {
      return { ...defaultSettings, ...JSON.parse(stored) }
    } catch {
      return defaultSettings
    }
  }
  return defaultSettings
}

export function saveSettings(settings: StudioSettings): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
}
