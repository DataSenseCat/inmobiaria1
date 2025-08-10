# Guía de Despliegue - Inmobiliaria Catamarca

Esta guía cubre el despliegue completo del sistema en producción.

## 📋 Prerrequisitos

- [ ] Código fuente completo del proyecto
- [ ] Cuenta en Vercel configurada
- [ ] Supabase configurado con migraciones aplicadas
- [ ] Builder.io configurado con modelos y componentes
- [ ] Variables de entorno listas para producción

## 🚀 Despliegue en Vercel

### Opción 1: Via GitHub (Recomendado)

1. **Subir código a GitHub**:
```bash
git add .
git commit -m "feat: sistema inmobiliario completo"
git push origin main
```

2. **Conectar con Vercel**:
   - Ir a [vercel.com](https://vercel.com)
   - Click "New Project"
   - Importar repositorio de GitHub
   - Configurar settings del proyecto

3. **Configurar variables de entorno**:
   - Ir a Project Settings > Environment Variables
   - Añadir todas las variables (ver sección Variables de Entorno)

### Opción 2: Via Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login a Vercel
vercel login

# Deploy proyecto
vercel

# Configurar variables de entorno
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add NEXT_PUBLIC_BUILDER_API_KEY
vercel env add BUILDER_WEBHOOK_SECRET
vercel env add NEXTAUTH_URL
vercel env add NEXTAUTH_SECRET
vercel env add NEXT_PUBLIC_APP_URL
vercel env add NEXT_PUBLIC_SITE_NAME

# Redeploy con nuevas variables
vercel --prod
```

## 🔐 Variables de Entorno en Producción

Configurar estas variables en Vercel Dashboard:

```env
# Supabase (Usar las credenciales proporcionadas)
NEXT_PUBLIC_SUPABASE_URL=https://xtcdvnzcryshjwwggfrk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0Y2R2bnpjcnlzaGp3d2dnZnJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3OTE2NzAsImV4cCI6MjA3MDM2NzY3MH0.u-cwoiuT8xSg4fkFLuHw_GTmA9DI5xLPDhpHiGDS8MI

# Builder.io (Reemplazar con valores reales)
NEXT_PUBLIC_BUILDER_API_KEY=tu_public_api_key_real
BUILDER_WEBHOOK_SECRET=tu_webhook_secret_seguro

# Next.js (Usar URL de producción)
NEXTAUTH_URL=https://tu-dominio.vercel.app
NEXTAUTH_SECRET=secret-super-seguro-para-produccion-min-32-chars

# App (Usar URL de producción)
NEXT_PUBLIC_APP_URL=https://tu-dominio.vercel.app
NEXT_PUBLIC_SITE_NAME="Inmobiliaria Catamarca"
```

### 🔑 Generar NEXTAUTH_SECRET Seguro

```bash
# Método 1: OpenSSL
openssl rand -base64 32

# Método 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Método 3: Online
# Usar: https://generate-secret.vercel.app/32
```

## 🏗️ Configuración Post-Despliegue

### 1. Actualizar Builder.io

**Actualizar Webhook URL**:
1. Ir a Builder.io Dashboard
2. Settings > Webhooks
3. Editar webhook existente
4. Cambiar URL a: `https://tu-dominio.vercel.app/api/revalidate`
5. Verificar que el secret coincida con `BUILDER_WEBHOOK_SECRET`

**Configurar Site URL**:
1. Ir a Settings > Sites
2. Añadir URL de producción: `https://tu-dominio.vercel.app`

### 2. Actualizar Supabase

**Actualizar Auth Settings**:
1. Ir a Supabase Dashboard > Authentication > Settings
2. Site URL: `https://tu-dominio.vercel.app`
3. Redirect URLs: 
   - `https://tu-dominio.vercel.app/auth/callback`
   - `https://tu-dominio.vercel.app/auth/sign-in`

**Verificar RLS Policies**:
Asegurar que las policies están configuradas correctamente para producción.

### 3. Configurar Dominio Personalizado (Opcional)

En Vercel Dashboard:
1. Ir a Project Settings > Domains
2. Añadir dominio personalizado
3. Configurar DNS según instrucciones
4. Actualizar variables de entorno con nuevo dominio

## 🧪 Testing en Producción

### Checklist de Verificación

```bash
# 1. Verificar que el sitio carga
curl -I https://tu-dominio.vercel.app

# 2. Verificar API endpoints
curl https://tu-dominio.vercel.app/api/leads
curl https://tu-dominio.vercel.app/api/revalidate

# 3. Verificar páginas principales
# - Homepage: /
# - Detalle propiedad: /propiedad/[id]
# - Admin: /admin
# - Favoritos: /favoritos
```

### Tests Funcionales

- [ ] **Homepage**: Carga correctamente con propiedades
- [ ] **Búsqueda**: Filtros funcionan correctamente
- [ ] **Detalle**: Página de propiedad se carga con imágenes y mapa
- [ ] **Contacto**: Formulario envía leads a Supabase
- [ ] **WhatsApp**: Enlaces se generan correctamente
- [ ] **Auth**: Login/logout funciona
- [ ] **Admin**: Panel accesible para admin/agents
- [ ] **Favoritos**: Sistema de favoritos operativo
- [ ] **Builder.io**: Edición visual funciona
- [ ] **Webhook**: Revalidación automática al publicar contenido

## 📊 Monitoreo

### Logs y Debugging

**Vercel Logs**:
```bash
# Ver logs en tiempo real
vercel logs --follow

# Ver logs específicos
vercel logs --since=1h
```

**Supabase Logs**:
1. Ir a Supabase Dashboard > Logs
2. Revisar Auth logs, Database logs, API logs

**Builder.io Logs**:
1. Ir a Builder.io Dashboard > Activity
2. Revisar webhooks y publish history

### Performance Monitoring

**Core Web Vitals**:
- Usar Vercel Analytics
- Configurar en Vercel Dashboard > Analytics

**Error Tracking**:
- Considerar integrar Sentry
- Configurar error boundaries en React

## 🔄 CI/CD Pipeline

### Automatic Deployments

Configurado automáticamente con GitHub:
- **Production**: Push a `main` branch
- **Preview**: Pull requests automáticamente

### Manual Deployment

```bash
# Deploy específico
vercel --prod

# Deploy con variables de entorno específicas
vercel --prod --env NODE_ENV=production
```

## 🛠️ Troubleshooting

### Problemas Comunes

**Build Errors**:
```bash
# Ver logs detallados
vercel logs [deployment-url]

# Build local para debug
npm run build
```

**Variables de Entorno**:
```bash
# Verificar variables en Vercel
vercel env ls

# Sincronizar variables localmente
vercel env pull .env.local
```

**Database Connection**:
- Verificar que Supabase URL y key son correctas
- Verificar que RLS policies permiten acceso
- Comprobar que migraciones están aplicadas

**Builder.io Integration**:
- Verificar API key en variables de entorno
- Comprobar que webhook URL es correcta
- Verificar que modelos están creados

### Rollback

**Rollback Rápido**:
```bash
# Listar deployments
vercel ls

# Hacer rollback a deployment anterior
vercel rollback [deployment-url]
```

**Rollback via Dashboard**:
1. Ir a Vercel Dashboard > Deployments
2. Seleccionar deployment anterior estable
3. Click "Promote to Production"

## 📋 Checklist Final

Antes de considerar el despliegue completo:

### Técnico
- [ ] Todas las variables de entorno configuradas
- [ ] Build de producción exitoso
- [ ] Tests básicos funcionando
- [ ] SSL/HTTPS configurado
- [ ] Dominio personalizado configurado (si aplica)

### Funcional
- [ ] Homepage carga con contenido
- [ ] Sistema de propiedades operativo
- [ ] Formularios de contacto funcionan
- [ ] Autenticación operativa
- [ ] Panel admin accesible
- [ ] Builder.io edición visual funciona
- [ ] Webhook revalidation operativo

### Contenido
- [ ] Datos semilla cargados
- [ ] Imágenes de propiedades accesibles
- [ ] Información de agentes correcta
- [ ] Contenido inicial en Builder.io

### SEO/Performance
- [ ] Meta tags configurados
- [ ] Open Graph funcionando
- [ ] Sitemap accesible
- [ ] Performance score aceptable

---

🎉 **¡Despliegue completado!** El sistema inmobiliario está listo para producción.

Para soporte técnico adicional, revisar logs en Vercel Dashboard y documentación de cada servicio.
