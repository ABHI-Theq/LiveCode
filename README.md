# LiveCode Editor 🚀

A powerful, intelligent code editor that enhances your coding experience with advanced features, AI assistance, and seamless integration. Built with Next.js, TypeScript, and modern web technologies.

![LiveCode Editor](public/hero.svg)

## ✨ Features

### 🎯 Core Features
- **Multi-Template Support**: Start with React.js, Next.js, Express, Vue.js, Angular, or Hono templates
- **Real-time Code Editor**: Monaco Editor with syntax highlighting and IntelliSense
- **Live Preview**: Instant preview with WebContainer technology
- **File Management**: Complete file explorer with create, edit, delete, and rename operations
- **AI Code Assistance**: Intelligent code suggestions and completions powered by CodeLlama
- **Terminal Integration**: Built-in terminal with command execution
- **Project Management**: Dashboard to manage all your coding projects

### 🤖 AI-Powered Development
- **Smart Code Completion**: Context-aware code suggestions using local AI models
- **Real-time Assistance**: AI suggestions as you type with Tab to accept
- **Multiple Languages**: Support for JavaScript, TypeScript, Python, and more
- **Framework Detection**: Automatic detection of React, Vue, Angular, and other frameworks
- **Toggle AI**: Enable/disable AI assistance as needed

### 🎨 Modern UI/UX
- **Dark/Light Theme**: Seamless theme switching with next-themes
- **Responsive Design**: Works perfectly on desktop and mobile
- **Intuitive Interface**: Clean, modern design with excellent UX using Radix UI
- **Customizable Layout**: Resizable panels and flexible workspace

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Monaco Editor** - VS Code editor in the browser
- **Zustand** - State management

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Prisma** - Database ORM with PostgreSQL
- **NextAuth.js v5** - Authentication system with GitHub and Google OAuth

### Development Tools
- **WebContainer** - Browser-based Node.js runtime
- **Docker** - Containerization
- **ESLint** - Code linting
- **Prettier** - Code formatting

