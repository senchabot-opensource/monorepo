interface Props {
  platform: Platform
  id: string
}

export function OverviewView({ platform, id }: Props) {
  console.log('OverviewView => ', { platform, id })

  return (
    <div className="max-w-screen-lg space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-medium tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </p>
      </div>
      <div></div>
    </div>
  )
}
