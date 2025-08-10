import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number, currency: 'USD' | 'ARS' = 'USD') {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency,
    minimumFractionDigits: currency === 'USD' ? 0 : 0,
    maximumFractionDigits: currency === 'USD' ? 0 : 0,
  }).format(amount)
}

export function formatArea(area: number) {
  return `${area} m²`
}

export function formatRooms(rooms: number) {
  return rooms === 1 ? '1 ambiente' : `${rooms} ambientes`
}

export function getWhatsAppUrl(phone: string, message: string) {
  const cleanPhone = phone.replace(/\D/g, '')
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/549${cleanPhone}?text=${encodedMessage}`
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}
