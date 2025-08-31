# 📸 PhotoLab - Professional Photo Editor

A simple, free, and secure browser-based photo editor with essential editing tools, filters, and drawing capabilities.

**🌐 Live Demo: https://image-editor.online/**

## ✨ Features

- **Professional Adjustment Tools**: Exposure, brightness, contrast, highlights, shadows, whites, blacks, saturation, vibrance, clarity, dehaze, and rotation with real-time preview
- **Creative Filters**: Complete collection including grayscale, sepia, invert, vintage, cool, warm, dramatic, soft, vivid, noir, sunset, arctic, emerald, rose, and cyberpunk effects
- **Tabbed Interface**: Professional photo editor workflow with organized Adjust, Filters, and Draw tabs
- **Enhanced Drawing System**: Professional-quality smooth drawing with undo functionality, customizable brush sizes and colors
- **Auto-Mode Switching**: Draw mode automatically activates when Draw tab is selected for seamless workflow
- **Multiple Format Support**: Edit JPG, PNG, WebP, and GIF images
- **Client-Side Processing**: All editing happens in your browser - your photos never leave your device
- **Instant Preview**: See edits in real-time as you work with debounced updates for smooth performance
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

- **[SvelteKit](https://kit.svelte.dev/)** - Full-stack framework for modern web applications
- **[Svelte 5](https://svelte.dev/)** - Reactive UI framework using cutting-edge runes API ($state, $bindable, $derived)
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development with strict typing
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling for responsive design
- **[Vite](https://vitejs.dev/)** - Lightning-fast build tool and development server

### Image Processing

- **HTML5 Canvas API** - High-performance pixel-level image manipulation
- **File API** - Secure client-side file handling with drag & drop support
- **Advanced Algorithms** - Professional-grade exposure, highlight/shadow, and color grading processing
- **Smooth Drawing Engine** - Quadratic curve rendering with jitter reduction and proper line caps/joins
- **Real-time Processing** - Optimized canvas operations with debounced updates for smooth performance

### Testing

- **[Vitest](https://vitest.dev/)** - Unit testing framework
- **[Playwright](https://playwright.dev/)** - End-to-end testing
- **Cross-Browser Testing** - Chrome and Firefox automated testing in CI

### Analytics

- **[Firebase Analytics](https://firebase.google.com/docs/analytics)** - User behavior tracking and performance insights

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

**Comprehensive Unit Tests** covering:

- **Image Processing**: All filters with pixel-level validation and image loading functionality
- **Canvas Operations**: Canvas setup, image drawing, rotation handling, coordinate calculations, and download functionality
- **Drawing System**: Complete drawing lifecycle, smooth line rendering, undo state management, and jitter reduction
- **Photo Editor Store**: State initialization, all adjustment properties, reactive updates, debounced operations, and history management

**End-to-End Tests** covering:

- **Complete Workflows**: Full photo editing sessions from upload to download
- **Filter Gallery**: Testing all filters with visual validation
- **Drawing Tools**: Brush sizes, colors, undo functionality across user interactions
- **UI Behavior**: Tab switching, drawing mode activation, reset functionality
- **Responsive Design**: Mobile and tablet interaction patterns
- **Cross-Browser**: Automated testing on Chrome and Firefox

**Automated CI/CD**: All tests run on GitHub Actions for every commit, ensuring code quality and functionality

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
│   │   ├── FileUpload.svelte       # Drag & drop file upload
│   │   ├── PhotoCanvas.svelte      # Main canvas for image display
│   │   ├── ToolsPanel.svelte       # Main tabbed container
│   │   ├── AdjustTab.svelte        # 12 professional adjustment tools
│   │   ├── FiltersTab.svelte       # 16 creative filters
│   │   ├── DrawTab.svelte          # Drawing tools with undo
│   │   ├── TabPanel.svelte         # Generic tabbed interface
│   │   ├── Button.svelte           # Reusable button component
│   │   ├── Header.svelte           # Site header
│   │   └── Footer.svelte           # Site footer
│   ├── sections/           # Landing page sections
│   │   ├── FeaturesSection.svelte
│   │   ├── HowItWorksSection.svelte
│   │   ├── PhotoEditingUseCasesSection.svelte
│   │   ├── SupportedFormatsSection.svelte
│   │   ├── PhotoEditingTipsSection.svelte
│   │   └── FAQSection.svelte
│   ├── stores/            # Svelte 5 stores with runes
│   │   └── photoEditor.svelte.ts   # Main editor state management
│   └── utils/            # Utility functions
│       ├── canvasUtils.ts          # Canvas operations and setup
│       ├── imageProcessing.ts      # Advanced filter algorithms
│       └── drawingUtils.ts         # Smooth drawing implementation
├── routes/               # SvelteKit routes
│   └── +page.svelte     # Main application page
tests/
├── unit/               # Unit tests
├── e2e/               # End-to-end tests
└── fixtures/          # Test assets
```

### Key Components

- **ToolsPanel**: Main tabbed container organizing all editing tools
- **AdjustTab**: Professional adjustment sliders (exposure, highlights, shadows, etc.)
- **FiltersTab**: Creative filters with visual previews and descriptions
- **DrawTab**: Professional drawing tools with undo functionality and auto-activation
- **PhotoCanvas**: High-performance canvas component for image display and drawing
- **FileUpload**: Drag & drop file upload interface with format validation
- **Photo Editor Store**: Svelte 5 runes-based state management with reactive updates

## 🎨 Photo Editing Features

### Professional Adjustment Tools

- **Exposure**: Professional exposure compensation (-100 to +100)
- **Brightness**: Fine-tune overall image lighting (-100 to +100)
- **Contrast**: Enhance or reduce image contrast (-100 to +100)
- **Highlights**: Recover or enhance bright areas (-100 to +100)
- **Shadows**: Lift or deepen shadow details (-100 to +100)
- **Whites**: Control pure white levels (-100 to +100)
- **Blacks**: Adjust black point and dark tones (-100 to +100)
- **Saturation**: Global color intensity adjustment (-100 to +100)
- **Vibrance**: Intelligent saturation for skin tones (-100 to +100)
- **Clarity**: Mid-tone contrast for image definition (-100 to +100)
- **Dehaze**: Remove atmospheric haze and enhance clarity (-100 to +100)
- **Rotation**: Rotate images in 90-degree increments

### Creative Filters

**Basic Filters:**

- **None**: Original image without any filter applied
- **Grayscale**: Professional black and white conversion
- **Sepia**: Classic vintage warm brown tone effect
- **Invert**: High-quality negative/inverted color effect

**Artistic Filters:**

- **Vintage**: Retro film look with reduced contrast and warm sepia tones
- **Cool**: Blue-tinted effect for calm, serene moods
- **Warm**: Orange-tinted effect for cozy, inviting atmosphere
- **Dramatic**: High contrast with selective desaturation for mood
- **Soft**: Gentle pastel effect with brightness boost
- **Vivid**: Enhanced saturation for vibrant, eye-catching results
- **Noir**: High-contrast black and white for film noir aesthetics

**Color-Themed Filters:**

- **Sunset**: Golden hour warmth with enhanced reds and yellows
- **Arctic**: Cool winter tones with blue-white enhancement
- **Emerald**: Rich green tint for nature photography
- **Rose**: Romantic pink tone for portraits and soft imagery
- **Cyberpunk**: Futuristic purple/cyan tint with high contrast

### Enhanced Drawing System

- **Professional Quality**: Smooth quadratic curve rendering eliminates jagged lines
- **Smart Line Rendering**: Proper line caps and joins prevent pointy/clipped edges
- **Jitter Reduction**: Advanced algorithms filter out micro-movements for clean strokes
- **Undo Functionality**: Drawing-specific undo system (up to 20 operations)
- **Auto-Activation**: Drawing mode automatically enables when Draw tab is selected
- **Customizable Brushes**: Adjustable size (1-50px) and full color picker
- **Preset Colors**: Quick access to commonly used drawing colors

## 🎛️ Professional UI/UX Design

### Tabbed Interface Architecture

PhotoLab features a professional photo editor workflow with an intuitive tabbed interface:

- **Adjust Tab**: All professional adjustment tools organized in a clean, accessible layout
- **Filters Tab**: Visual filter gallery with preview thumbnails and descriptions
- **Draw Tab**: Complete drawing toolkit with automatic mode switching

### Smart Workflow Features

- **Auto-Mode Switching**: Drawing mode automatically activates when Draw tab is selected
- **Context-Aware Interface**: Each tab shows relevant tools and controls
- **Bottom Panel Design**: Professional layout with tools below the image for optimal workflow
- **Responsive Design**: Tabs reorganize on mobile devices for touch-friendly editing
- **Real-Time Preview**: All adjustments update instantly with smooth, debounced rendering
- **Memory Efficient**: Optimized canvas operations prevent memory leaks during extended editing

### User Experience Enhancements

- **Visual Feedback**: Clear active/inactive states for all controls
- **Keyboard Friendly**: Accessible design with proper focus management
- **Touch Optimized**: Responsive controls that work perfectly on tablets and phones
- **Professional Standards**: Interface follows modern photo editing application conventions

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

- **Chrome** 90+ (recommended, fully tested in CI)
- **Firefox** 88+ (fully tested in CI)
- **Safari** 14+ (compatible, manual testing recommended)
- **Edge** 90+ (Chromium-based, should work like Chrome)
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

- **Additional Filters**: Blur, sharpen, noise reduction, and lens correction
- **Batch Editing**: Process multiple images at once with consistent settings
- **Custom Presets**: Save and load editing presets for common workflows
- **Export Options**: Multiple format and quality options (WEBP, different JPEG qualities)
- **Keyboard Shortcuts**: Power user productivity features (Ctrl+Z undo, etc.)
- **Layer System**: Multiple editing layers for advanced compositions
- **History Panel**: Visual history of all editing operations (beyond just drawing undo)
- **RAW Support**: Basic RAW image processing capabilities

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