### AI Integration
- **Ollama** - Local AI model integration
- **CodeLlama** - Code generation model for intelligent suggestions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Git
- Ollama (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/abhitheq/livecode-editor.git
   cd livecode-editor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```env
   DATABASE_URL="your-postgresql-connection-string"
   GITHUB_ID="your-github-oauth-app-id"
   GITHUB_SECRET="your-github-oauth-app-secret"
   GOOGLE_ID="your-google-oauth-client-id"
   GOOGLE_SECRET="your-google-oauth-client-secret"
   AUTH_SECRET="your-nextauth-secret"
   NODE_ENV="development"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Set up AI (Optional)**
   ```bash
   # Install Ollama
   curl -fsSL https://ollama.ai/install.sh | sh
   
   # Pull CodeLlama model
   ollama pull codellama:latest
   
   # Start Ollama server
   ollama serve
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Authentication pages
│   │   │   └── auth/          # Sign-in page
│   │   ├── (root)/            # Public pages (home)
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # NextAuth.js endpoints
│   │   │   ├── code-suggestion/ # AI code suggestion API
│   │   │   └── template/      # Template loading API
│   │   ├── dashboard/         # Dashboard pages
│   │   └── playground/        # Code editor pages
│   ├── components/            # Reusable UI components
│   │   └── ui/               # Radix UI components
│   ├── features/             # Feature-based modules
│   │   ├── ai/               # AI assistance features
│   │   ├── auth/             # Authentication logic
│   │   ├── dashboard/        # Dashboard functionality
│   │   ├── playground/       # Code editor features
│   │   └── webcontainer/     # WebContainer integration
│   ├── hooks/                # Custom React hooks
│   └── lib/                  # Utility libraries
├── public/                   # Static assets
│   └── LiveCode-starters/    # Template starter projects
├── prisma/                   # Database schema
└── template.ts              # Template configuration
```

## 🎮 Usage

### Creating a New Project

1. **Sign in** with GitHub or Google OAuth
2. **Navigate to Dashboard** and click "Add New"
3. **Select a Template** from available options:
   - **React.js** - Component-based UI library with TypeScript
   - **Next.js** - Full-stack React framework with App Router
   - **Express** - Node.js web framework for APIs
   - **Vue.js** - Progressive JavaScript framework
   - **Angular** - Enterprise web framework with TypeScript
   - **Hono** - Fast, lightweight web framework

4. **Configure your project** with name and description
5. **Start coding** in the integrated Monaco editor

### Using the Editor

- **File Explorer**: Navigate and manage your project files with full CRUD operations
- **Code Editor**: Write code with syntax highlighting, IntelliSense, and AI assistance
- **Live Preview**: See changes instantly in the WebContainer-powered preview panel
- **Terminal**: Execute commands and manage your development environment
- **AI Assistant**: Get intelligent code suggestions with Tab to accept

### AI Features

- **Auto-completion**: AI suggestions appear as you type
- **Context-aware**: AI understands your project structure and framework
- **Multiple triggers**: Suggestions on typing, new lines, and specific characters
- **Toggle AI**: Enable/disable AI assistance in the dropdown menu
- **Local Processing**: Uses Ollama for privacy-focused AI assistance

## 🔧 Configuration

### Database Schema

The project uses Prisma with PostgreSQL and includes these main models:

- **User**: User accounts with OAuth authentication
- **Account**: OAuth provider accounts (GitHub, Google)
- **Playground**: Code projects and metadata
- **TemplateFile**: Project file contents stored as JSON
- **StarMark**: Favorite projects functionality

### Template System

Templates are stored in `public/LiveCode-starters/` and configured in `template.ts`. Each template includes:

- Complete project structure with all necessary files
- Package.json with dependencies and scripts
- Starter code and configuration files
- Build and development scripts

### AI Configuration

AI features require Ollama running locally with CodeLlama model:

```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull CodeLlama model
ollama pull codellama:latest

# Start Ollama server (runs on http://127.0.0.1:11434)
ollama serve
```

The AI service endpoint is configured in `/api/code-suggestion` and provides:
- Context-aware code completion
- Framework-specific suggestions
- Multi-language support
- Real-time suggestion generation

## 🐳 Docker Deployment

### Using Docker Compose

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Docker Build

```bash
# Build the image
docker build -t livecode-editor .

# Run the container
docker run -p 3000:3000 \
  -e DATABASE_URL="your-db-url" \
  -e GITHUB_ID="your-github-id" \
  -e GITHUB_SECRET="your-github-secret" \
  livecode-editor
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - Vercel will automatically build and deploy

### Other Platforms

The project can be deployed to any platform supporting Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🧪 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npx prisma studio    # Open Prisma Studio
npx prisma generate  # Generate Prisma client
npx prisma db push   # Push schema changes
```

### Code Quality

- **ESLint**: Configured with Next.js and TypeScript rules
- **Prettier**: Code formatting
- **TypeScript**: Strict type checking
- **GitHub Actions**: Automated CI/CD pipeline

### Key Features Implementation

- **File Explorer**: Built with Radix UI Sidebar and custom tree components
- **Monaco Editor**: Integrated with custom themes and AI suggestion overlay
- **WebContainer**: Browser-based Node.js runtime for live preview
- **AI Integration**: Custom hook system for managing AI suggestions
- **State Management**: Zustand for file explorer and editor state

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and ensure tests pass
4. **Commit your changes**: `git commit -m 'Add amazing feature'`
5. **Push to the branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style and patterns
- Write meaningful commit messages
- Add proper TypeScript types
- Update documentation as needed
- Test AI features with Ollama running locally

## 📚 API Reference

### Code Suggestion API

```typescript
POST /api/code-suggestion
{
  "fileContent": "string",
  "cursorLine": number,
  "cursorColumn": number,
  "suggestionType": "completion" | "refactor" | "explain",
  "fileName": "string"
}

Response:
{
  "suggestion": "string",
  "context": {
    "language": "string",
    "framework": "string",
    "cursorPosition": { "line": number, "column": number }
  },
  "metadata": {
    "generatedAt": "string"
  }
}
```

### Template API

```typescript
GET /api/template/[id]
// Returns template structure for playground initialization
```

## 🔒 Security

- **Authentication**: Secure OAuth with GitHub and Google using NextAuth.js v5
- **Authorization**: User-based access control with Prisma
- **Data Protection**: Secure session management
- **CORS**: Properly configured for WebContainer integration
- **Input Validation**: Server-side validation for all inputs

## 🌟 Roadmap

### Upcoming Features

- [ ] **Collaborative Editing**: Real-time collaboration with multiple users
- [ ] **Git Integration**: Version control within the editor
- [ ] **Plugin System**: Extensible architecture for custom extensions
- [ ] **Mobile App**: Native mobile applications
- [ ] **Advanced AI**: More sophisticated AI features and models
- [ ] **Deployment Integration**: One-click deployment to various platforms

### Long-term Goals

- [ ] **Multi-language Support**: Support for Python, Java, Go, and more
- [ ] **Enterprise Features**: Team management and advanced collaboration
- [ ] **Performance Optimization**: Enhanced speed and efficiency
- [ ] **Accessibility**: Full accessibility compliance

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Abhishek Sharma** - [GitHub](https://github.com/abhitheq)

## 🙏 Acknowledgments

- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - VS Code editor in the browser
- [WebContainer](https://webcontainer.io/) - Browser-based Node.js runtime
- [Radix UI](https://www.radix-ui.com/) - Accessible UI components
- [Prisma](https://prisma.io/) - Database toolkit and ORM
- [NextAuth.js](https://next-auth.js.org/) - Authentication library
- [Ollama](https://ollama.ai/) - Local AI model runtime
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/abhitheq/livecode-editor/issues)
- **Discussions**: [GitHub Discussions](https://github.com/abhitheq/livecode-editor/discussions)
- **Documentation**: Available in the `/docs` section

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/abhitheq">Abhishek Sharma</a></p>
  <p>⭐ Star this repository if you find it helpful!</p>
</div>