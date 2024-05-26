import { Features } from '@/components/pages/landing/features'
import { Footer } from '@/components/pages/landing/footer'
import { Header } from '@/components/pages/landing/header'
import { Hero } from '@/components/pages/landing/hero'

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <Hero />
      <Features />
      <Footer />
    </main>
  )
}
