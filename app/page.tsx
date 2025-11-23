'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, Users, Activity, Menu, X } from 'lucide-react'

// Mock data за класовете
const classes = [
  {
    id: 1,
    day: 'Понеделник',
    time: '09:00',
    title: 'Morning Flow',
    instructor: 'Мария Петрова',
    spotsTotal: 12,
    spotsBooked: 10,
    intensity: 'Low' as const,
  },
  {
    id: 2,
    day: 'Понеделник',
    time: '18:00',
    title: 'Power Reformer',
    instructor: 'Иван Димитров',
    spotsTotal: 10,
    spotsBooked: 8,
    intensity: 'High' as const,
  },
  {
    id: 3,
    day: 'Вторник',
    time: '10:30',
    title: 'Gentle Stretch',
    instructor: 'Анна Георгиева',
    spotsTotal: 12,
    spotsBooked: 12,
    intensity: 'Low' as const,
  },
  {
    id: 4,
    day: 'Вторник',
    time: '19:00',
    title: 'Intermediate Reformer',
    instructor: 'Петър Стоянов',
    spotsTotal: 10,
    spotsBooked: 9,
    intensity: 'Medium' as const,
  },
  {
    id: 5,
    day: 'Сряда',
    time: '08:00',
    title: 'Sunrise Pilates',
    instructor: 'Мария Петрова',
    spotsTotal: 12,
    spotsBooked: 11,
    intensity: 'Low' as const,
  },
  {
    id: 6,
    day: 'Сряда',
    time: '17:30',
    title: 'Advanced Flow',
    instructor: 'Иван Димитров',
    spotsTotal: 8,
    spotsBooked: 6,
    intensity: 'High' as const,
  },
  {
    id: 7,
    day: 'Четвъртък',
    time: '11:00',
    title: 'Restorative Reformer',
    instructor: 'Анна Георгиева',
    spotsTotal: 12,
    spotsBooked: 5,
    intensity: 'Low' as const,
  },
  {
    id: 8,
    day: 'Четвъртък',
    time: '18:30',
    title: 'Evening Balance',
    instructor: 'Петър Стоянов',
    spotsTotal: 10,
    spotsBooked: 10,
    intensity: 'Medium' as const,
  },
  {
    id: 9,
    day: 'Петък',
    time: '09:30',
    title: 'Weekend Prep',
    instructor: 'Мария Петрова',
    spotsTotal: 12,
    spotsBooked: 4,
    intensity: 'Medium' as const,
  },
  {
    id: 10,
    day: 'Събота',
    time: '10:00',
    title: 'Saturday Strength',
    instructor: 'Иван Димитров',
    spotsTotal: 10,
    spotsBooked: 8,
    intensity: 'High' as const,
  },
]

// Групиране на класовете по дни
const groupClassesByDay = () => {
  const grouped: { [key: string]: typeof classes } = {}
  classes.forEach((cls) => {
    if (!grouped[cls.day]) {
      grouped[cls.day] = []
    }
    grouped[cls.day].push(cls)
  })
  return grouped
}

// Navbar компонент
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-warm-alabaster/95 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <h1 className="text-2xl font-semibold text-deep-espresso tracking-tight">
              Reformer Studio
            </h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#schedule" className="text-deep-espresso hover:text-sage-green transition-colors">
              График
            </a>
            <a href="#about" className="text-deep-espresso hover:text-sage-green transition-colors">
              За нас
            </a>
            <button className="bg-sage-green text-white px-6 py-2.5 rounded-2xl font-medium hover:bg-sage-green/90 transition-all shadow-sm">
              Book Now
            </button>
          </div>

          <button
            className="md:hidden text-deep-espresso"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-warm-alabaster/95 backdrop-blur-md border-t border-stone-200">
          <div className="px-4 py-4 space-y-4">
            <a href="#schedule" className="block text-deep-espresso hover:text-sage-green">
              График
            </a>
            <a href="#about" className="block text-deep-espresso hover:text-sage-green">
              За нас
            </a>
            <button className="w-full bg-sage-green text-white px-6 py-2.5 rounded-2xl font-medium">
              Book Now
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

// Hero секция
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-4xl mx-auto"
      >
        <h1 className="text-5xl md:text-7xl font-bold text-deep-espresso mb-6 tracking-tight">
          Redefine Your Balance
        </h1>
        <p className="text-xl md:text-2xl text-stone-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Премиум Reformer Pilates класове, които трансформират тялото и ума
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-sage-green text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-sage-green/90 transition-all shadow-md"
        >
          Започни сега
        </motion.button>
      </motion.div>
    </section>
  )
}

// Class Card компонент
function ClassCard({ cls }: { cls: typeof classes[0] }) {
  const spotsAvailable = cls.spotsTotal - cls.spotsBooked
  const isWaitlist = spotsAvailable === 0
  const isUrgent = spotsAvailable <= 2 && spotsAvailable > 0

  const intensityColors = {
    Low: 'bg-emerald-100 text-emerald-700',
    Medium: 'bg-amber-100 text-amber-700',
    High: 'bg-red-100 text-red-700',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-stone-100"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2 text-sage-green">
          <Clock size={18} />
          <span className="font-semibold text-lg">{cls.time}</span>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${intensityColors[cls.intensity]}`}
        >
          {cls.intensity}
        </span>
      </div>

      <h3 className="text-xl font-semibold text-deep-espresso mb-2">{cls.title}</h3>
      <p className="text-stone-600 mb-4 flex items-center">
        <Users size={16} className="mr-2" />
        {cls.instructor}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-stone-100">
        <div className="flex items-center text-sm text-stone-500">
          <Users size={16} className="mr-1" />
          <span>
            {cls.spotsBooked}/{cls.spotsTotal} места
          </span>
        </div>

        {isWaitlist ? (
          <span className="px-4 py-2 rounded-2xl bg-muted-terracotta/10 text-muted-terracotta font-medium text-sm">
            Waitlist
          </span>
        ) : isUrgent ? (
          <div className="flex flex-col items-end">
            <span className="text-red-600 text-xs font-medium mb-1">
              Само {spotsAvailable} места остават!
            </span>
            <button className="bg-sage-green text-white px-6 py-2 rounded-2xl font-medium hover:bg-sage-green/90 transition-all text-sm">
              Book
            </button>
          </div>
        ) : (
          <button className="bg-sage-green text-white px-6 py-2 rounded-2xl font-medium hover:bg-sage-green/90 transition-all text-sm">
            Book
          </button>
        )}
      </div>
    </motion.div>
  )
}

// Schedule секция
function Schedule() {
  const groupedClasses = groupClassesByDay()
  const dayOrder = ['Понеделник', 'Вторник', 'Сряда', 'Четвъртък', 'Петък', 'Събота', 'Неделя']

  return (
    <section id="schedule" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-deep-espresso mb-4">
            Седмичен график
          </h2>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto">
            Избери перфектния клас за теб
          </p>
        </motion.div>

        <div className="space-y-12">
          {dayOrder.map((day) => {
            if (!groupedClasses[day]) return null

            return (
              <motion.div
                key={day}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center mb-6">
                  <Calendar className="text-sage-green mr-3" size={24} />
                  <h3 className="text-2xl font-semibold text-deep-espresso">{day}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupedClasses[day].map((cls) => (
                    <ClassCard key={cls.id} cls={cls} />
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Главна страница
export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Schedule />
    </main>
  )
}

