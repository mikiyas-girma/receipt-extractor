import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import { Toaster } from "@/components/ui/sonner" // updated import
import { ApolloWrapper } from "@/components/apollo-wrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Receipt Extractor",
  description: "Upload receipt images and extract data using OCR",
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
            <header className="border-b">
              <div className="container mx-auto px-4 py-4">
                <h1 className="text-2xl font-bold"> - Receipt Extractor -</h1>
              </div>
            </header>
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
          </div>
          <Toaster richColors />
        </ApolloWrapper>
      </body>
    </html>
  )
}
