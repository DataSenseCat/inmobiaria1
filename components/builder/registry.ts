'use client'

import { Builder } from '@builder.io/react'
import dynamic from 'next/dynamic'

// Dynamically import components to avoid SSR issues
const PropertyGrid = dynamic(() => import('../properties/PropertyGrid'), { ssr: false })
const PropertyCard = dynamic(() => import('../properties/PropertyCard'), { ssr: false })
const FiltersBar = dynamic(() => import('../properties/FiltersBar'), { ssr: false })
const Hero = dynamic(() => import('../ui/Hero'), { ssr: false })
const Callout = dynamic(() => import('../ui/Callout'), { ssr: false })

export function registerBuilderComponents() {
  // Only register if Builder is initialized and we have a valid API key
  const apiKey = process.env.NEXT_PUBLIC_BUILDER_API_KEY
  if (typeof window !== 'undefined' && apiKey && apiKey !== 'REEMPLAZAR_CON_TU_PUBLIC_API_KEY' && Builder.isEditing) {
    
    // Register PropertyGrid component
    Builder.registerComponent(PropertyGrid, {
      name: 'PropertyGrid',
      friendlyName: 'Grilla de Propiedades',
      description: 'Muestra una grilla de propiedades con filtros',
      inputs: [
        {
          name: 'operation',
          friendlyName: 'Operación',
          type: 'enum',
          enum: ['', 'venta', 'alquiler'],
          defaultValue: '',
          helperText: 'Filtrar por tipo de operación'
        },
        {
          name: 'type',
          friendlyName: 'Tipo de Propiedad',
          type: 'enum',
          enum: ['', 'casa', 'departamento', 'ph', 'lote', 'local'],
          defaultValue: '',
          helperText: 'Filtrar por tipo de propiedad'
        },
        {
          name: 'city',
          friendlyName: 'Ciudad',
          type: 'string',
          defaultValue: '',
          helperText: 'Filtrar por ciudad'
        },
        {
          name: 'maxUsd',
          friendlyName: 'Precio Máximo (USD)',
          type: 'number',
          helperText: 'Precio máximo en dólares'
        },
        {
          name: 'featuredOnly',
          friendlyName: 'Solo Destacadas',
          type: 'boolean',
          defaultValue: false,
          helperText: 'Mostrar solo propiedades destacadas'
        },
        {
          name: 'pageSize',
          friendlyName: 'Propiedades por Página',
          type: 'number',
          defaultValue: 12,
          helperText: 'Cantidad de propiedades a mostrar'
        },
        {
          name: 'title',
          friendlyName: 'Título de la Sección',
          type: 'string',
          defaultValue: 'Propiedades Disponibles'
        },
        {
          name: 'className',
          friendlyName: 'Clases CSS Personalizadas',
          type: 'string',
          defaultValue: ''
        }
      ]
    })

    // Register PropertyCard component
    Builder.registerComponent(PropertyCard, {
      name: 'PropertyCard',
      friendlyName: 'Tarjeta de Propiedad',
      description: 'Tarjeta individual de propiedad',
      inputs: [
        {
          name: 'propertyId',
          friendlyName: 'ID de la Propiedad',
          type: 'string',
          required: true,
          helperText: 'UUID de la propiedad a mostrar'
        },
        {
          name: 'showPrice',
          friendlyName: 'Mostrar Precio',
          type: 'boolean',
          defaultValue: true
        },
        {
          name: 'showAmenities',
          friendlyName: 'Mostrar Amenidades',
          type: 'boolean',
          defaultValue: true,
          helperText: 'Mostrar habitaciones, baños, área'
        },
        {
          name: 'showWhatsAppButton',
          friendlyName: 'Mostrar Botón WhatsApp',
          type: 'boolean',
          defaultValue: true
        },
        {
          name: 'showFavoriteButton',
          friendlyName: 'Mostrar Botón Favoritos',
          type: 'boolean',
          defaultValue: true
        },
        {
          name: 'imageHeight',
          friendlyName: 'Altura de Imagen',
          type: 'enum',
          enum: ['h-48', 'h-56', 'h-64', 'h-72'],
          defaultValue: 'h-64',
          helperText: 'Altura de la imagen de la propiedad'
        },
        {
          name: 'className',
          friendlyName: 'Clases CSS Personalizadas',
          type: 'string',
          defaultValue: ''
        }
      ]
    })

    // Register FiltersBar component
    Builder.registerComponent(FiltersBar, {
      name: 'FiltersBar',
      friendlyName: 'Barra de Filtros',
      description: 'Barra de filtros para propiedades',
      inputs: [
        {
          name: 'showOperation',
          friendlyName: 'Mostrar Filtro Operación',
          type: 'boolean',
          defaultValue: true
        },
        {
          name: 'showType',
          friendlyName: 'Mostrar Filtro Tipo',
          type: 'boolean',
          defaultValue: true
        },
        {
          name: 'showCity',
          friendlyName: 'Mostrar Filtro Ciudad',
          type: 'boolean',
          defaultValue: true
        },
        {
          name: 'showPrice',
          friendlyName: 'Mostrar Filtro Precio',
          type: 'boolean',
          defaultValue: true
        },
        {
          name: 'showRooms',
          friendlyName: 'Mostrar Filtro Habitaciones',
          type: 'boolean',
          defaultValue: true
        },
        {
          name: 'orientation',
          friendlyName: 'Orientación',
          type: 'enum',
          enum: ['horizontal', 'vertical'],
          defaultValue: 'horizontal',
          helperText: 'Orientación de la barra de filtros'
        },
        {
          name: 'className',
          friendlyName: 'Clases CSS Personalizadas',
          type: 'string',
          defaultValue: ''
        }
      ]
    })

    // Register Hero component
    Builder.registerComponent(Hero, {
      name: 'Hero',
      friendlyName: 'Sección Hero',
      description: 'Sección principal con título, subtítulo e imagen de fondo',
      inputs: [
        {
          name: 'title',
          friendlyName: 'Título Principal',
          type: 'string',
          defaultValue: 'Encuentra tu Hogar Ideal',
          required: true
        },
        {
          name: 'subtitle',
          friendlyName: 'Subtítulo',
          type: 'string',
          defaultValue: 'Las mejores propiedades en Catamarca',
          required: true
        },
        {
          name: 'backgroundImage',
          friendlyName: 'Imagen de Fondo',
          type: 'file',
          allowedFileTypes: ['jpeg', 'jpg', 'png', 'webp'],
          helperText: 'Imagen de fondo para la sección hero'
        },
        {
          name: 'showSearchBar',
          friendlyName: 'Mostrar Barra de Búsqueda',
          type: 'boolean',
          defaultValue: true
        },
        {
          name: 'ctaText',
          friendlyName: 'Texto del Botón',
          type: 'string',
          defaultValue: 'Ver Propiedades'
        },
        {
          name: 'ctaLink',
          friendlyName: 'Enlace del Botón',
          type: 'string',
          defaultValue: '/propiedades'
        },
        {
          name: 'height',
          friendlyName: 'Altura',
          type: 'enum',
          enum: ['h-96', 'h-screen', 'h-[60vh]', 'h-[80vh]'],
          defaultValue: 'h-[60vh]'
        },
        {
          name: 'textAlign',
          friendlyName: 'Alineación del Texto',
          type: 'enum',
          enum: ['left', 'center', 'right'],
          defaultValue: 'center'
        },
        {
          name: 'className',
          friendlyName: 'Clases CSS Personalizadas',
          type: 'string',
          defaultValue: ''
        }
      ]
    })

    // Register Callout component
    Builder.registerComponent(Callout, {
      name: 'Callout',
      friendlyName: 'Llamada a la Acción',
      description: 'Sección de llamada a la acción con texto y botón',
      inputs: [
        {
          name: 'title',
          friendlyName: 'Título',
          type: 'string',
          defaultValue: '¿Necesitas Ayuda?',
          required: true
        },
        {
          name: 'description',
          friendlyName: 'Descripción',
          type: 'string',
          defaultValue: 'Nuestro equipo está listo para ayudarte a encontrar la propiedad perfecta.'
        },
        {
          name: 'buttonText',
          friendlyName: 'Texto del Botón',
          type: 'string',
          defaultValue: 'Contactanos',
          required: true
        },
        {
          name: 'buttonLink',
          friendlyName: 'Enlace del Botón',
          type: 'string',
          defaultValue: '/contacto'
        },
        {
          name: 'variant',
          friendlyName: 'Variante de Estilo',
          type: 'enum',
          enum: ['default', 'secondary', 'accent'],
          defaultValue: 'default'
        },
        {
          name: 'size',
          friendlyName: 'Tamaño',
          type: 'enum',
          enum: ['sm', 'md', 'lg'],
          defaultValue: 'md'
        },
        {
          name: 'centered',
          friendlyName: 'Centrado',
          type: 'boolean',
          defaultValue: true
        },
        {
          name: 'className',
          friendlyName: 'Clases CSS Personalizadas',
          type: 'string',
          defaultValue: ''
        }
      ]
    })

    console.log('✅ Builder.io components registered successfully')
  }
}

// Auto-register components when module loads
if (typeof window !== 'undefined') {
  // Wait for Builder to be available
  setTimeout(registerBuilderComponents, 100)
}
