import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number, currency: 'USD' | 'ARS') {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(price)
}

export function formatArea(area: number) {
  return `${area.toLocaleString('es-AR')} m²`
}

export function getWhatsAppUrl(phone: string, message: string) {
  const cleanPhone = phone.replace(/\D/g, '')
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`
}

export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

export function getPropertyUrl(property: { id: string; title: string }) {
  return `/propiedad/${property.id}`
}

export function getDevelopmentUrl(development: { id: string; name: string }) {
  return `/emprendimientos/${development.id}`
}

export function formatDate(date: string | Date) {
  const d = new Date(date)
  return d.toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function formatDateTime(date: string | Date) {
  const d = new Date(date)
  return d.toLocaleString('es-AR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function validateEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhone(phone: string) {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

export function truncateText(text: string, maxLength: number = 100) {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export function capitalizeFirst(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function getOperationLabel(operation: string) {
  const labels = {
    venta: 'Venta',
    alquiler: 'Alquiler',
    temporal: 'Alquiler Temporario'
  }
  return labels[operation as keyof typeof labels] || operation
}

export function getTypeLabel(type: string) {
  const labels = {
    casa: 'Casa',
    departamento: 'Departamento',
    ph: 'PH',
    lote: 'Lote',
    local: 'Local Comercial'
  }
  return labels[type as keyof typeof labels] || type
}

export function getStatusLabel(status: string) {
  const labels = {
    active: 'Activa',
    inactive: 'Inactiva',
    sold: 'Vendida',
    rented: 'Alquilada',
    reserved: 'Reservada'
  }
  return labels[status as keyof typeof labels] || status
}
