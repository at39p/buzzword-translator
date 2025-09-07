# AGENTS.md - Corporate Buzzword Translator

## Build & Test Commands
This is a static web application with no build system. Open `index.html` in a browser to run.
- **Test**: No automated tests - manual testing via browser
- **Lint**: No linter configured - validate HTML/CSS/JS manually or use browser dev tools
- **Deploy**: Static files - can be served directly via any web server

## Code Style & Architecture

### JavaScript (Vanilla ES6+)
- Use ES6+ features (classes, arrow functions, const/let, template literals)
- Error handling with try-catch blocks and comprehensive logging
- Extensive input validation and sanitization
- Class-based architecture with BuzzwordSearchEngine as main controller
- Event-driven programming with DOM event listeners
- Performance-focused with debouncing, caching, and sub-100ms search targets

### HTML Structure
- Semantic HTML5 with proper ARIA attributes for accessibility
- Use role attributes and aria-labels throughout
- Include skip links and screen reader support

### CSS Styling
- Modern CSS custom properties (CSS variables) defined in :root
- Glass morphism design with backdrop-blur effects
- Responsive design with fluid spacing system
- Dark theme with accent colors: #00d4ff (primary), #7c3aed (secondary)
- Use BEM-like naming conventions for classes