# 📸 PhotoLab - Professional Photo Editor

A simple, free, and secure browser-based photo editor with essential editing tools, filters, and drawing capabilities.

**🌐 Live Demo: [Your PhotoLab URL]**

## ✨ Features

- **Basic Editing Tools**: Brightness, contrast, and rotation adjustments with real-time preview
- **Creative Filters**: Grayscale, sepia, and invert filters for artistic expression
- **Drawing & Annotations**: Customizable brush sizes and colors for markup and creative touches
- **Multiple Format Support**: Edit JPG, PNG, WebP, and GIF images
- **Client-Side Processing**: All editing happens in your browser - your photos never leave your device
- **Instant Preview**: See edits in real-time as you work
- **One-Click Download**: Save your enhanced photos instantly
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **No Sign-up Required**: Start editing immediately without creating an account

## 🎯 Why PhotoLab?

PhotoLab makes basic photo editing accessible and privacy-focused. The project focuses on:

- **Privacy First**: Complete client-side processing ensures your photos remain private
- **Essential Tools**: Core editing features for everyday photo enhancement
- **Instant Results**: Real-time preview and fast processing
- **Universal Access**: No software downloads or accounts required
- **Simple Interface**: Clean, easy-to-use toolset for common editing tasks

## 🛠️ Tech Stack

### Frontend

- **[SvelteKit](https://kit.svelte.dev/)** - Full-stack framework
- **[Svelte](https://svelte.dev/)** - Reactive UI framework with latest runes API
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling
- **[Vite](https://vitejs.dev/)** - Fast build tool

### Image Processing

- **HTML5 Canvas API** - High-performance image manipulation
- **File API** - Secure client-side file handling
- **Custom Filters** - Optimized image processing algorithms

### Testing

- **[Vitest](https://vitest.dev/)** - Unit testing framework
- **[Playwright](https://playwright.dev/)** - End-to-end testing
- **Browser Testing** - Real browser environment testing

### Development Tools

- **[ESLint](https://eslint.org/)** - Code linting
- **[Prettier](https://prettier.io/)** - Code formatting
- **[svelte-check](https://github.com/sveltejs/language-tools)** - TypeScript validation

### Deployment

- **[GitHub Actions](https://github.com/features/actions)** - CI/CD pipeline
- **[Firebase Hosting](https://firebase.google.com/products/hosting)** - Fast, secure hosting

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone [your-repo-url]
cd ai_photo_web_app_show_case

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see PhotoLab running.

## 🧪 Testing

PhotoLab includes comprehensive test coverage for reliable photo editing functionality.

```bash
# Run all tests (unit + e2e)
npm test

# Run only unit tests
npm run test:unit

# Run only e2e tests
npm run test:e2e

# Run unit tests in watch mode (development)
npm run test:unit -- --watch
```

### Test Coverage

- **Unit Tests**: Core editing logic and utilities
- **Browser Tests**: Canvas API operations and image processing
- **E2E Tests**: User workflows, file upload, editing, and download

## 🏗️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run format       # Format code with Prettier
npm run lint         # Check formatting and run ESLint
npm run check        # TypeScript validation with svelte-check
```

### Project Structure

```
src/
├── lib/
│   ├── components/          # Svelte components
│   │   ├── FileUpload.svelte
│   │   ├── PhotoCanvas.svelte
│   │   ├── ControlsPanel.svelte
│   │   ├── Header.svelte
│   │   └── Footer.svelte
│   ├── sections/           # Landing page sections
│   │   ├── FeaturesSection.svelte
│   │   ├── HowItWorksSection.svelte
│   │   ├── PhotoEditingUseCasesSection.svelte
│   │   ├── SupportedFormatsSection.svelte
│   │   ├── PhotoEditingTipsSection.svelte
│   │   └── FAQSection.svelte
│   ├── stores/            # Svelte stores
│   │   └── photoEditor.svelte.ts
│   └── utils/            # Utility functions
│       ├── canvasUtils.ts
│       ├── imageProcessing.ts
│       └── drawingUtils.ts
├── routes/               # SvelteKit routes
│   └── +page.svelte     # Homepage
tests/
├── unit/               # Unit tests
├── e2e/               # End-to-end tests
└── fixtures/          # Test assets
```

### Key Components

- **PhotoCanvas**: Main canvas component for image display and drawing
- **ControlsPanel**: Editing controls (brightness, contrast, filters, etc.)
- **FileUpload**: Drag & drop file upload interface
- **Photo Editor Store**: State management for editing operations

## 🎨 Photo Editing Features

### Basic Adjustments

- **Brightness**: Fine-tune image lighting (-100 to +100)
- **Contrast**: Enhance or reduce contrast (-100 to +100)
- **Rotation**: Rotate images in 90-degree increments

### Creative Filters

- **Grayscale**: Convert to black and white
- **Sepia**: Apply vintage warm tone effect
- **Invert**: Create negative/inverted color effect

### Drawing Tools

- **Freehand Drawing**: Basic brush with adjustable size and color
- **Simple Annotations**: Add drawings and markup to images

## 🌐 Deployment

PhotoLab can be deployed to any static hosting platform:

### Firebase Hosting (Recommended)

```bash
# Build the project
npm run build

# Deploy to Firebase (requires Firebase CLI)
firebase deploy
```

### Other Platforms

- **Vercel**: Connect your GitHub repo for automatic deployments
- **Netlify**: Drag & drop the `build` folder
- **GitHub Pages**: Use the static adapter and deploy the build folder

## 🔧 Configuration

### Environment Setup

- No environment variables required for basic functionality
- All image processing happens client-side
- Optional: Firebase configuration for hosting

### Performance Optimization

- Images are processed using optimized Canvas operations
- Real-time preview with debounced updates
- Efficient memory management for large images

## 📱 Browser Support

PhotoLab works on all modern browsers:

- **Chrome** 90+ (recommended)
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+
- **Mobile browsers** (iOS Safari, Chrome Mobile)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Run code quality checks (`npm run format && npm run lint && npm run check`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass
- Test on multiple browsers

## 🔮 Future Enhancements

- **Advanced Filters**: Blur, sharpen, noise reduction
- **Batch Editing**: Process multiple images at once
- **Custom Presets**: Save and load editing presets
- **Export Options**: Multiple format and quality options
- **Keyboard Shortcuts**: Power user productivity features

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with cutting-edge web technologies
- Inspired by professional photo editing software
- Thanks to the open-source community for amazing tools and libraries
- Canvas API documentation and community examples

---

**Made with ❤️ for simple photo editing needs**

_Quick and easy photo editing, right in your browser._
