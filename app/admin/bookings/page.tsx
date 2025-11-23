'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, X, Save, ArrowLeft, Calendar, User, Mail, Phone, Clock, CheckCircle, XCircle, List } from 'lucide-react'
import Link from 'next/link'
import { loadBookings, saveBookings, addBooking, updateBooking, deleteBooking, loadClasses, type Booking, type Class } from '@/lib/utils'

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null)
  const [filterStatus, setFilterStatus] = useState<'all' | 'confirmed' | 'cancelled' | 'waitlist'>('all')
  const [formData, setFormData] = useState({
    classId: 0,
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    date: '',
    status: 'confirmed' as 'confirmed' | 'cancelled' | 'waitlist',
    notes: '',
  })

  useEffect(() => {
    setBookings(loadBookings())
    setClasses(loadClasses())
  }, [])

  const handleOpenModal = (booking?: Booking) => {
    if (booking) {
      setEditingBooking(booking)
      setFormData({
        classId: booking.classId,
        clientName: booking.clientName,
        clientEmail: booking.clientEmail,
        clientPhone: booking.clientPhone,
        date: booking.date,
        status: booking.status,
        notes: booking.notes || '',
      })
    } else {
      setEditingBooking(null)
      setFormData({
        classId: classes[0]?.id || 0,
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        date: new Date().toISOString().split('T')[0],
        status: 'confirmed',
        notes: '',
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingBooking(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingBooking) {
      const updated = updateBooking(editingBooking.id, formData)
      if (updated) {
        setBookings(loadBookings())
        handleCloseModal()
      }
    } else {
      const newBooking = addBooking(formData)
      setBookings(loadBookings())
      setClasses(loadClasses())
      handleCloseModal()
    }
  }

  const handleDelete = (id: number) => {
    if (confirm('Сигурни ли сте, че искате да изтриете тази резервация?')) {
      deleteBooking(id)
      setBookings(loadBookings())
      setClasses(loadClasses())
    }
  }

  const filteredBookings = bookings.filter(b => 
    filterStatus === 'all' ? true : b.status === filterStatus
  )

  const getClassInfo = (classId: number) => {
    return classes.find(c => c.id === classId)
  }

  const statusColors = {
    confirmed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    waitlist: 'bg-yellow-100 text-yellow-700',
  }

  const statusIcons = {
    confirmed: CheckCircle,
    cancelled: XCircle,
    waitlist: List,
  }

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
                Управление на резервации
              </h1>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center space-x-2 bg-sage-green text-white px-4 py-2 rounded-xl font-medium hover:bg-sage-green/90 transition-all"
            >
              <Plus size={18} />
              <span>Добави резервация</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Филтри */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {(['all', 'confirmed', 'cancelled', 'waitlist'] as const).map((status) => {
              const StatusIcon = status === 'all' ? List : statusIcons[status]
              return (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all ${
                    filterStatus === status
                      ? 'bg-sage-green text-white'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  <StatusIcon size={16} />
                  <span>
                    {status === 'all' ? 'Всички' : 
                     status === 'confirmed' ? 'Потвърдени' :
                     status === 'cancelled' ? 'Отменени' : 'Лист за изчакване'}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-stone-100">
            <p className="text-stone-600 text-sm mb-1">Общо резервации</p>
            <p className="text-2xl font-bold text-deep-espresso">{bookings.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-stone-100">
            <p className="text-stone-600 text-sm mb-1">Потвърдени</p>
            <p className="text-2xl font-bold text-green-600">
              {bookings.filter(b => b.status === 'confirmed').length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-stone-100">
            <p className="text-stone-600 text-sm mb-1">Отменени</p>
            <p className="text-2xl font-bold text-red-600">
              {bookings.filter(b => b.status === 'cancelled').length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-stone-100">
            <p className="text-stone-600 text-sm mb-1">Лист за изчакване</p>
            <p className="text-2xl font-bold text-yellow-600">
              {bookings.filter(b => b.status === 'waitlist').length}
            </p>
          </div>
        </div>

        {/* Списък с резервации */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-12 text-center">
            <Calendar className="mx-auto text-stone-400 mb-4" size={48} />
            <p className="text-stone-600 text-lg">Няма резервации</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((booking) => {
                const classInfo = getClassInfo(booking.classId)
                const StatusIcon = statusIcons[booking.status]
                
                return (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-sm border border-stone-100 p-6"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-xl font-semibold text-deep-espresso">
                            {booking.clientName}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${statusColors[booking.status]}`}>
                            <StatusIcon size={14} />
                            <span>
                              {booking.status === 'confirmed' ? 'Потвърдена' :
                               booking.status === 'cancelled' ? 'Отменена' : 'Лист за изчакване'}
                            </span>
                          </span>
                        </div>
                        
                        {classInfo && (
                          <div className="flex items-center space-x-2 text-stone-600 mb-2">
                            <Calendar size={16} />
                            <span className="font-medium">{classInfo.title}</span>
                            <span className="text-stone-400">•</span>
                            <span>{classInfo.day} {classInfo.time}</span>
                            <span className="text-stone-400">•</span>
                            <span>{booking.date}</span>
                          </div>
                        )}
                        
                        <div className="flex flex-wrap gap-4 text-sm text-stone-600">
                          <div className="flex items-center space-x-2">
                            <Mail size={14} />
                            <span>{booking.clientEmail}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone size={14} />
                            <span>{booking.clientPhone}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock size={14} />
                            <span>{new Date(booking.createdAt).toLocaleString('bg-BG')}</span>
                          </div>
                        </div>
                        
                        {booking.notes && (
                          <p className="mt-2 text-sm text-stone-600 italic">
                            Бележка: {booking.notes}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleOpenModal(booking)}
                          className="flex items-center space-x-1 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                        >
                          <Edit2 size={14} />
                          <span>Редактирай</span>
                        </button>
                        <button
                          onClick={() => handleDelete(booking.id)}
                          className="flex items-center space-x-1 bg-red-50 text-red-700 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                        >
                          <Trash2 size={14} />
                          <span>Изтрий</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
          </div>
        )}
      </main>

      {/* Modal за добавяне/редактиране */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-stone-200 px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-deep-espresso">
                  {editingBooking ? 'Редактиране на резервация' : 'Добавяне на резервация'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-stone-400 hover:text-stone-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-deep-espresso mb-2">
                    Клас
                  </label>
                  <select
                    value={formData.classId}
                    onChange={(e) => setFormData({ ...formData, classId: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-sage-green text-deep-espresso bg-white"
                    required
                  >
                    <option value={0}>Избери клас</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.day} {cls.time} - {cls.title} ({cls.instructor})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-deep-espresso mb-2">
                      Име на клиент
                    </label>
                    <input
                      type="text"
                      value={formData.clientName}
                      onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-sage-green text-deep-espresso bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-deep-espresso mb-2">
                      Дата на класа
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-sage-green text-deep-espresso bg-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-deep-espresso mb-2">
                      Имейл
                    </label>
                    <input
                      type="email"
                      value={formData.clientEmail}
                      onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-sage-green text-deep-espresso bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-deep-espresso mb-2">
                      Телефон
                    </label>
                    <input
                      type="tel"
                      value={formData.clientPhone}
                      onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-sage-green text-deep-espresso bg-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-deep-espresso mb-2">
                    Статус
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'confirmed' | 'cancelled' | 'waitlist' })}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-sage-green text-deep-espresso bg-white"
                    required
                  >
                    <option value="confirmed">Потвърдена</option>
                    <option value="waitlist">Лист за изчакване</option>
                    <option value="cancelled">Отменена</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-deep-espresso mb-2">
                    Бележки (опционално)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-sage-green text-deep-espresso bg-white"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-4 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-6 py-3 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 transition-colors font-medium"
                  >
                    Отказ
                  </button>
                  <button
                    type="submit"
                    className="flex items-center space-x-2 bg-sage-green text-white px-6 py-3 rounded-xl font-medium hover:bg-sage-green/90 transition-all"
                  >
                    <Save size={18} />
                    <span>{editingBooking ? 'Запази промените' : 'Добави резервация'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
