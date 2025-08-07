# Social Web Application

A modern, production-ready social networking web application built with Next.js, TypeScript, and Firebase. This app allows users to manage groups and names with real-time updates, search functionality, and PWA support.

## Features

- **Real-time Data**: Firebase Firestore integration with live updates
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **PWA Support**: Installable on desktop and mobile devices
- **Theme Customization**: Three preset color themes (blue, green, red)
- **Search & Filter**: Real-time search across groups and names
- **Context Menus**: Right-click and long-press interactions
- **Import/Export**: Data backup and restore functionality
- **TypeScript**: Full type safety throughout the application

## Prerequisites

- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher
- **Firebase Project**: A Firebase project with Firestore enabled

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd social-web
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Firebase Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Firestore Database:
   - Go to Firestore Database in the sidebar
   - Click "Create Database"
   - Choose "Start in test mode" for development
   - Select a location close to your users

4. Get your Firebase configuration:
   - Go to Project Settings (gear icon)
   - Scroll down to "Your apps"
   - Click "Add app" and select Web
   - Copy the configuration object

### 4. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
social-web/
├── components/          # Reusable React components
├── contexts/           # React contexts for state management
├── lib/               # Utility libraries (Firebase config)
├── pages/             # Next.js pages
├── public/            # Static assets and PWA files
├── styles/            # Global styles
├── types/             # TypeScript type definitions
├── .eslintrc.json     # ESLint configuration
├── .prettierrc        # Prettier configuration
├── next.config.js     # Next.js configuration
├── package.json       # Dependencies and scripts
├── tailwind.config.js # Tailwind CSS configuration
└── tsconfig.json      # TypeScript configuration
```

## Data Model

### Firestore Collections

#### Groups Collection (`/groups`)
```typescript
{
  id: string,
  name: string,
  updatedAt: Timestamp
}
```

#### Names Collection (`/names`)
```typescript
{
  id: string,
  firstName: string,
  notes: string,
  groupId: string,
  createdAt: Timestamp
}
```

## Features in Detail

### Real-time Updates
- All data changes are reflected immediately across all connected clients
- Uses Firebase Firestore real-time listeners

### Search Functionality
- Search across group names and name details
- Auto-expands groups with matching results
- Real-time filtering as you type

### Context Menus
- Right-click on desktop for context menus
- Long-press on mobile devices
- Edit, delete, and move operations

### Theme System
- Three preset themes: Blue, Green, Red
- Theme selection persisted in localStorage
- CSS variables for dynamic theming

### PWA Features
- Installable on desktop and mobile
- Offline caching of static assets
- Service worker for background sync
- App manifest for native app experience

### Import/Export
- Export all data as JSON file
- Import functionality (placeholder for future implementation)
- Data backup and restore capabilities

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy with one click

### Manual Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

### Environment Variables for Production

Make sure to set these environment variables in your deployment platform:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

## Development

### Code Quality

The project uses:
- **ESLint** for code linting
- **Prettier** for code formatting
- **Husky** for pre-commit hooks
- **TypeScript** for type safety

### Adding New Features

1. Create new components in `components/`
2. Add types in `types/index.ts`
3. Update contexts if needed
4. Add new pages in `pages/`

### Firebase Security Rules

For production, update your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /groups/{groupId} {
      allow read, write: if true; // For development
    }
    match /names/{nameId} {
      allow read, write: if true; // For development
    }
  }
}
```

## Troubleshooting

### Common Issues

1. **Firebase Connection Error**
   - Check your environment variables
   - Verify Firebase project settings
   - Ensure Firestore is enabled

2. **Build Errors**
   - Run `npm run type-check` to check TypeScript errors
   - Run `npm run lint` to check for linting issues

3. **PWA Not Installing**
   - Check that `manifest.json` is accessible
   - Verify service worker registration
   - Test on HTTPS (required for PWA)

### Development Tips

- Use the Firebase Emulator for local development
- Check browser console for service worker logs
- Use React DevTools for component debugging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review Firebase documentation
3. Open an issue on GitHub

---

Built with ❤️ using Next.js, TypeScript, and Firebase 