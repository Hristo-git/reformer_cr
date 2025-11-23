'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, TrendingUp, Users, Calendar, Clock, BarChart3, PieChart } from 'lucide-react'
import Link from 'next/link'
import { loadBookings, loadClasses, type Booking, type Class } from '@/lib/utils'

export default function StatisticsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [classes, setClasses] = useState<Class[]>([])

  useEffect(() => {
    setBookings(loadBookings())
    setClasses(loadClasses())
  }, [])

  // Статистика за резервациите
  const totalBookings = bookings.length
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length
  const waitlistBookings = bookings.filter(b => b.status === 'waitlist').length

  // Статистика по класове
  const bookingsByClass = classes.map(cls => ({
    class: cls,
    bookings: bookings.filter(b => b.classId === cls.id && b.status === 'confirmed').length,
  })).sort((a, b) => b.bookings - a.bookings)

  // Статистика по дни от седмицата
  const bookingsByDay = classes.reduce((acc, cls) => {
    const dayBookings = bookings.filter(b => b.classId === cls.id && b.status === 'confirmed').length
    acc[cls.day] = (acc[cls.day] || 0) + dayBookings
    return acc
  }, {} as { [key: string]: number })

  // Статистика по инструктори
  const bookingsByInstructor = classes.reduce((acc, cls) => {
    const instructorBookings = bookings.filter(b => b.classId === cls.id && b.status === 'confirmed').length
    acc[cls.instructor] = (acc[cls.instructor] || 0) + instructorBookings
    return acc
  }, {} as { [key: string]: number })

  // Най-популярни класове
  const topClasses = bookingsByClass.slice(0, 5)

  // Обща заетост
  const totalSpots = classes.reduce((sum, cls) => sum + cls.spotsTotal, 0)
  const totalBooked = classes.reduce((sum, cls) => sum + cls.spotsBooked, 0)
  const occupancyRate = totalSpots > 0 ? (totalBooked / totalSpots) * 100 : 0

  // Резервации по месеци (последните 6 месеца)
  const monthlyBookings = Array.from({ length: 6 }, (_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    return {
      month: date.toLocaleString('bg-BG', { month: 'long', year: 'numeric' }),
      count: bookings.filter(b => {
        const bookingDate = new Date(b.createdAt)
        return bookingDate.getFullYear() === date.getFullYear() && 
               bookingDate.getMonth() === date.getMonth()
      }).length,
    }
  }).reverse()

  const maxMonthlyBookings = Math.max(...monthlyBookings.map(m => m.count), 1)

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white shadow-sm border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin"
                className="text-stone-600 hover:text-deep-espresso transition-colors flex items-center space-x-2"
              >
                <ArrowLeft size={18} />
                <span>Назад</span>
              </Link>
              <h1 className="text-2xl font-bold text-deep-espresso">
                Статистика и анализи
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Основни метрики */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 border border-stone-100 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-stone-600 text-sm">Общо резервации</p>
              <Calendar className="text-sage-green" size={20} />
            </div>
            <p className="text-3xl font-bold text-deep-espresso">{totalBookings}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 border border-stone-100 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-stone-600 text-sm">Потвърдени</p>
              <TrendingUp className="text-green-500" size={20} />
            </div>
            <p className="text-3xl font-bold text-green-600">{confirmedBookings}</p>
            <p className="text-xs text-stone-500 mt-1">
              {totalBookings > 0 ? ((confirmedBookings / totalBookings) * 100).toFixed(1) : 0}% от общо
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 border border-stone-100 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-stone-600 text-sm">Заетост</p>
              <Users className="text-blue-500" size={20} />
            </div>
            <p className="text-3xl font-bold text-blue-600">{occupancyRate.toFixed(1)}%</p>
            <p className="text-xs text-stone-500 mt-1">
              {totalBooked}/{totalSpots} места
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 border border-stone-100 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-stone-600 text-sm">Активни класове</p>
              <BarChart3 className="text-purple-500" size={20} />
            </div>
            <p className="text-3xl font-bold text-purple-600">{classes.length}</p>
            <p className="text-xs text-stone-500 mt-1">
              {classes.filter(c => c.spotsBooked < c.spotsTotal).length} с налични места
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Резервации по месеци */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 border border-stone-100 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-deep-espresso mb-4 flex items-center">
              <TrendingUp className="mr-2" size={20} />
              Резервации по месеци
            </h2>
            <div className="space-y-3">
              {monthlyBookings.map((month, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-stone-600">{month.month}</span>
                    <span className="text-sm font-semibold text-deep-espresso">{month.count}</span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(month.count / maxMonthlyBookings) * 100}%` }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      className="bg-sage-green h-2 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Статуси на резервации */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 border border-stone-100 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-deep-espresso mb-4 flex items-center">
              <PieChart className="mr-2" size={20} />
              Статуси на резервации
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-deep-espresso">Потвърдени</span>
                  <span className="text-sm font-semibold text-green-600">{confirmedBookings}</span>
                </div>
                <div className="w-full bg-stone-100 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${totalBookings > 0 ? (confirmedBookings / totalBookings) * 100 : 0}%` }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="bg-green-500 h-3 rounded-full"
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-deep-espresso">Отменени</span>
                  <span className="text-sm font-semibold text-red-600">{cancelledBookings}</span>
                </div>
                <div className="w-full bg-stone-100 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${totalBookings > 0 ? (cancelledBookings / totalBookings) * 100 : 0}%` }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="bg-red-500 h-3 rounded-full"
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-deep-espresso">Лист за изчакване</span>
                  <span className="text-sm font-semibold text-yellow-600">{waitlistBookings}</span>
                </div>
                <div className="w-full bg-stone-100 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${totalBookings > 0 ? (waitlistBookings / totalBookings) * 100 : 0}%` }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="bg-yellow-500 h-3 rounded-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Най-популярни класове */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 border border-stone-100 shadow-sm mb-8"
        >
          <h2 className="text-xl font-semibold text-deep-espresso mb-4 flex items-center">
            <BarChart3 className="mr-2" size={20} />
            Най-популярни класове
          </h2>
          <div className="space-y-3">
            {topClasses.length > 0 ? (
              topClasses.map((item, index) => (
                <div key={item.class.id} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-deep-espresso">{item.class.title}</p>
                    <p className="text-sm text-stone-600">
                      {item.class.day} {item.class.time} • {item.class.instructor}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sage-green">{item.bookings} резервации</p>
                    <p className="text-xs text-stone-500">
                      {item.class.spotsBooked}/{item.class.spotsTotal} места
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-stone-500 text-center py-4">Няма данни</p>
            )}
          </div>
        </motion.div>

        {/* Статистика по дни и инструктори */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl p-6 border border-stone-100 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-deep-espresso mb-4 flex items-center">
              <Calendar className="mr-2" size={20} />
              Резервации по дни
            </h2>
            <div className="space-y-2">
              {Object.entries(bookingsByDay)
                .sort((a, b) => b[1] - a[1])
                .map(([day, count]) => (
                  <div key={day} className="flex justify-between items-center p-2 hover:bg-stone-50 rounded">
                    <span className="text-stone-700">{day}</span>
                    <span className="font-semibold text-deep-espresso">{count}</span>
                  </div>
                ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl p-6 border border-stone-100 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-deep-espresso mb-4 flex items-center">
              <Users className="mr-2" size={20} />
              Резервации по инструктори
            </h2>
            <div className="space-y-2">
              {Object.entries(bookingsByInstructor)
                .sort((a, b) => b[1] - a[1])
                .map(([instructor, count]) => (
                  <div key={instructor} className="flex justify-between items-center p-2 hover:bg-stone-50 rounded">
                    <span className="text-stone-700">{instructor}</span>
                    <span className="font-semibold text-deep-espresso">{count}</span>
                  </div>
                ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
