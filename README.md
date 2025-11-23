# Reformer Pilates Studio Website

Премиум уебсайт за Reformer Pilates студио с интегриран booking график.

## Технологии

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** с персонализирана цветова палитра
- **Framer Motion** за анимации
- **Lucide React** за икони

## Цветова палитра

- **Background**: Warm Alabaster (#F9F8F6)
- **Primary**: Sage Green (#84A98C)
- **Text**: Deep Espresso (#2F3E46)
- **Accent**: Muted Terracotta (#C97D60)
- **Secondary**: Soft Sand (#E8DCC6)

## Инсталация

```bash
# Инсталиране на зависимости
npm install

# Стартиране на development сървъра
npm run dev
```

Отвори [http://localhost:3000](http://localhost:3000) в браузъра.

## Функционалности

- ✅ Elegant Navbar с прозрачен фон, който става твърд при скрол
- ✅ Hero секция с привлекателен заглавен текст
- ✅ Седмичен график с класове, групирани по дни
- ✅ Booking логика:
  - "Waitlist" таг за пълни класове
  - "Само X места остават!" за класове с ≤2 свободни места
  - "Book" бутон за останалите класове
- ✅ Индикатори за интензивност (Low/Medium/High)
- ✅ Responsive дизайн за мобилни устройства
- ✅ Плавни анимации при скрол

## Структура на проекта

```
reformer-pilates-studio/
├── app/
│   ├── globals.css      # Глобални стилове и Tailwind
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Главна страница с всички компоненти
├── package.json
├── tailwind.config.js   # Tailwind конфигурация с цветовата палитра
└── tsconfig.json
```

## Следващи стъпки

1. Свържи проекта с GitHub репо
2. Добави функционалност за реално booking (backend интеграция)
3. Добави страници за "За нас" и контакти
4. Оптимизирай изображения и добави hero изображение

