#!/bin/bash

# Inmobiliaria Catamarca - Bootstrap Script
# Este script automatiza la configuración inicial del proyecto

set -e

echo "🏗️  Inmobiliaria Catamarca - Configuración Inicial"
echo "=================================================="

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js 18+ primero."
    exit 1
fi

# Verificar versión de Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Se requiere Node.js 18 o superior. Versión actual: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detectado"

# Instalar dependencias
echo ""
echo "📦 Instalando dependencias..."
npm install

# Verificar si .env.local existe
if [ ! -f .env.local ]; then
    echo ""
    echo "📝 Creando archivo .env.local desde .env.example..."
    cp .env.example .env.local
    echo "⚠️  IMPORTANTE: Edita .env.local con tus credenciales reales de Builder.io"
    echo "   - NEXT_PUBLIC_BUILDER_API_KEY"
    echo "   - BUILDER_WEBHOOK_SECRET"
else
    echo "✅ Archivo .env.local ya existe"
fi

# Verificar configuración de Supabase
echo ""
echo "🗄️  Verificando configuración de Supabase..."

if grep -q "REEMPLAZAR_CON_TU_PUBLIC_API_KEY" .env.local 2>/dev/null; then
    echo "⚠️  Las credenciales de Builder.io no están configuradas en .env.local"
    echo "   Por favor reemplaza REEMPLAZAR_CON_TU_PUBLIC_API_KEY con tu API key real"
fi

# Crear directorios necesarios si no existen
mkdir -p public/images
mkdir -p scripts

echo ""
echo "📋 Próximos pasos manuales:"
echo "========================="
echo ""
echo "1. 🔑 Configurar credenciales:"
echo "   - Edita .env.local con tus API keys de Builder.io"
echo "   - Obtén las keys en: https://builder.io/account/organization"
echo ""
echo "2. 🗄️  Configurar Supabase:"
echo "   - Ve a: https://app.supabase.com"
echo "   - Abre SQL Editor"
echo "   - Copia y ejecuta: supabase/migrations/000_init.sql"
echo ""
echo "3. 🏗️  Configurar Builder.io:"
echo "   - Ve a: https://builder.io"
echo "   - Crea modelos 'page' y 'home'"
echo "   - Configura webhook: /api/revalidate"
echo ""
echo "4. 🚀 Iniciar desarrollo:"
echo "   npm run dev"
echo ""
echo "5. 🌐 Abrir navegador:"
echo "   http://localhost:3000"
echo ""

# Función para verificar si un puerto está ocupado
check_port() {
    if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "⚠️  Puerto 3000 está ocupado. Usa npm run dev -- -p 3001"
        return 1
    fi
    return 0
}

# Ofrecer iniciar el servidor de desarrollo
echo "¿Quieres iniciar el servidor de desarrollo ahora? (y/n)"
read -r response
if [ "$response" = "y" ] || [ "$response" = "Y" ] || [ "$response" = "yes" ]; then
    if check_port; then
        echo ""
        echo "🚀 Iniciando servidor de desarrollo..."
        npm run dev
    fi
else
    echo ""
    echo "✅ Configuración completa. Ejecuta 'npm run dev' cuando estés listo."
fi

echo ""
echo "📚 Documentación completa disponible en README.md"
echo "🎉 ¡Configuración inicial completada!"
