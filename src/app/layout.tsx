import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { ReactNode } from 'react'
import Navbar from '../components/Navbar'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Navbar />
          <main className="p-4">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  )
}
