# Configuración de Usuario Administrador

## Problema
No puedes acceder al panel de administración o crear/editar propiedades porque necesitas:
1. Un usuario autenticado en Supabase Auth
2. Un registro en la tabla `users` con `role = 'admin'`
3. Las tablas de la base de datos configuradas correctamente
4. Las políticas RLS (Row Level Security) configuradas

## Diagnóstico Automático
🆕 **Nuevo**: Ahora la aplicación incluye un diagnóstico automático que detecta y explica todos los problemas de permisos.

### Dónde encontrar el diagnóstico:
- Panel de administración: `/admin` (se muestra automáticamente)
- Crear propiedades: `/admin/properties/new` (si hay problemas)
- Página de emprendimientos: `/emprendimientos` (si faltan tablas)

## Solución Rápida

### Opción 1: Usar el diagnóstico automático (RECOMENDADO)
1. Ve a `/admin` en tu navegador
2. El sistema mostrará un diagnóstico completo
3. Copia el script SQL proporcionado
4. Ejecuta el script en Supabase SQL Editor mientras estés autenticado
5. Actualiza el diagnóstico para verificar

### Opción 2: Usar la interfaz web original
1. Ve a `/setup-admin` en tu navegador
2. Sigue las instrucciones en pantalla
3. La página te guiará automáticamente

### Opción 2: Configuración manual

#### Paso 1: Registrarse
1. Ve a `/auth/sign-in`
2. Crea una cuenta nueva o inicia sesión con una existente

#### Paso 2: Configurar base de datos
Ejecuta este SQL en Supabase SQL Editor:

```sql
-- Crear tabla users si no existe
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'agent', 'user')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Configurar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Políticas básicas
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON users
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- Convertir tu usuario en admin (reemplaza con tu email)
UPDATE users SET role = 'admin' WHERE email = 'tu-email@ejemplo.com';
```

#### Paso 3: Verificar
```sql
SELECT * FROM users WHERE role = 'admin';
```

## Archivos de configuración disponibles

- `scripts/setup-admin.sql` - Script SQL completo
- `src/pages/setup/SetupAdminPage.tsx` - Interfaz web
- Ruta: `/setup-admin` - Página de configuración

## Notas importantes

- Solo necesitas hacer esto una vez
- El primer usuario registrado debería ser el administrador
- Si algo sale mal, usa la página `/setup-admin` para diagnóstico
- Una vez configurado, accede al panel en `/admin`

## Solución de problemas

### Error: "Usuario no encontrado"
- Ve a `/setup-admin`
- Usa el botón "Crear Perfil de Usuario como Admin"

### Error: "No es administrador"
- Ve a `/setup-admin`  
- Usa el botón "Convertir en Administrador"

### Error: "Tablas no configuradas"
- Ejecuta el script SQL en Supabase
- O copia y pega desde `/setup-admin`
