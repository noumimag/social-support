# Social Support Application

A modern, multilingual React application for social support applications with AI-powered writing assistance. Built with React, Redux, and Tailwind CSS, featuring comprehensive form validation, RTL support, and OpenAI integration.

## Features

- **Multilingual Support**: English and Arabic with RTL layout support
- **Multi-step Form**: 3-step wizard with validation and auto-save
- **AI Writing Assistant**: OpenAI-powered suggestions for form fields
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Dark/Light Theme**: Automatic theme switching
- **Form Persistence**: Auto-save and resume functionality
- **Accessibility**: WCAG compliant with screen reader support
- **Mock API**: Built-in testing with simulated form submission

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- OpenAI API key (for AI features)

## Installation

### 1. Clone Project

```bash
git clone git@github.com:noumimag/social-support.git
cd social-support
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Configuration

Create a `.env` file in the root directory and update your API key:

```env
# OpenAI Configuration
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_OPENAI_API_URL=https://api.openai.com/v1/chat/completions
VITE_OPENAI_MODEL=gpt-3.5-turbo
```

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

### 5. Run Tests (Optional)

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:ci
```

### Testing and Debug

The application includes built-in error handling and will show appropriate messages if:

- API key is missing or invalid
- Rate limits are exceeded
- Network issues occur
- API quota is exceeded

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm test             # Run tests in watch mode
npm run test:ci      # Run tests once (for CI/CD)
```

## Project Architecture

```
src/
├── components/       # Reusable UI components
├── pages/            # Application steps + success page
├── store/            # Redux state management
├── services/         # APIs + AI helpers
├── validation/       # Yup schemas per step
├── i18n/             # Language files (en + ar)
├── hooks/            # Custom React hooks
├── context/          # React context providers
├── constants/        # Application constants
├── selectors/        # Redux selectors
├── utils/            # Helpers and ErrorBoundary
├── __tests__/        # Test files (Jest + RTL)
└── setupTests.js     # Test configuration
```

### Key Technologies

- **React 19**: Latest React with modern features
- **Redux Toolkit**: State management with RTK Query
- **React Hook Form**: Form handling with validation
- **Yup**: Schema validation
- **React Router**: Client-side routing
- **i18next**: Internationalization
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **Vite**: Build tool and dev server
- **Jest**: Testing framework
- **React Testing Library**: Component testing utilities

### State Management

The application uses Redux Toolkit for state management with the following structure:

```javascript
{
  form: {
    step1: { /* Personal information */ },
    step2: { /* Family & financial info */ },
    step3: { /* Situation descriptions */ },
    currentStep: 1,
    isComplete: false,
    isFormSubmitted: false
  }
}
```

### Form Validation

Each step has its own validation schema using Yup:

### AI Integration

The OpenAI service includes:

- **Rate Limiting**: Prevents excessive API calls
- **Error Handling**: Comprehensive error management
- **Retry Logic**: Automatic retry
- **Timeout Handling**: Request timeout protection
- **Token Limits**: Safety limits

## Internationalization

The application supports English and Arabic with:

- **RTL Layout**: Proper right-to-left text direction
- **Dynamic Language Switching**: Real-time language changes
- **Localized Validation**: Error messages in both languages

## Styling & Theming

- **Tailwind CSS**: Utility-first CSS framework
- **Dark/Light Mode**: Automatic theme switching
- **Responsive Design**: Mobile-first approach
- **Custom Components**: Reusable styled components
- **Accessibility**: WCAG 2.1 AA compliant

## Security Considerations

- **Environment Variables**: Sensitive data in `.env` files
- **Input Validation**: Client and server-side validation
- **XSS Protection**: Sanitized user inputs
- **Rate Limiting**: API call throttling
- **Error Boundaries**: Graceful error handling

## Deployment

### Build for Production

```bash
npm run build
```

### Environment Variables for Production

Ensure all environment variables are set in your production environment:

```env
VITE_OPENAI_API_KEY=your_production_api_key
VITE_OPENAI_API_URL=https://api.openai.com/v1/chat/completions
VITE_OPENAI_MODEL=gpt-3.5-turbo
```

### Deployment Platforms

The application can be deployed to:

- **Vercel**: Zero-config deployment
- **Netlify**: Static site hosting
- **AWS S3 + CloudFront**: Scalable hosting
- **GitHub Pages**: Free static hosting

## Testing

### Automated Testing

The application includes comprehensive testing setup with Jest and React Testing Library:

```bash
# Run tests in watch mode (development)
npm test

# Run tests once (CI/CD)
npm run test:ci

# Run tests with coverage
npm test -- --coverage
```

**Test Coverage:**

- Component rendering tests
- Form validation testing
- Accessibility testing
- User interaction testing
- Error handling tests

**Test Files:**

- `src/__tests__/Header.test.jsx` - Header component tests
- `src/__tests__/Step1Personal.test.jsx` - Form component tests
- `src/setupTests.js` - Test configuration and mocks

**Testing Configuration:**

- `jest.config.js` - Jest configuration with ES modules support
- ESLint configured for Jest globals in test files
- Mock implementations for React Router, Redux, and i18n
- TextEncoder/TextDecoder polyfills for Node.js compatibility

### Manual Testing

1. **Form Validation**: Test all validation rules
2. **Language Switching**: Verify RTL layout
3. **AI Features**: Test OpenAI integration
4. **Responsive Design**: Test on different screen sizes
5. **Accessibility**: Test with screen readers

### Mock API Testing

The application includes a mock API for testing form submission:

- 100% success rate in development
- Configurable success/failure rates
- Console logging for debugging

## Performance Optimizations

- **Code Splitting**: Lazy loading of components
- **Memoization**: React.memo for expensive components
- **Bundle Optimization**: Vite's built-in optimizations
- **Caching**: Local storage for form data

## Future Improvements

- **Secure Token Handling**: Move sensitive logic to a backend service and add encryption + decryption to improve API token security
- **E2E Testing**: Playwright or Cypress for end-to-end testing
- **PWA Features**: Offline support and caching. Installable app behavior for mobile users.
- **Advanced AI**: Add smarter AI suggestions, tone control, and contextual understanding.
- **Analytics**: User behavior tracking to understand and improve UX.
- **A/B Testing**: Experiment with UI variations to improve user success rate and form completion.
- **Performance Monitoring**: Add performance metrics and monitoring
- **Additional Test Coverage**: Expand test coverage for all components and hooks

---

**Built with ❤️ for social support and community assistance**
