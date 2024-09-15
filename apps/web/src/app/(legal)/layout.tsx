interface Props {
  children: React.ReactNode
}

export default function LegalLayout({ children }: Props) {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="prose mx-auto w-full max-w-screen-lg grow space-y-8 px-4 py-16 text-foreground prose-headings:text-foreground">
        {children}
      </div>
    </main>
  )
}
