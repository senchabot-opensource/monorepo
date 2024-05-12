interface Props {
  tabs: React.ReactNode
}

export default function SettingsLayout({ tabs }: Props) {
  return (
    <div className="max-w-screen-sm space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-medium tracking-tight">
          Account Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </p>
      </div>
      {tabs}
    </div>
  )
}
