// Componente do Servidor

import './globals.css'

import { Inter } from 'next/font/google'

import { ClerkProvider } from '@clerk/nextjs'
import { ptBR } from "@clerk/localizations";

import { ModalProvider } from '@/providers/modalProvider';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ZoneTech',
  description: 'Site E-Commerce chamado ZoneTech inspirado na Kabum!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider localization={ptBR}>
      <html lang="pt-BR">
        <body className={inter.className}>
          <ModalProvider />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
