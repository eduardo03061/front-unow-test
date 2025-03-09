# Unow EmployeeHub

Unow EmployeeHub es una plataforma todo-en-uno para la gestión de personal, diseñada para optimizar el control de tu equipo humano con herramientas inteligentes.

## Estructura del Proyecto

## Librerías Utilizadas

- `headlessui/react`: Componentes UI accesibles y completamente personalizables.
- `next/font/google`: Fuentes de Google optimizadas para Next.js.
- `react-toastify`: Notificaciones para React.

## Componentes Principales

### `src/app/layout.tsx`

Este archivo define el layout principal de la aplicación, incluyendo la barra de navegación, el pie de página y la lógica de autenticación.

### `src/app/page.tsx`

Este archivo define la página de inicio de la aplicación, con un llamado a la acción para ir al dashboard.

### `src/app/forgot-password/page.tsx`

Este archivo define la página de recuperación de contraseña, permitiendo a los usuarios restablecer su contraseña.

### `src/app/dashboard/page.tsx`

Este archivo define el dashboard principal, donde se puede ver y gestionar la información de los empleados.

### `src/app/login/page.tsx`

Este archivo define la página de inicio de sesión, permitiendo a los usuarios autenticarse en la plataforma.

### `src/hooks/useAuth.ts`

Este archivo define el hook `useAuth` para manejar la lógica de autenticación, incluyendo login, logout y la gestión del estado del usuario.

## Scripts Disponibles

En el archivo `package.json`, puedes encontrar los siguientes scripts:

- `build`: Construye la aplicación para producción.
- `start`: Inicia la aplicación en modo producción.
- `dev`: Inicia la aplicación en modo desarrollo.
- `lint`: Ejecuta el linter para encontrar y arreglar problemas en el código.

## Configuración

### Variables de Entorno

Asegúrate de definir las siguientes variables de entorno en tu archivo `.env`:

- `NEXT_PUBLIC_API_URL`: URL de la API para las solicitudes de datos.

## Instalación

1. Clona el repositorio.
2. Instala las dependencias con `npm install`.
3. Configura las variables de entorno en el archivo `.env`.
4. Inicia la aplicación en modo desarrollo con `npm run dev`.

## Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o un pull request para discutir cualquier cambio que te gustaría hacer.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT.