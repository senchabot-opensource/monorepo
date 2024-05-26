import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(value: string | number | Date): string {
  return new Date(value).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function maskEmail(email: string) {
  const indexOfAt = email.indexOf('@')

  if (indexOfAt < 2) {
    return email
  }

  return email.slice(0, 2) + '*'.repeat(indexOfAt - 2) + email.slice(indexOfAt)
}
