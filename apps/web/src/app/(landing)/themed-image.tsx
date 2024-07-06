'use client'

import { useEffect, useState } from 'react'

import { useTheme } from 'next-themes'
import Image, { type ImageProps } from 'next/image'

interface Props extends Omit<ImageProps, 'src' | 'alt'> {
  darkSrc: string
  lightSrc: string
  alt: string
}

function ThemedImage({ darkSrc, lightSrc, alt, ...props }: Props) {
  const [mounted, setMounted] = useState<boolean>(false)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Image
      src={mounted ? (resolvedTheme === 'dark' ? darkSrc : lightSrc) : lightSrc}
      alt={alt}
      {...props}
    />
  )
}

export { ThemedImage }
