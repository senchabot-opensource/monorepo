import { Sidebar } from '@/components/pages/dashboard/sidebar'

interface Props {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: Props) {
  return (
    <div className="relative mx-auto flex h-screen w-full max-w-screen-xl">
      <Sidebar />
      <main className="ml-64 grow px-8 py-6">{children}</main>
    </div>
  )
}
