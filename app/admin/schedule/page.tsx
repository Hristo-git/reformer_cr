'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, X, Save, Calendar, Clock, Users, Activity } from 'lucide-react'
import Link from 'next/link'
import { loadClasses, saveClasses, addClass, updateClass, deleteClass, type Class } from '@/lib/utils'

export default function ScheduleManagementPage() {
  const [classes, setClasses] = useState<Class[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingClass, setEditingClass] = useState<Class | null>(null)
  const [formData, setFormData] = useState({
    day: 'Понеделник',
    time: '',
    title: '',
    instructor: '',
    spotsTotal: 12,
    spotsBooked: 0,
    intensity: 'Low' as 'Low' | 'Medium' | 'High',
  })

  useEffect(() => {
    setClasses(loadClasses())
  }, [])

  const handleOpenModal = (cls?: Class) => {
    if (cls) {
      setEditingClass(cls)
      setFormData({
        day: cls.day,
        time: cls.time,
        title: cls.title,
        instructor: cls.instructor,
        spotsTotal: cls.spotsTotal,
        spotsBooked: cls.spotsBooked,
        intensity: cls.intensity,
      })
    } else {
      setEditingClass(null)
      setFormData({
        day: 'Понеделник',
        time: '',
        title: '',
        instructor: '',
        spotsTotal: 12,
        spotsBooked: 0,
        intensity: 'Low',
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingClass(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingClass) {
      // Обновяване на съществуващ клас
      const updated = updateClass(editingClass.id, formData)
      if (updated) {
        setClasses(loadClasses())
        handleCloseModal()
      }
    } else {
      // Добавяне на нов клас
      const newClass = addClass(formData)
      setClasses(loadClasses())
      handleCloseModal()
    }
  }

  const handleDelete = (id: number) => {
    if (confirm('Сигурни ли сте, че искате да изтриете този клас?')) {
      deleteClass(id)
      setClasses(loadClasses())
    }
  }

  const dayOrder = ['Понеделник', 'Вторник', 'Сряда', 'Четвъртък', 'Петък', 'Събота', 'Неделя']
  const groupedClasses = classes.reduce((acc, cls) => {
    if (!acc[cls.day]) acc[cls.day] = []
    acc[cls.day].push(cls)
    return acc
  }, {} as { [key: string]: Class[] })

  const intensityColors = {
    Low: 'bg-emerald-100 text-emerald-700',
    Medium: 'bg-amber-100 text-amber-700',
    High: 'bg-red-100 text-red-700',
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin"
                className="text-stone-600 hover:text-deep-espresso transition-colors"
              >
                ← Назад
              </Link>
              <h1 className="text-2xl font-bold text-deep-espresso">
                Управление на график
              </h1>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center space-x-2 bg-sage-green text-white px-4 py-2 rounded-xl font-medium hover:bg-sage-green/90 transition-all"
            >
              <Plus size={18} />
              <span>Добави клас</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {classes.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto text-stone-400 mb-4" size={48} />
            <p className="text-stone-600 text-lg">Няма добавени класове</p>
            <button
              onClick={() => handleOpenModal()}
              className="mt-4 bg-sage-green text-white px-6 py-3 rounded-xl font-medium hover:bg-sage-green/90 transition-all"
            >
              Добави първи клас
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {dayOrder.map((day) => {
              const dayClasses = groupedClasses[day] || []
              if (dayClasses.length === 0) return null

              return (
                <motion.div
                  key={day}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6"
                >
                  <div className="flex items-center mb-4">
                    <Calendar className="text-sage-green mr-3" size={24} />
                    <h2 className="text-2xl font-semibold text-deep-espresso">{day}</h2>
                    <span className="ml-4 text-stone-500 text-sm">
                      ({dayClasses.length} клас{dayClasses.length !== 1 ? 'а' : ''})
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dayClasses.map((cls) => (
                      <div
                        key={cls.id}
                        className="border border-stone-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center space-x-2 text-sage-green">
                            <Clock size={16} />
                            <span className="font-semibold">{cls.time}</span>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${intensityColors[cls.intensity]}`}
                          >
                            {cls.intensity}
                          </span>
                        </div>

                        <h3 className="text-lg font-semibold text-deep-espresso mb-2">
                          {cls.title}
                        </h3>
                        <p className="text-stone-600 text-sm mb-3 flex items-center">
                          <Users size={14} className="mr-2" />
                          {cls.instructor}
                        </p>
                        <p className="text-stone-500 text-sm mb-4">
                          {cls.spotsBooked}/{cls.spotsTotal} места заети
                        </p>

                        <div className="flex space-x-2 pt-3 border-t border-stone-100">
                          <button
                            onClick={() => handleOpenModal(cls)}
                            className="flex-1 flex items-center justify-center space-x-1 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                          >
                            <Edit2 size={14} />
                            <span>Редактирай</span>
                          </button>
                          <button
                            onClick={() => handleDelete(cls.id)}
                            className="flex-1 flex items-center justify-center space-x-1 bg-red-50 text-red-700 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                          >
                            <Trash2 size={14} />
                            <span>Изтрий</span>
                          </button>
                        </div>
                      </div>
                    ))}
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
                  {editingClass ? 'Редактиране на клас' : 'Добавяне на нов клас'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-stone-400 hover:text-stone-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-deep-espresso mb-2">
                      Ден от седмицата
                    </label>
                    <select
                      value={formData.day}
                      onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-sage-green text-deep-espresso bg-white"
                      required
                    >
                      {dayOrder.map((day) => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-deep-espresso mb-2">
                      Час
                    </label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-sage-green text-deep-espresso bg-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-deep-espresso mb-2">
                    Заглавие на класа
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-sage-green text-deep-espresso bg-white placeholder-stone-400"
                    placeholder="Например: Morning Flow"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-deep-espresso mb-2">
                    Инструктор
                  </label>
                  <input
                    type="text"
                    value={formData.instructor}
                    onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-sage-green text-deep-espresso bg-white placeholder-stone-400"
                    placeholder="Име на инструктора"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-deep-espresso mb-2">
                      Общо места
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.spotsTotal}
                      onChange={(e) => setFormData({ ...formData, spotsTotal: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-sage-green text-deep-espresso bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-deep-espresso mb-2">
                      Заети места
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={formData.spotsTotal}
                      value={formData.spotsBooked}
                      onChange={(e) => setFormData({ ...formData, spotsBooked: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-sage-green text-deep-espresso bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-deep-espresso mb-2">
                      Интензитет
                    </label>
                    <select
                      value={formData.intensity}
                      onChange={(e) => setFormData({ ...formData, intensity: e.target.value as 'Low' | 'Medium' | 'High' })}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-sage-green text-deep-espresso bg-white"
                      required
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
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
                    <span>{editingClass ? 'Запази промените' : 'Добави клас'}</span>
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
