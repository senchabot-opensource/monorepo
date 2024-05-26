'use client'

import { useEffect, useState } from 'react'

import { useTheme } from 'next-themes'

import { MoonIcon, SunIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface Props extends React.HTMLAttributes<HTMLButtonElement> {}

export function ThemeToggle({ ...props }: Props) {
  const [mounted, setMounted] = useState<boolean>(false)
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => {
        switch (resolvedTheme) {
          case 'dark':
            setTheme('light')
            break
          case 'light':
            setTheme('dark')
            break
        }
      }}
      {...props}
    >
      {resolvedTheme === 'dark' ? (
        <MoonIcon className="size-4" />
      ) : (
        <SunIcon className="size-4" />
      )}
    </Button>
  )
}
