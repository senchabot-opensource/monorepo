import { Toaster } from '@/components/ui/sonner'
import { TopLoader } from '@/components/ui/top-loader'

import { Sidebar } from './_sidebar/sidebar'

interface Props {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: Props) {
  return (
    <>
      <TopLoader />
      <div className="relative mx-auto flex h-screen w-full max-w-screen-xl">
        <Sidebar />
        <main className="ml-64 grow px-8 py-6">{children}</main>
        <Toaster position="top-center" duration={1500} />
      </div>
    </>
  )
}
