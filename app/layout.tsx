import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Reformer Pilates Studio | Redefine Your Balance',
  description: 'Premium Reformer Pilates classes for mind and body transformation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="bg">
      <body>{children}</body>
    </html>
  )
}

