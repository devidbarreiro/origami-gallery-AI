# Origami Gallery - Generador de Figuras de Origami con IA

## 📝 Descripción del Proyecto

Origami Gallery es una aplicación web fullstack que permite a los usuarios crear, visualizar y gestionar una colección de figuras de origami. La aplicación utiliza Laravel para el backend, React con Inertia.js para el frontend, y aprovecha la API de DALL-E para generar imágenes únicas de origami.

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
git clone https://github.com/devidbarreiro/origami-gallery-AI.git
cd origami-gallery-AI
```

### 2. Configurar Backend

```bash

# Instalar dependencias de PHP
composer install

# Copiar archivo de configuración
cp .env.example .env

# Generar clave de aplicación
php artisan key:generate

# Asegúrate de haber creado el enlace simbólico para que el contenido de storage/app/public sea accesible públicamente
php artisan storage:link

# Configurar base de datos en .env
# Edita los detalles de conexión de base de datos

# Ejecutar migraciones
php artisan migrate
```

### 3. Abre el archivo `.env` y ajusta los parámetros de conexión a la base de datos, por ejemplo:

```bash
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3307
DB_DATABASE=mi_laravel_db
DB_USERNAME=root
DB_PASSWORD=
```

**Nota:** Asegúrate de que el servidor MySQL esté corriendo en el puerto indicado y que la base de datos `mi_laravel_db` exista. En caso de no existir, créala mediante tu herramienta de gestión (phpMyAdmin, MySQL Workbench, etc.) o usando la línea de comandos:

```bash
CREATE DATABASE mi_laravel_db;
```

### 4. Configurar permisos del directorio `storage`

En caso de encontrar un error relacionado con la ruta de caché de las vistas, asegúrate de que el directorio `storage` tenga los permisos adecuados ejecutando el siguiente comando:

- En sistemas Unix/Linux/macOS:

  ```bash
  sudo chmod -R 775 storage
  ```
- En Windows (usando PowerShell como administrador):

  ```powershell
  icacls storage /grant "Everyone:(OI)(CI)F" /t
  ```

### 5. Configurar Frontend

```bash
# Instalar dependencias de Node
npm install

# Compilar assets
npm run dev
```

### 6. Configurar OpenAI

1. Obtén tu API key en [OpenAI Platform](https://platform.openai.com/)
2. Añade la clave en tu archivo `.env`:
   ```bash
   OPENAI_API_KEY=tu_clave_api_aqui
   ```

### 7. Iniciar Servidores

Terminal 1 (Backend):

```bash
php artisan serve
```

Terminal 2 (Frontend):

```bash
npm run dev
```

## 🖼️ Capturas de Pantalla

## 🔒 Variables de Entorno

- `OPENAI_API_KEY`: Clave de API de OpenAI
- `DB_CONNECTION`: Tipo de base de datos
- `DB_HOST`: Host de la base de datos
- `DB_PORT`: Puerto de la base de datos
- `DB_DATABASE`: Nombre de la base de datos
- `DB_USERNAME`: Usuario de la base de datos
- `DB_PASSWORD`: Contraseña de la base de datos

### Instrucciones Adicionales

1. Crea un archivo `.env.example` con las variables de entorno necesarias (sin valores sensibles)
2. Añade un archivo `.gitignore` para excluir:
   ```bash
   /node_modules
   /public/hot
   /public/storage
   /storage/*.key
   /vendor
   .env
   .env.backup
   .phpunit.result.cache
   ```
3. Incluye un script en `package.json` para facilitar la instalación:
   ```json
   "scripts": {
     "postinstall": "npm run dev",
     "dev": "vite",
     "build": "vite build"
   }
   ```

```

```
