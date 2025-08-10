# Configuración de Builder.io

Guía detallada para configurar Builder.io con el sistema inmobiliario.

## 🏗️ Configuración Inicial

### 1. Crear Cuenta y Obtener Credenciales

1. **Registrarse en Builder.io**:
   - Ir a [builder.io](https://builder.io)
   - Crear cuenta gratuita o de pago
   - Crear nueva organización

2. **Obtener API Keys**:
   - Ir a Settings > Account > API Keys
   - Copiar **Public API Key** (para `NEXT_PUBLIC_BUILDER_API_KEY`)
   - Generar **Private API Key** (para operaciones via API)

3. **Configurar Webhook Secret**:
   - Generar string seguro aleatorio
   - Usar para `BUILDER_WEBHOOK_SECRET`
   - Ejemplo: `openssl rand -base64 32`

## 📋 Crear Modelos

### Opción A: Via Interfaz Web (Recomendado)

1. **Ir a Models** en el dashboard
2. **Crear modelo 'page'**:
   - Name: `page`
   - Model type: `page`
   - Description: `Páginas del sitio web`
   - Preview URL: `http://localhost:3000`

3. **Crear modelo 'home'** (opcional):
   - Name: `home`
   - Model type: `page`
   - Description: `Página de inicio específica`
   - Preview URL: `http://localhost:3000`

### Opción B: Via API REST

```bash
# Configurar variables
PRIVATE_API_KEY="tu_private_api_key"
BUILDER_ORG_ID="tu_organization_id"

# Crear modelo 'page'
curl -X POST "https://builder.io/api/v1/models" \
  -H "Authorization: Bearer $PRIVATE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "page",
    "kind": "page",
    "description": "Páginas del sitio web",
    "fields": []
  }'

# Crear modelo 'home'
curl -X POST "https://builder.io/api/v1/models" \
  -H "Authorization: Bearer $PRIVATE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "home",
    "kind": "page", 
    "description": "Página de inicio específica",
    "fields": []
  }'
```

## 🔧 Configurar Webhooks

### 1. Crear Webhook para Revalidación

1. **Ir a Settings > Webhooks**
2. **Click "Create Webhook"**
3. **Configurar**:
   - **Name**: `Next.js Revalidation`
   - **URL**: `http://localhost:3000/api/revalidate` (local) o `https://tu-dominio.vercel.app/api/revalidate` (producción)
   - **Secret**: Usar el mismo valor que `BUILDER_WEBHOOK_SECRET`
   - **Events**: Seleccionar:
     - `content.publish`
     - `content.unpublish`
     - `content.archive`

### 2. Verificar Webhook

```bash
# Test webhook local
curl -X POST http://localhost:3000/api/revalidate \
  -H "Authorization: Bearer tu_webhook_secret" \
  -H "Content-Type: application/json" \
  -d '{
    "modelName": "page",
    "publishedUrl": "https://example.com/test",
    "data": {}
  }'
```

## 🎨 Registrar Componentes Customizados

Los componentes se registran automáticamente cuando se ejecuta la aplicación. Asegurar que:

1. **Builder.io está inicializado**:
   ```typescript
   // En builder.config.ts
   Builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY!)
   ```

2. **Registry se importa**:
   ```typescript
   // En app/layout.tsx
   import '@/components/builder/registry'
   ```

### Componentes Disponibles

Después de iniciar la aplicación, estos componentes estarán disponibles en el editor:

1. **PropertyGrid** - Grilla de propiedades
   - Props: operation, type, city, maxUsd, featuredOnly, pageSize, title

2. **PropertyCard** - Tarjeta individual de propiedad
   - Props: propertyId, showPrice, showAmenities, showWhatsAppButton

3. **FiltersBar** - Barra de filtros
   - Props: showOperation, showType, showCity, showPrice, orientation

4. **Hero** - Sección principal con búsqueda
   - Props: title, subtitle, backgroundImage, showSearchBar, ctaText

5. **Callout** - Llamada a la acción
   - Props: title, description, buttonText, buttonLink, variant

## 📄 Crear Contenido

### 1. Crear Página de Inicio

1. **Ir a Content**
2. **Click "New" > "page"**
3. **Configurar**:
   - **Name**: `Homepage`
   - **URL**: `/inicio`
   - **Description**: `Página principal del sitio`

4. **Diseñar página**:
   - Arrastar componente `Hero`
   - Arrastar componente `PropertyGrid`
   - Arrastar componente `Callout`
   - Configurar props de cada componente

### 2. Crear Páginas Adicionales

**Página Nosotros**:
- URL: `/nosotros`
- Componentes: Hero, texto, Callout

**Página Contacto**:
- URL: `/contacto`
- Componentes: Hero, información de contacto, mapa

**Página Servicios**:
- URL: `/servicios`
- Componentes: Hero, grid de servicios, Callout

## 🔄 Preview y Publish

### 1. Configurar Preview URLs

En cada modelo:
- Development: `http://localhost:3000`
- Production: `https://tu-dominio.vercel.app`

### 2. Testing

1. **Preview Mode**:
   - Click "Preview" en editor
   - Verificar que componentes se renderizan correctamente

2. **Publish**:
   - Click "Publish" cuando esté listo
   - Verificar que webhook revalida automáticamente

## 🎯 Mejores Prácticas

### 1. Organización de Contenido

- **Usar nombres descriptivos** para páginas y componentes
- **Crear carpetas** para organizar contenido por sección
- **Usar tags** para categorizar contenido

### 2. SEO

- **Configurar meta titles** únicos para cada página
- **Añadir meta descriptions** descriptivas
- **Usar URLs semánticas** (/propiedades, /nosotros, etc.)

### 3. Performance

- **Optimizar imágenes** antes de subir a Builder
- **Usar lazy loading** para imágenes grandes
- **Minimizar número de componentes** por página

### 4. Responsive Design

- **Testtear en mobile** usando preview
- **Configurar breakpoints** en components
- **Usar responsive spacing** (m-4 md:m-8)

## 🐛 Troubleshooting

### Problemas Comunes

**Componentes no aparecen en editor**:
- Verificar que `NEXT_PUBLIC_BUILDER_API_KEY` está configurada
- Verificar que `import '@/components/builder/registry'` está en layout
- Comprobar console logs para errores de registro

**Preview no funciona**:
- Verificar Preview URL en modelo
- Asegurar que aplicación está corriendo en puerto correcto
- Verificar CORS settings en Builder

**Webhook no dispara revalidación**:
- Verificar URL del webhook
- Comprobar que secret coincide
- Revisar logs en `/api/revalidate`

**Estilos no se aplican**:
- Verificar que Tailwind está configurado
- Comprobar que clases CSS están disponibles
- Revisar responsive breakpoints

### Debug Mode

Para debug detallado:

```typescript
// En builder.config.ts
if (typeof window !== 'undefined') {
  Builder.isStatic = false
  Builder.isBrowser = true
  // Habilitar debug logs
  Builder.debug = true
}
```

## 📚 Recursos Adicionales

- [Builder.io Documentation](https://www.builder.io/c/docs)
- [Next.js Integration Guide](https://www.builder.io/c/docs/developers/frameworks/nextjs)
- [Component Registration](https://www.builder.io/c/docs/custom-components)
- [Webhooks Documentation](https://www.builder.io/c/docs/webhooks)

---

Con esta configuración, Builder.io estará completamente integrado y listo para crear contenido visual para el sitio inmobiliario.
