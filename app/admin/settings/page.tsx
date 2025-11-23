'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Building2, Clock, Mail, Phone, FileText } from 'lucide-react'
import Link from 'next/link'
import { loadSettings, saveSettings, type StudioSettings } from '@/lib/utils'

export default function SettingsPage() {
  const [settings, setSettings] = useState<StudioSettings | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  useEffect(() => {
    setSettings(loadSettings())
  }, [])

  const handleChange = (field: keyof StudioSettings, value: any) => {
    if (!settings) return
    setSettings({ ...settings, [field]: value })
  }

  const handleWorkingHoursChange = (day: string, field: 'open' | 'close', value: string) => {
    if (!settings) return
    const newWorkingHours = { ...settings.workingHours }
    if (!newWorkingHours[day]) {
      newWorkingHours[day] = { open: '08:00', close: '20:00' }
    }
    newWorkingHours[day] = {
      ...newWorkingHours[day]!,
      [field]: value,
    }
    setSettings({ ...settings, workingHours: newWorkingHours })
  }

  const handleWorkingHoursToggle = (day: string) => {
    if (!settings) return
    const newWorkingHours = { ...settings.workingHours }
    if (newWorkingHours[day]) {
      newWorkingHours[day] = null
    } else {
      newWorkingHours[day] = { open: '08:00', close: '20:00' }
    }
    setSettings({ ...settings, workingHours: newWorkingHours })
  }

  const handleSave = () => {
    if (!settings) return
    
    setIsSaving(true)
    saveSettings(settings)
    
    setTimeout(() => {
      setIsSaving(false)
      setSaveMessage('Настройките са запазени успешно!')
      setTimeout(() => setSaveMessage(''), 3000)
    }, 500)
  }

  if (!settings) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <p className="text-stone-600">Зареждане...</p>
      </div>
    )
  }

  const dayOrder = ['Понеделник', 'Вторник', 'Сряда', 'Четвъртък', 'Петък', 'Събота', 'Неделя']

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
                Настройки на студиото
              </h1>
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center space-x-2 bg-sage-green text-white px-6 py-2 rounded-xl font-medium hover:bg-sage-green/90 transition-all disabled:opacity-50"
            >
              <Save size={18} />
              <span>{isSaving ? 'Запазване...' : 'Запази'}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {saveMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl mb-6"
          >
            {saveMessage}
          </motion.div>
        )}

        <div className="space-y-6">
          {/* Основна информация */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 border border-stone-100 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-deep-espresso mb-4 flex items-center">
              <Building2 className="mr-2" size={20} />
              Основна информация
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-deep-espresso mb-2">
                  Име на студиото
                </label>
                <input
                  type="text"
                  value={settings.studioName}
                  onChange={(e) => handleChange('studioName', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-sage-green text-deep-espresso bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-deep-espresso mb-2">
                  Адрес
                </label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-sage-green text-deep-espresso bg-white"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-deep-espresso mb-2 flex items-center">
                    <Phone className="mr-2" size={16} />
                    Телефон
                  </label>
                  <input
                    type="tel"
                    value={settings.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-sage-green text-deep-espresso bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-deep-espresso mb-2 flex items-center">
                    <Mail className="mr-2" size={16} />
                    Имейл
                  </label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-sage-green text-deep-espresso bg-white"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Работно време */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 border border-stone-100 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-deep-espresso mb-4 flex items-center">
              <Clock className="mr-2" size={20} />
              Работно време
            </h2>
            <div className="space-y-3">
              {dayOrder.map((day) => {
                const isOpen = settings.workingHours[day] !== null
                return (
                  <div key={day} className="flex items-center space-x-4 p-3 bg-stone-50 rounded-lg">
                    <div className="flex items-center space-x-2 flex-1">
                      <input
                        type="checkbox"
                        checked={isOpen}
                        onChange={() => handleWorkingHoursToggle(day)}
                        className="w-4 h-4 text-sage-green rounded focus:ring-sage-green"
                      />
                      <span className="font-medium text-deep-espresso w-24">{day}</span>
                    </div>
                    {isOpen ? (
                      <div className="flex items-center space-x-2 flex-1">
                        <input
                          type="time"
                          value={settings.workingHours[day]?.open || '08:00'}
                          onChange={(e) => handleWorkingHoursChange(day, 'open', e.target.value)}
                          className="px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-sage-green text-deep-espresso bg-white"
                        />
                        <span className="text-stone-500">до</span>
                        <input
                          type="time"
                          value={settings.workingHours[day]?.close || '20:00'}
                          onChange={(e) => handleWorkingHoursChange(day, 'close', e.target.value)}
                          className="px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-sage-green text-deep-espresso bg-white"
                        />
                      </div>
                    ) : (
                      <span className="text-stone-400 text-sm">Затворено</span>
                    )}
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* Политики */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 border border-stone-100 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-deep-espresso mb-4 flex items-center">
              <FileText className="mr-2" size={20} />
              Политики и правила
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-deep-espresso mb-2">
                  Политика за отменяне
                </label>
                <textarea
                  value={settings.cancellationPolicy}
                  onChange={(e) => handleChange('cancellationPolicy', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-sage-green text-deep-espresso bg-white"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-deep-espresso mb-2">
                    Максимални дни напред за резервация
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={settings.maxBookingDaysInAdvance}
                    onChange={(e) => handleChange('maxBookingDaysInAdvance', parseInt(e.target.value) || 30)}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-sage-green text-deep-espresso bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-deep-espresso mb-2">
                    Минимални часове напред за резервация
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={settings.minBookingHoursInAdvance}
                    onChange={(e) => handleChange('minBookingHoursInAdvance', parseInt(e.target.value) || 2)}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-sage-green text-deep-espresso bg-white"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Бутон за запазване в долу */}
          <div className="flex justify-end pt-4">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center space-x-2 bg-sage-green text-white px-8 py-3 rounded-xl font-medium hover:bg-sage-green/90 transition-all disabled:opacity-50"
            >
              <Save size={18} />
              <span>{isSaving ? 'Запазване...' : 'Запази всички настройки'}</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
