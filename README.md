# TataPlay Streaming Manager

A modern web application for TataPlay IPTV streaming service integration with OTP authentication and M3U playlist generation.

## 🚀 Features

- **🔐 Secure OTP Authentication** - Mobile number verification via TataPlay API
- **📺 IPTV Playlist Generation** - Automated M3U playlist creation with channel data
- **🎬 DRM Content Support** - Widevine and PlayReady content protection
- **📱 Mobile-First Design** - Responsive UI with TataPlay branding
- **⚡ Real-time Streaming** - Live TV channel manifest proxy
- **🔄 Session Management** - Persistent device-based authentication
- **🎯 External Player Support** - Compatible with VLC, TiviMate, Kodi, and more

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Wouter** for client-side routing
- **TanStack Query** for state management
- **Radix UI** components

### Backend
- **Express.js** with TypeScript
- **Drizzle ORM** for database operations
- **Zod** for data validation
- **In-memory storage** (upgradeable to PostgreSQL)

### Build Tools
- **Vite** for development and building
- **ESBuild** for server bundling
- **PostCSS** with Tailwind

## 📋 Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- Valid TataPlay subscription (for API access)

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/tataplay-streaming-manager.git
cd tataplay-streaming-manager
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```

### 4. Open in browser
Navigate to `http://localhost:5000`

## 📖 Usage

### Authentication Flow
1. **Splash Screen** - TataPlay branded loading experience
2. **Mobile Login** - Enter your 10-digit mobile number
3. **OTP Verification** - Receive and enter 4-digit OTP
4. **Dashboard** - Access streaming features

### Generating Playlists
1. After successful login, click **"Download M3U Playlist"**
2. Use the playlist file in your preferred IPTV player
3. Or copy the playlist URL for direct streaming

### Supported Players
- **TiviMate** (Android TV)
- **VLC Media Player** (Desktop/Mobile)
- **Kodi** (Media Center)
- **SparkleTV** (Smart TV)
- Any M3U/MPD compatible player

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/send-otp` | Send OTP to mobile number |
| `POST` | `/api/auth/verify-otp` | Verify OTP and login |
| `GET` | `/api/auth/status` | Check authentication status |
| `POST` | `/api/auth/logout` | Logout and clear session |
| `GET` | `/api/playlist.m3u` | Generate M3U playlist |
| `GET` | `/api/manifest.mpd` | Stream manifest proxy |

## 🏗️ Project Structure

```
tataplay-streaming-manager/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Route pages
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utilities and config
├── server/                 # Express backend
│   ├── services/           # External API integrations
│   ├── routes.ts           # API route definitions
│   ├── storage.ts          # Data storage layer
│   └── index.ts            # Server entry point
├── shared/                 # Shared type definitions
└── docs/                   # Documentation
```

## ⚙️ Configuration

### Environment Variables
```bash
# Optional - PostgreSQL database URL
DATABASE_URL=postgresql://user:password@localhost:5432/database

# Optional - Custom port (defaults to 5000)
PORT=5000

# Optional - Environment mode
NODE_ENV=development
```

### Build Scripts
```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run code linting
```

## 🔒 Security Features

- **Device-based Sessions** - Unique device identification
- **OTP Verification** - Two-factor authentication
- **Session Expiration** - Automatic cleanup after 24 hours
- **Request Validation** - Zod schema validation
- **CORS Protection** - Cross-origin request security

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Deploy to Cloud
- **Vercel/Netlify** - Frontend deployment
- **Railway/Heroku** - Full-stack deployment
- **VPS/Docker** - Self-hosted deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This project is for educational and personal use only. Users must have valid TataPlay subscriptions to access streaming content. The developers are not responsible for any misuse of the application.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/tataplay-streaming-manager/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/tataplay-streaming-manager/discussions)
- **Documentation**: [Wiki](https://github.com/yourusername/tataplay-streaming-manager/wiki)

## 🏆 Acknowledgments

- TataPlay for the streaming service API
- React and Express.js communities
- Open source contributors

---

**Made with ❤️ by [Your Name]**

*Star ⭐ this repo if you find it useful!*