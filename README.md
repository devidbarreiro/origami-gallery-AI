# Origami Gallery - Generador de Figuras de Origami con IA

## 📝 Descripción del Proyecto

Origami Gallery es una aplicación web fullstack que permite a los usuarios crear, visualizar, y gestionar una colección de figuras de origami. La aplicación utiliza Laravel para el backend, React con Inertia.js para el frontend, y aprovecha la API de DALL-E para generar imágenes únicas de origami.

## ✨ Características

- Crear nuevas figuras de origami
- Listar figuras existentes
- Ver detalles de cada figura
- Eliminar figuras
- Generación de imágenes con DALL-E
- Niveles de dificultad personalizados
- Interfaz minimalista y responsive

## 🛠️ Tecnologías Utilizadas

- **Backend**: Laravel 11
- **Frontend**: React, Inertia.js
- **Generación de Imágenes**: DALL-E 3
- **Estilos**: Tailwind CSS
- **Componentes UI**: Shadcn/UI

## 📋 Requisitos Previos

- PHP 8.2+
- Composer
- Node.js 18+
- npm
- Cuenta de OpenAI (para API key)

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/origami-gallery.git
cd origami-gallery
```

### 2. Configurar Backend

```bash
# Instalar dependencias de PHP

composer install

# Copiar archivo de configuración
cp .env.example .env

# Generar clave de aplicación
php artisan key:generate

# Configurar base de datos en .env
# Edita los detalles de conexión de base de datos

# Ejecutar migraciones
php artisan migrate
```
