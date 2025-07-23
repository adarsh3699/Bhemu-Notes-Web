# 📝 Bhemu Notes - Advanced Multi-User Notes Application

A sophisticated, feature-rich note-taking application built with React and Firebase, designed for personal productivity and seamless collaboration. Create, organize, and share beautifully formatted notes with advanced text editing capabilities.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://notes.bhemu.me)
[![Version](https://img.shields.io/badge/version-3.3.0-blue.svg)](https://github.com/adarsh3699/Bhemu-Notes-Web)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## 🌟 Features

### ✨ **Core Functionality**

-   **Rich Text Editor** - Advanced WYSIWYG editor with full formatting support (bold, italic, colors, fonts, lists, etc.)
-   **Real-time Synchronization** - Notes update instantly across all devices
-   **Multi-user Support** - Individual user accounts with personal note collections
-   **Folder Organization** - Group notes into custom folders for better organization
-   **Auto-save** - Notes save automatically as you type with Ctrl+S shortcut support

### 🤝 **Collaboration & Sharing**

-   **Note Sharing** - Generate shareable links for any note
-   **Permission Management** - Control who can view or edit shared notes
-   **Collaborative Editing** - Multiple users can work on shared notes simultaneously
-   **Share with Email** - Invite users directly via email addresses

### 📱 **User Experience**

-   **Responsive Design** - Seamless experience on desktop, tablet, and mobile
-   **Dark Theme** - Modern dark UI with Material Design components
-   **Keyboard Shortcuts** - Productivity shortcuts (Ctrl+S to save, etc.)
-   **Intuitive Interface** - Clean, distraction-free writing environment

### 🔒 **Security & Privacy**

-   **End-to-End Encryption** - All notes encrypted with AES before storage
-   **Multiple Authentication Methods** - Firebase Auth with email/password and Google Sign-In
-   **OAuth Integration** - Secure Google authentication with automatic account creation
-   **Private by Default** - Notes are private unless explicitly shared
-   **Data Protection** - Encrypted local storage for offline access

### 📤 **Export & Backup**

-   **Multiple Export Formats** - Export notes as PDF, HTML, and more
-   **Bulk Operations** - Export multiple notes or entire folders
-   **Print Support** - Print-friendly note formatting

## 🚀 Demo

-   **Live Application**: [notes.bhemu.me](https://notes.bhemu.me)
-   **Demo Account**:
    -   Email: `demo@bhemu.me`
    -   Password: `demo1234`

## 🛠️ Technology Stack

### **Frontend**

-   **React 18** - Modern React with hooks and functional components
-   **Material-UI (MUI)** - Professional UI components and theming
-   **React Router** - Client-side routing and navigation
-   **Quill.js** - Powerful rich text editor with modular architecture
-   **React Hot Keys** - Keyboard shortcut management

### **Backend & Services**

-   **Firebase Firestore** - Real-time NoSQL database
-   **Firebase Authentication** - Secure user management
-   **Firebase Storage** - File and image storage

### **Security & Utils**

-   **CryptoJS** - Client-side encryption/decryption
-   **Vite** - Fast build tooling and development server

## 📋 Prerequisites

-   Node.js (v14 or higher)
-   npm or yarn package manager
-   Firebase project with Firestore and Authentication enabled

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/adarsh3699/Bhemu-Notes-Web.git
cd Bhemu-Notes-Web
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Firebase Configuration

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Firestore Database** and **Authentication** (Email/Password + Google)
    - Go to Authentication → Sign-in method
    - Enable **Email/Password** provider
    - Enable **Google** provider and add your project support email
    - Add authorized domains (localhost, your production domain)
3. Get your Firebase config from Project Settings:
    - Go to Project Settings → General → Your apps
    - Select "Config" under SDK setup and configuration
    - Copy the configuration values
4. Create a `.env` file in the root directory:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project_id-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUSKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASURMENT_ID=your_measurement_id

# Encryption Key for Note Security (generate a strong random key)
VITE_ENCRYPTION_KEY=your_strong_encryption_key_here
```

> **Security**: Generate a strong encryption key for `VITE_ENCRYPTION_KEY`. You can use online tools or command: `openssl rand -base64 32`

### 4. Firestore Security Rules

Set up Firestore security rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /user_notes/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    match /user_data/{document} {
      allow read, write: if request.auth != null && request.auth.uid == document;
    }
  }
}
```

### 5. Google OAuth Setup (Production)

For production deployment, configure OAuth consent screen:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Navigate to **APIs & Services** → **OAuth consent screen**
4. Configure:
    - App name: "Bhemu Notes"
    - User support email
    - App logo (optional)
    - Privacy policy URL
    - Terms of service URL
5. Add your production domain to **Authorized domains**

### 6. Start Development Server

```bash
npm run dev
```

The application will open at [http://localhost:5173](http://localhost:5173)

## 🏗️ Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

## 📁 Project Structure

```
src/
├── components/           # Reusable React components
│   ├── dialogs/         # Modal dialogs (share, export, etc.)
│   ├── homePage/        # Main app components
│   │   ├── navBar/      # Navigation and folders
│   │   ├── renderAllNotes/      # Notes list sidebar
│   │   └── renderNoteContent/   # Rich text editor
│   ├── loader/          # Loading components
│   ├── settingsPage/    # User settings components
│   └── showMsg/         # Notification messages
├── firebase/            # Firebase integration
│   ├── auth.js          # Authentication functions
│   ├── notes.js         # Notes CRUD operations
│   ├── features.js      # Additional Firebase features
│   └── initFirebase.js  # Firebase configuration
├── pages/               # Main application pages
├── styles/              # CSS stylesheets
├── img/                 # Static images and assets
├── utils.js             # Utility functions
└── routes.js            # Application routing
```

## 🔐 Security Features

-   **Client-side Encryption**: All notes are encrypted using AES before being stored
-   **Multiple Authentication Methods**: Firebase Authentication with email/password and Google OAuth
-   **Permission-based Sharing**: Granular control over note access and editing rights
-   **Environment Security**: Sensitive configuration stored in environment variables
-   **HTTPS Only**: All communications secured with SSL/TLS

## 🎯 Usage Guide

### Getting Started - Sign Up/Login

**Multiple Authentication Options:**

1. **Email & Password**: Create an account with your email address
2. **Google Sign-In**: Use your Google account for instant access
    - Click "Continue with Google" on login or registration page
    - Authorize the app to access your basic profile information
    - Automatic account creation for new Google users

### Creating Your First Note

1. Sign up for an account or log in
2. Click "+" to create a new note
3. Start typing - the note auto-saves as you work
4. Use the toolbar for formatting options

### Organizing with Folders

1. Click "New Folder" in the sidebar
2. Drag and drop notes into folders
3. Click folders to view contained notes

### Sharing Notes

1. Open any note
2. Click the share icon in the toolbar
3. Add email addresses of collaborators
4. Set view/edit permissions
5. Share the generated link

### Keyboard Shortcuts

-   `Ctrl/Cmd + S` - Save note
-   `Ctrl/Cmd + Alt + N` - New note

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Adarsh Suman**

-   Website: [bhemu.me](https://bhemu.me)
-   Email: adarsh3699@gmail.com

## 🙏 Acknowledgments

-   [Quill.js](https://quilljs.com/) for the powerful rich text editor
-   [Material-UI](https://mui.com/) for the beautiful component library
-   [Firebase](https://firebase.google.com/) for backend services
-   [CryptoJS](https://github.com/brix/crypto-js) for encryption utilities

## 📊 Version History

-   **v3.3.0** - Current version with advanced sharing and export features
-   **v3.2.x** - Added folder organization and improved UI
-   **v3.1.x** - Enhanced security with encryption
-   **v3.0.x** - Major rewrite with React 18 and modern architecture

---

⭐ **Star this repository if you find it useful!**
