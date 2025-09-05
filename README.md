# LiveCode Editor 🚀

A powerful, intelligent code editor that enhances your coding experience with advanced features, AI assistance, and seamless integration. Built with Next.js, TypeScript, and modern web technologies.

![LiveCode Editor](public/hero.svg)

## ✨ Features

### 🎯 Core Features
- **Multi-Template Support**: Start with React.js, Next.js, Express, Vue.js, Angular, or Hono templates
- **Real-time Code Editor**: Monaco Editor with syntax highlighting and IntelliSense
- **Live Preview**: Instant preview with WebContainer technology
- **File Management**: Complete file explorer with create, edit, delete, and rename operations
- **AI Code Assistance**: Intelligent code suggestions and completions
- **Terminal Integration**: Built-in terminal with command execution
- **Project Management**: Dashboard to manage all your coding projects

### 🤖 AI-Powered Development
- **Smart Code Completion**: Context-aware code suggestions
- **Real-time Assistance**: AI suggestions as you type
- **Multiple Languages**: Support for JavaScript, TypeScript, Python, and more
- **Framework Detection**: Automatic detection of React, Vue, Angular, and other frameworks

### 🎨 Modern UI/UX
- **Dark/Light Theme**: Seamless theme switching
- **Responsive Design**: Works perfectly on desktop and mobile
- **Intuitive Interface**: Clean, modern design with excellent UX
- **Customizable Layout**: Resizable panels and flexible workspace

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Monaco Editor** - VS Code editor in the browser
- **Zustand** - State management

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Prisma** - Database ORM
- **PostgreSQL** - Primary database
- **NextAuth.js** - Authentication system

### Development Tools
- **WebContainer** - Browser-based Node.js runtime
- **Docker** - Containerization
- **ESLint** - Code linting
- **Prettier** - Code formatting

### AI Integration
- **Ollama** - Local AI model integration
- **CodeLlama** - Code generation model

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/livecode-editor.git
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

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Authentication pages
│   │   ├── (root)/            # Public pages
│   │   ├── api/               # API routes
│   │   ├── dashboard/         # Dashboard pages
│   │   └── playground/        # Code editor pages
│   ├── components/            # Reusable UI components
│   │   └── ui/               # Shadcn/ui components
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

1. **Sign in** with GitHub or Google
2. **Navigate to Dashboard** and click "Add New"
3. **Select a Template** from available options:
   - React.js - Component-based UI library
   - Next.js - Full-stack React framework
   - Express - Node.js web framework
   - Vue.js - Progressive JavaScript framework
   - Angular - Enterprise web framework
   - Hono - Fast, lightweight web framework

4. **Configure your project** with name and description
5. **Start coding** in the integrated editor

### Using the Editor

- **File Explorer**: Navigate and manage your project files
- **Code Editor**: Write code with syntax highlighting and IntelliSense
- **Live Preview**: See changes instantly in the preview panel
- **Terminal**: Execute commands and manage your development environment
- **AI Assistant**: Get intelligent code suggestions and completions

### AI Features

- **Auto-completion**: Press `Tab` to accept AI suggestions
- **Context-aware**: AI understands your project structure and framework
- **Multiple triggers**: Suggestions appear on typing, new lines, and specific characters
- **Toggle AI**: Enable/disable AI assistance as needed

## 🔧 Configuration

### Database Schema

The project uses Prisma with the following main models:

- **User**: User accounts and authentication
- **Playground**: Code projects and metadata
- **TemplateFile**: Project file contents
- **StarMark**: Favorite projects functionality

### Template System

Templates are stored in `public/LiveCode-starters/` and configured in `template.ts`. Each template includes:

- Complete project structure
- Package.json with dependencies
- Starter code and configuration
- Build and development scripts

### AI Configuration

AI features require Ollama running locally:

```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull CodeLlama model
ollama pull codellama:latest

# Start Ollama server
ollama serve
```

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
npm run dev          # Start development server
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
- **Prettier**: Code formatting (configured in CI/CD)
- **TypeScript**: Strict type checking
- **Husky**: Git hooks for quality checks

### Testing

```bash
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
```

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
- Add tests for new features
- Update documentation as needed
- Ensure TypeScript types are properly defined

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
```

### Template API

```typescript
GET /api/template/[id]
// Returns template structure for playground
```

## 🔒 Security

- **Authentication**: Secure OAuth with GitHub and Google
- **Authorization**: Role-based access control
- **Data Protection**: Encrypted sensitive data
- **CORS**: Properly configured for security
- **Input Validation**: Server-side validation for all inputs

## 🌟 Roadmap

### Upcoming Features

- [ ] **Collaborative Editing**: Real-time collaboration
- [ ] **Git Integration**: Version control within the editor
- [ ] **Plugin System**: Extensible architecture
- [ ] **Mobile App**: Native mobile applications
- [ ] **Advanced AI**: More sophisticated AI features
- [ ] **Deployment Integration**: One-click deployment to various platforms

### Long-term Goals

- [ ] **Multi-language Support**: Support for more programming languages
- [ ] **Enterprise Features**: Team management and advanced collaboration
- [ ] **Performance Optimization**: Enhanced speed and efficiency
- [ ] **Accessibility**: Full accessibility compliance

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Abhishek Sharma** - [GitHub](https://github.com/abhitheq)

## 🙏 Acknowledgments

- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - VS Code editor
- [WebContainer](https://webcontainer.io/) - Browser-based Node.js runtime
- [Shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Prisma](https://prisma.io/) - Database toolkit
- [NextAuth.js](https://next-auth.js.org/) - Authentication library

## 📞 Support

- **Documentation**: [Coming Soon]
- **Issues**: [GitHub Issues](https://github.com/your-username/livecode-editor/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/livecode-editor/discussions)

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/abhitheq">Abhishek Sharma</a></p>
  <p>⭐ Star this repository if you find it helpful!</p>
</div>