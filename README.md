# Social Web 2.0 - Proceso 0.1

A modern social networking application built with Next.js, Tailwind CSS, and Firebase. This application allows users to manage groups and names with a beautiful, responsive interface.

## 🚀 Features

### 🔐 Authentication
- **Google Sign-In Only**: Users must authenticate using their Google account
- **Private Data Storage**: Each user has their own private Firestore namespace
- **Automatic Data Loading**: User data is automatically loaded upon login

### 🎨 Three-Dot Options Menu
- **Export**: Download JSON files for individual groups and names
- **Edit**: Open modals to update group or name text and notes
- **Delete**: Confirmation prompts before deletion
- **Settings**: Global three-dot menu with sorting options

### 🎯 Centered "+" Button
- **Smart Positioning**: Centered at the bottom of the viewport
- **Context-Aware**: Creates groups when no group is expanded, adds names when one group is expanded
- **Auto-Close**: Modals close automatically after successful creation
- **Styled Design**: Solid colored circle with theme color

### 🌓 Dim Other Groups on Expand
- **Visual Feedback**: When one group is expanded, other groups are dimmed to 50% gray
- **Focus Enhancement**: Helps users focus on the active group

### 🎨 Theme Color Selector
- **Seven Color Options**: C, M, Y, K, R, G, B (Cyan, Magenta, Yellow, Black, Red, Green, Blue)
- **Circular Buttons**: Clean, modern interface
- **Persistent Settings**: Theme selection is saved to localStorage

### 🌍 Localization
- **Spanish Interface**: All user-facing text translated to Spanish
- **Complete Coverage**: Buttons, menus, modals, validation messages, headings

### 📱 Responsive Design
- **Mobile-First**: Optimized for both mobile and desktop screens
- **Touch-Friendly**: Long-press support for context menus
- **Adaptive Layout**: Responsive grid and spacing

## 🛠️ Technical Stack

- **Framework**: Next.js 14.0.0
- **Styling**: Tailwind CSS 3.3.5
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth (Google)
- **Icons**: Lucide React
- **Language**: TypeScript

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd social-2.0-proceso-0.1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a new Firebase project
   - Enable Google Authentication
   - Enable Firestore Database
   - Copy your Firebase configuration

4. **Configure environment variables**
   ```bash
   cp env.example .env.local
   ```
   Edit `.env.local` with your Firebase configuration:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=social20proceso01.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=social20proceso01
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=social20proceso01.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id # optional
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## 🗂️ Project Structure

```
social-2.0-proceso-0.1/
├── components/
│   ├── ContextMenu.tsx      # Three-dot options menu
│   ├── GroupCard.tsx        # Group display component
│   └── Modal.tsx           # Reusable modal component
├── contexts/
│   ├── AuthContext.tsx      # Firebase authentication
│   ├── SocialContext.tsx    # Data management
│   └── ThemeContext.tsx     # Theme management
├── lib/
│   ├── env.ts              # Environment validation
│   └── firebase.ts         # Firebase configuration
├── pages/
│   ├── _app.tsx            # App wrapper
│   └── index.tsx           # Main application
├── styles/
│   └── globals.css         # Global styles
└── types/
    └── index.ts            # TypeScript definitions
```

## 🔧 Key Features Implementation

### Environment Validation
- **Robust ENV Handling**: Sanitizes and validates Firebase environment variables
- **Unicode Character Handling**: Replaces en-dash/em-dash with hyphens
- **Whitespace Normalization**: Removes non-breaking spaces and trims values
- **Build-time Validation**: Errors are caught during initialization

### Firebase Initialization
- **Singleton Pattern**: Firebase is initialized only once using `getApps()/getApp()`
- **Error Handling**: Graceful error handling without blocking the UI
- **Analytics Support**: Optional analytics initialization if measurementId is provided

### Authentication Flow
- Users are redirected to Google sign-in if not authenticated
- User data is isolated by `userId` field in Firestore
- Real-time data synchronization with Firebase

### Data Management
- **Groups**: Collections with name, userId, and updatedAt
- **Names**: Collections with firstName, notes, groupId, userId, and createdAt
- **Export**: JSON download for individual items
- **Sorting**: A→Z, Z→A, and Recent options

### UI/UX Features
- **Responsive Design**: Works on all screen sizes
- **Theme System**: Seven color themes with CSS variables
- **Loading States**: Smooth loading indicators
- **Error Handling**: Graceful error messages
- **Accessibility**: ARIA labels and keyboard navigation

## 🎯 Usage

1. **Sign In**: Click "Continuar con Google" to authenticate
2. **Create Groups**: Click the "+" button when no group is expanded
3. **Add Names**: Expand a group and click the "+" button
4. **Manage Items**: Use the three-dot menu for export, edit, or delete
5. **Customize**: Access settings to change theme and sorting options

## 🔒 Security

- **User Isolation**: All data is scoped to the authenticated user
- **Firebase Security Rules**: Recommended to implement proper Firestore security rules
- **Environment Variables**: Sensitive configuration is stored in environment variables

## 🚀 Deployment

### Railway Deployment

1. **Connect to Railway**
   - Connect your GitHub repository to Railway
   - Railway will automatically detect Next.js

2. **Configure Environment Variables**
   Add these variables in Railway (Service level, not Shared):
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=social20proceso01.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=social20proceso01
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=social20proceso01.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=863308509063
   NEXT_PUBLIC_FIREBASE_APP_ID=1:863308509063:web:a5cfc8e50e8f301f3a2d22
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-J3PB5L78EH
   ```

3. **Deploy**
   - Railway will automatically build and deploy on push to main
   - The app will be available at your Railway URL

### Firebase Configuration

1. **Authorized Domains**
   Add these domains to Firebase Auth:
   - `localhost` (for development)
   - `social20proceso01.web.app`
   - `social20proceso01.firebaseapp.com`
   - `your-railway-app.up.railway.app`

2. **Firestore Rules**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId}/{document=**} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support or questions, please open an issue in the repository. 