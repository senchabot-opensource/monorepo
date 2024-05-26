import { CheckCircleIcon, XIcon } from 'lucide-react'

export function Features() {
  return (
    <section id="features" className="bg-secondary/50">
      <div className="mx-auto w-full max-w-screen-lg px-4 py-8">
        <ul className="grid grid-cols-1 justify-center gap-4 py-8 text-3xl font-medium lg:grid-cols-3 lg:text-4xl">
          <li className="inline-flex items-center justify-center space-x-4 lg:justify-start">
            <XIcon className="size-12 shrink-0 text-red-500" />
            <p className="text-nowrap text-muted-foreground lg:text-wrap">
              Download required
            </p>
          </li>
          <li className="inline-flex items-center justify-center space-x-4 lg:justify-start">
            <CheckCircleIcon className="size-12 shrink-0 text-green-500" />
            <p>Free</p>
          </li>
          <li className="inline-flex items-center justify-center space-x-4 lg:justify-start">
            <CheckCircleIcon className="size-12 shrink-0 text-green-500" />
            <p>Open-source</p>
          </li>
        </ul>
      </div>
    </section>
  )
}
