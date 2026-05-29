import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function toNumber(value: number | string | null | undefined) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0
  if (typeof value === 'string') {
    const number = Number(value.replace(/,/g, '').trim())
    return Number.isFinite(number) ? number : 0
  }
  return 0
}

export function formatCurrency(amount: number | string | null | undefined) {
  return `GH₵ ${toNumber(amount).toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-GH', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

export function generateSaleRef() {
  const num = Math.floor(1000 + Math.random() * 9000)
  return `SK-${num}`
}
