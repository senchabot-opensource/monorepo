export default function OverlayLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="size-full min-h-screen bg-transparent">{children}</div>
}
