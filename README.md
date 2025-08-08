# Social 2.0 - Proceso 0.1

Una aplicación web moderna para gestionar grupos y personas, construida con Next.js, TypeScript y Tailwind CSS.

## Características

- 🔐 **Autenticación**: Soporte para Google Sign-In con Firebase
- 👥 **Gestión de Grupos**: Crear, editar y eliminar grupos
- 👤 **Gestión de Personas**: Agregar personas a grupos con notas
- 🔍 **Búsqueda**: Búsqueda en tiempo real en grupos y personas
- 🎨 **Temas**: Múltiples temas visuales
- 📤 **Exportación**: Exportar datos en formato JSON
- 📱 **Responsive**: Diseño adaptativo para móviles y desktop
- 🚀 **Demo Mode**: Modo demo sin Firebase para desarrollo y despliegue

## Modos de Operación

### Modo Demo (Recomendado para Railway)

Para ejecutar la aplicación sin Firebase, simplemente configura:

```bash
NEXT_PUBLIC_DEMO_MODE=true
```

**Características del modo demo:**
- ✅ No requiere variables de entorno de Firebase
- ✅ Autenticación automática con usuario demo
- ✅ Almacenamiento en localStorage
- ✅ Funcionalidad completa de grupos y personas
- ✅ Persistencia de datos en el navegador
- ✅ Perfecto para despliegues rápidos

### Modo Firebase (Producción)

Para usar Firebase en producción:

```bash
NEXT_PUBLIC_DEMO_MODE=false
NEXT_PUBLIC_ENABLE_FIREBASE=true
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Instalación

### Prerrequisitos

- Node.js 18+ 
- npm o yarn

### Pasos

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/GentileGuido/social-2.0-proceso-0.1.git
   cd social-2.0-proceso-0.1
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**

   Para modo demo (recomendado):
   ```bash
   # .env.local
   NEXT_PUBLIC_DEMO_MODE=true
   ```

   Para modo Firebase:
   ```bash
   # .env.local
   NEXT_PUBLIC_DEMO_MODE=false
   NEXT_PUBLIC_ENABLE_FIREBASE=true
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

5. **Construir para producción**
   ```bash
   npm run build
   npm start
   ```

## Despliegue en Railway

### Configuración Rápida (Modo Demo)

1. Conecta tu repositorio a Railway
2. En las variables de entorno de Railway, agrega:
   ```
   NEXT_PUBLIC_DEMO_MODE=true
   ```
3. ¡Listo! La app funcionará sin Firebase

### Configuración Completa (Modo Firebase)

1. Configura Firebase en tu proyecto
2. En Railway, agrega todas las variables de Firebase:
   ```
   NEXT_PUBLIC_DEMO_MODE=false
   NEXT_PUBLIC_ENABLE_FIREBASE=true
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   # ... resto de variables Firebase
   ```

## Estructura del Proyecto

```
social-2.0-proceso-0.1/
├── components/          # Componentes reutilizables
│   ├── GroupCard.tsx   # Tarjeta de grupo
│   ├── Modal.tsx       # Modal genérico
│   └── ContextMenu.tsx # Menú contextual
├── contexts/           # Contextos de React
│   ├── AuthContext.tsx # Autenticación
│   ├── SocialContext.tsx # Datos sociales
│   └── ThemeContext.tsx # Temas
├── lib/               # Utilidades y configuración
│   ├── config.ts      # Configuración centralizada
│   ├── firebase.ts    # Configuración Firebase
│   └── storage/       # Capa de almacenamiento
│       ├── types.ts   # Tipos de almacenamiento
│       └── local.ts   # Implementación localStorage
├── pages/             # Páginas de Next.js
│   ├── _app.tsx       # App principal
│   └── index.tsx      # Página principal
└── styles/            # Estilos globales
    └── globals.css    # CSS global
```

## Tecnologías

- **Frontend**: Next.js 14, React 18, TypeScript
- **Estilos**: Tailwind CSS
- **Iconos**: Lucide React
- **Autenticación**: Firebase Auth (opcional)
- **Almacenamiento**: Firebase Firestore (opcional) / localStorage (demo)

## Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Construcción para producción
- `npm start` - Servidor de producción
- `npm run lint` - Linting del código

## Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Soporte

Si tienes problemas o preguntas:

1. Revisa los issues existentes
2. Crea un nuevo issue con detalles del problema
3. Para soporte inmediato, usa el modo demo que no requiere configuración

---

**Nota**: El modo demo es perfecto para pruebas, desarrollo y despliegues rápidos. Para producción con múltiples usuarios, considera usar el modo Firebase. 