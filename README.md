# Inmobiliaria Catamarca

Sistema integral de gestión inmobiliaria desarrollado con Next.js 14, integrado con Builder.io para CMS visual y Supabase para base de datos y autenticación.

## 🏗️ Tecnologías Utilizadas

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI**: shadcn/ui, Framer Motion, Lucide React
- **CMS**: Builder.io para contenido visual editable
- **Base de Datos**: Supabase (PostgreSQL + Auth + Storage + RLS)
- **Mapas**: Leaflet / React-Leaflet
- **Formularios**: React Hook Form + Zod
- **Despliegue**: Vercel

## 🚀 Pasos Rápidos (Desarrollo Local)

```bash
# 1. Clonar e instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev

# 3. Abrir http://localhost:3000
```

## 👤 Configurar Usuario Administrador

### Primera vez (Usuario Admin)
1. Ve a `/setup-admin` en tu navegador
2. Sigue las instrucciones automáticas
3. La página te guiará para configurar Supabase y crear el admin

### O manualmente:
1. Regístrate en `/auth/sign-in`
2. Ejecuta el script SQL de `scripts/setup-admin.sql` en Supabase
3. Convierte tu usuario en admin:
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'tu-email@ejemplo.com';
   ```
4. Accede al panel en `/admin`

**📋 Documentación completa**: `docs/ADMIN_SETUP.md`

## 📋 Configuración Completa

### 1. Prerrequisitos

- Node.js 18+ 
- Cuenta en [Supabase](https://supabase.com)
- Cuenta en [Builder.io](https://builder.io)
- Cuenta en [Vercel](https://vercel.com) (para despliegue)

### 2. Instalación

```bash
# Crear proyecto Next.js
npx create-next-app@latest inmobiliaria-catamarca --typescript --tailwind --eslint --app

# Navegar al directorio
cd inmobiliaria-catamarca

# Instalar dependencias específicas
npm install @builder.io/react @builder.io/dev-tools
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install @hookform/resolvers react-hook-form zod
npm install framer-motion lucide-react
npm install leaflet react-leaflet @types/leaflet
npm install class-variance-authority clsx tailwind-merge tailwindcss-animate
npm install @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-avatar
npm install @radix-ui/react-button @radix-ui/react-card @radix-ui/react-checkbox
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-form
npm install @radix-ui/react-label @radix-ui/react-navigation-menu @radix-ui/react-popover
npm install @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-sheet
npm install @radix-ui/react-slot @radix-ui/react-tabs @radix-ui/react-toast @radix-ui/react-icons
```

### 3. Configuración de Variables de Entorno

Crear `.env.local`:

```env
# Supabase (PROPORCIONADAS)
NEXT_PUBLIC_SUPABASE_URL=https://xtcdvnzcryshjwwggfrk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0Y2R2bnpjcnlzaGp3d2dnZnJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3OTE2NzAsImV4cCI6MjA3MDM2NzY3MH0.u-cwoiuT8xSg4fkFLuHw_GTmA9DI5xLPDhpHiGDS8MI

# Builder.io (REEMPLAZAR CON TUS KEYS)
NEXT_PUBLIC_BUILDER_API_KEY=REEMPLAZAR_CON_TU_PUBLIC_API_KEY
BUILDER_WEBHOOK_SECRET=REEMPLAZAR_CON_TU_SECRET

# Next.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu-secret-aleatorio-aqui

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME="Inmobiliaria Catamarca"
```

### 4. Configuración de Supabase

#### 4.1 Ejecutar Migraciones

1. Ir a [Supabase Dashboard](https://app.supabase.com)
2. Abrir SQL Editor
3. Copiar todo el contenido de `supabase/migrations/000_init.sql`
4. Ejecutar script completo

#### 4.2 Configurar Storage

1. Ir a Storage > Buckets
2. Verificar que existe bucket `property-images` (creado automáticamente por migración)
3. Configurar policies de acceso público para lectura

#### 4.3 Configurar Autenticación

1. Ir a Authentication > Settings
2. Configurar providers (Google, Email, etc.)
3. Añadir URL del sitio en "Site URL": `http://localhost:3000`

### 5. Configuración de Builder.io

#### 5.1 Crear Cuenta y Obtener API Keys

1. Registrarse en [Builder.io](https://builder.io)
2. Crear nueva organización/espacio
3. Obtener:
   - **Public API Key**: Settings > Account > API Keys
   - **Webhook Secret**: Settings > Webhooks > Create new webhook

#### 5.2 Crear Modelos en Builder

Opción A - **Via UI (Recomendado)**:

1. Ir a Models
2. Crear modelo `page`:
   - Name: `page`
   - Type: `page`
   - Description: "Páginas del sitio web"

3. Crear modelo `home` (opcional):
   - Name: `home` 
   - Type: `page`
   - Description: "Página de inicio específica"

Opción B - **Via API REST**:

```bash
# Crear modelo 'page'
curl -X POST https://builder.io/api/v1/models \
  -H "Authorization: Bearer TU_PRIVATE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "page",
    "kind": "page",
    "description": "Páginas del sitio web"
  }'

# Crear modelo 'home'  
curl -X POST https://builder.io/api/v1/models \
  -H "Authorization: Bearer TU_PRIVATE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "home", 
    "kind": "page",
    "description": "Página de inicio específica"
  }'
```

#### 5.3 Configurar Webhook de Revalidación

1. Ir a Settings > Webhooks
2. Crear nuevo webhook:
   - **URL**: `https://tu-dominio.vercel.app/api/revalidate`
   - **Events**: `publish`, `unpublish`, `archive`
   - **Secret**: Usar el mismo valor que `BUILDER_WEBHOOK_SECRET`

#### 5.4 Registrar Componentes Customizados

Los componentes se registran automáticamente cuando se ejecuta la aplicación:

- **PropertyGrid**: Grilla de propiedades con filtros
- **PropertyCard**: Tarjeta individual de propiedad  
- **FiltersBar**: Barra de filtros avanzados
- **Hero**: Sección principal con búsqueda
- **Callout**: Llamada a la acción

### 6. Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# Ejecutar linting
npm run lint

# Construir para producción
npm run build

# Ejecutar seeds (si es necesario)
npm run seed
```

### 7. Despliegue en Vercel

#### 7.1 Via Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deployar
vercel

# Configurar variables de entorno en dashboard
```

#### 7.2 Via GitHub

1. Conectar repositorio a Vercel
2. Configurar variables de entorno en Vercel Dashboard
3. Hacer push a main branch

#### 7.3 Variables de Entorno en Producción

Configurar en Vercel Dashboard > Settings > Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://xtcdvnzcryshjwwggfrk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0Y2R2bnpjcnlzaGp3d2dnZnJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3OTE2NzAsImV4cCI6MjA3MDM2NzY3MH0.u-cwoiuT8xSg4fkFLuHw_GTmA9DI5xLPDhpHiGDS8MI
NEXT_PUBLIC_BUILDER_API_KEY=tu_public_api_key_real
BUILDER_WEBHOOK_SECRET=tu_webhook_secret_real
NEXTAUTH_URL=https://tu-dominio.vercel.app
NEXTAUTH_SECRET=secret-seguro-para-produccion
NEXT_PUBLIC_APP_URL=https://tu-dominio.vercel.app
NEXT_PUBLIC_SITE_NAME="Inmobiliaria Catamarca"
```

## 📁 Estructura del Proyecto

```
inmobiliaria-catamarca/
├── app/
│   ├── (auth)/
│   │   └── sign-in/page.tsx
│   ├── (private)/
│   │   ├── admin/page.tsx
│   │   └── favoritos/page.tsx
│   ├── (public)/
│   │   └── propiedad/[id]/page.tsx
│   ├── (site)/
│   │   └── [...page]/page.tsx         # Builder.io catch-all
│   ├── actions/
│   │   ├── favorites.ts
│   │   ├── leads.ts
│   │   └── properties.ts
│   ├── api/
│   │   ├── leads/route.ts
│   │   └── revalidate/route.ts        # Builder webhook
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── admin/
│   │   ├── AdminDashboard.tsx
│   │   ├── LeadsList.tsx
│   │   └── PropertiesList.tsx
│   ├── builder/
│   │   ├── BuilderProvider.tsx
│   │   ├── RenderBuilderContent.tsx
│   │   └── registry.ts                # Registro de componentes
│   ├── favorites/
│   │   └── FavoritesList.tsx
│   ├── properties/
│   │   ├── ContactForm.tsx
│   │   ├── FiltersBar.tsx
│   │   ├── PropertyCard.tsx
│   │   ├── PropertyGrid.tsx
│   │   └── PropertyMap.tsx
│   └── ui/                            # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── Callout.tsx
│       ├── Hero.tsx
│       └── ...
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── types.ts
│   └── utils.ts
├── supabase/
│   └── migrations/
│       └── 000_init.sql               # Migración completa
├── builder.config.ts
├── middleware.ts
├── next.config.js
├── tailwind.config.js
└── package.json
```

## 🔧 Funcionalidades

### Para Visitantes
- ✅ Navegación de propiedades con filtros avanzados
- ✅ Detalle de propiedades con galería e información completa
- ✅ Mapa de ubicación con Leaflet
- ✅ Formulario de contacto por propiedad
- ✅ Integración WhatsApp con agentes
- ✅ Contenido editable via Builder.io

### Para Usuarios Registrados
- ✅ Sistema de favoritos
- ✅ Autenticación con Supabase Auth
- ✅ Perfil de usuario

### Para Agentes/Administradores
- ✅ Panel de administración
- ✅ CRUD de propiedades
- ✅ Gestión de leads/consultas
- ✅ Upload de imágenes a Supabase Storage
- ✅ Marcar propiedades como destacadas

### Técnicas
- ✅ ISR (Incremental Static Regeneration)
- ✅ Revalidación automática via webhook de Builder
- ✅ Row Level Security (RLS) en Supabase
- ✅ Middleware de autenticación
- ✅ Responsive design
- ✅ SEO optimizado

## 🧪 Checklist de Pruebas

### Configuración Inicial
- [ ] Variables de entorno configuradas
- [ ] Migración SQL ejecutada exitosamente
- [ ] Builder.io conectado y modelos creados
- [ ] Webhook de Builder configurado

### Funcionalidades Core
- [ ] Listado de propiedades funciona
- [ ] Filtros de búsqueda operativos
- [ ] Detalle de propiedad se carga correctamente
- [ ] Mapa muestra ubicación
- [ ] Formulario de contacto envía leads

### Autenticación y Roles
- [ ] Registro de usuario funciona
- [ ] Login/logout operativo
- [ ] Middleware protege rutas privadas
- [ ] Panel admin accesible solo para admin/agent

### Builder.io Integration
- [ ] Componentes aparecen en Builder editor
- [ ] Edición visual funciona
- [ ] Publicación actualiza sitio automáticamente
- [ ] Preview mode operativo

### Base de Datos
- [ ] RLS policies funcionan correctamente
- [ ] Seeds cargados (5 propiedades ejemplo)
- [ ] Storage de imágenes configurado
- [ ] Triggers de updated_at operativos

## 🗄️ Datos de Prueba

El sistema incluye 5 propiedades de ejemplo en Catamarca:

1. **Casa en Barrio Norte** - Venta USD 120,000
2. **Departamento Céntrico** - Alquiler ARS 180,000  
3. **PH en Barrio Jardín** - Venta USD 85,000
4. **Lote Residencial** - Venta USD 45,000
5. **Local Comercial** - Alquiler ARS 350,000

Agentes de ejemplo:
- María González (maria.gonzalez@inmobiliaria.com)
- Carlos Rodríguez (carlos.rodriguez@inmobiliaria.com)

## 🌍 Localización

- **Idioma**: Español (Argentina)
- **Monedas**: USD (principal), ARS (secundaria)  
- **Timezone**: America/Argentina/Catamarca
- **Formato fecha**: DD/MM/YYYY
- **Números**: Formato argentino (1.234.567,89)

## 📞 Soporte

Para problemas técnicos o consultas:

1. Revisar logs en Vercel Dashboard
2. Verificar configuración de variables de entorno
3. Comprobar estado de Supabase y Builder.io
4. Revisar documentación de [Next.js](https://nextjs.org/docs), [Supabase](https://supabase.com/docs), [Builder.io](https://www.builder.io/c/docs)

---

Desarrollado con ❤️ para el mercado inmobiliario de Catamarca, Argentina.
