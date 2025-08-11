import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { ApolloWrapper } from "@/components/apollo-wrapper"
import { MainNavigation } from "@/components/main-navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Receipt Extractor - Upload & Process Receipts",
  description: "Upload receipt images and extract data using OCR technology",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ApolloWrapper>
          <div className="min-h-screen bg-background">
            <MainNavigation />
            <header className="border-b">
            </header>
            <main className="container mx-auto px-4 py-8">{children}</main>
          </div>
          <Toaster richColors />
        </ApolloWrapper>
      </body>
    </html>
  )
}
