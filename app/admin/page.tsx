'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Settings, Users, BarChart3, LogOut, Menu, X, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Проста автентикация с парола (в production трябва да се използва proper auth)
  useEffect(() => {
    const auth = localStorage.getItem('admin_authenticated')
    if (auth === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // В production трябва да се използва proper authentication
    if (password === 'admin123') {
      localStorage.setItem('admin_authenticated', 'true')
      setIsAuthenticated(true)
    } else {
      alert('Грешна парола!')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated')
    setIsAuthenticated(false)
    setPassword('')
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-50 to-stone-100 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full"
        >
          <h1 className="text-3xl font-bold text-deep-espresso mb-2 text-center">
            Административен панел
          </h1>
          <p className="text-stone-600 mb-6 text-center">
            Моля, въведете парола за достъп
          </p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-deep-espresso mb-2">
                Парола
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-stone-400 focus:outline-none focus:ring-2 focus:ring-sage-green focus:border-sage-green text-deep-espresso text-lg font-medium placeholder-stone-400 bg-white"
                  placeholder="Въведете парола"
                  required
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-600 hover:text-deep-espresso transition-colors p-1"
                  aria-label={showPassword ? 'Скрий парола' : 'Покажи парола'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {password.length > 0 && (
                <p className="text-xs text-stone-500 mt-1">
                  Въведени символи: {password.length}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-sage-green text-white px-6 py-3 rounded-xl font-semibold hover:bg-sage-green/90 transition-all"
            >
              Вход
            </button>
          </form>
          <p className="text-xs text-stone-500 mt-4 text-center">
            Тестова парола: admin123
          </p>
        </motion.div>
      </div>
    )
  }

  const adminMenuItems = [
    {
      title: 'Управление на график',
      description: 'Добавяне, редактиране и изтриване на класове',
      icon: Calendar,
      href: '/admin/schedule',
      color: 'bg-blue-500',
    },
    {
      title: 'Резервации',
      description: 'Преглед и управление на резервации',
      icon: Users,
      href: '/admin/bookings',
      color: 'bg-green-500',
    },
    {
      title: 'Статистика',
      description: 'Анализ и отчети за посещаемост',
      icon: BarChart3,
      href: '/admin/statistics',
      color: 'bg-purple-500',
    },
    {
      title: 'Настройки',
      description: 'Конфигурация на студиото',
      icon: Settings,
      href: '/admin/settings',
      color: 'bg-amber-500',
    },
  ]

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-deep-espresso">
                Административен панел
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-stone-600 hover:text-deep-espresso transition-colors"
              >
                Към сайта
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-stone-600 hover:text-red-600 transition-colors"
              >
                <LogOut size={18} />
                <span>Изход</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-deep-espresso mb-2">
            Добре дошли!
          </h2>
          <p className="text-stone-600">
            Изберете секция за управление
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {adminMenuItems.map((item, index) => {
            const Icon = item.icon
            return (
              <Link key={index} href={item.href}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-stone-100 cursor-pointer"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`${item.color} p-3 rounded-xl text-white`}>
                      <Icon size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-deep-espresso mb-2">
                        {item.title}
                      </h3>
                      <p className="text-stone-600 text-sm">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </Link>
            )
          })}
        </div>
      </main>
    </div>
  )
}
