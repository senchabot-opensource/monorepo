import { Footer } from '@/components/pages/landing/footer'
import { Header } from '@/components/pages/landing/header'

interface Props {
  children: React.ReactNode
}

export default function LegalLayout({ children }: Props) {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <div className="prose prose-headings:text-foreground mx-auto w-full max-w-screen-lg grow space-y-8 px-4 py-16 text-foreground">
        {children}
      </div>
      <Footer />
    </main>
  )
}
