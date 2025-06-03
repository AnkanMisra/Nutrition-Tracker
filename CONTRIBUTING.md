# 🤝 Contributing to Nutrition Tracker

We're thrilled that you're interested in contributing to Nutrition Tracker! This document provides guidelines and instructions for contributing to our project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)

## 🤝 Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before contributing.

## 🚀 Getting Started

### Prerequisites

- Node.js (≥18.0.0)
- npm or yarn
- Git
- Expo CLI
- Android Studio/Xcode (for native development)

### Setting Up Your Development Environment

1. **Fork the repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/your-username/nutrition-tracker.git
   cd nutrition-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

4. **Start development server**
   ```bash
   npm start
   ```

## 🔄 Development Workflow

### Branch Naming Convention

- `feature/description` - New features
- `bugfix/description` - Bug fixes
- `hotfix/description` - Critical fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

### Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(nutrition): add barcode scanning functionality
fix(auth): resolve login validation issue
docs(readme): update installation instructions
```

## 💻 Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper interfaces and types
- Avoid `any` type unless absolutely necessary

```typescript
// ✅ Good
interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

// ❌ Bad
const nutritionData: any = { /* ... */ };
```

### React Native/Expo

- Use functional components with hooks
- Follow React Native best practices
- Use proper component naming (PascalCase)

```typescript
// ✅ Good
const NutritionCard: React.FC<NutritionCardProps> = ({ data }) => {
  const [isLoading, setIsLoading] = useState(false);
  // ...
};

// ❌ Bad
const nutritionCard = (props) => {
  // ...
};
```

### Styling

- Use React Native Paper theming system
- Follow consistent spacing (8px grid system)
- Use semantic color names

```typescript
const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.medium, // 16px
    backgroundColor: theme.colors.surface,
  },
});
```

### File Organization

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Generic components
│   └── nutrition/      # Domain-specific components
├── screens/            # Screen components
├── services/           # API and external services
├── utils/              # Utility functions
├── hooks/              # Custom React hooks
├── context/            # React Context providers
├── types/              # TypeScript type definitions
└── constants/          # App constants
```

## 🔍 Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/awesome-new-feature
   ```

2. **Make your changes**
   - Write clean, well-documented code
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes**
   ```bash
   npm run test
   npm run lint
   npm run type-check
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat(nutrition): add awesome new feature"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/awesome-new-feature
   ```

6. **Create a Pull Request**
   - Use the PR template
   - Provide clear description of changes
   - Link related issues
   - Add screenshots for UI changes

### PR Template

```markdown
## 📝 Description
Brief description of changes made.

## 🔗 Related Issues
Fixes #123

## 🧪 Testing
- [ ] Manual testing completed
- [ ] Unit tests added/updated
- [ ] Integration tests pass

## 📸 Screenshots (if applicable)
Before/after screenshots for UI changes.

## ✅ Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Tests added for new functionality
- [ ] Documentation updated
```

## 🐛 Issue Guidelines

### Bug Reports

Use the bug report template and include:
- Device/platform information
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/videos if applicable
- Error logs/stack traces

### Feature Requests

Use the feature request template and include:
- Clear problem statement
- Proposed solution
- Alternative solutions considered
- Additional context

## 🧪 Testing Guidelines

### Unit Tests

```typescript
// Example test structure
describe('NutritionCalculator', () => {
  describe('calculateDailyGoals', () => {
    it('should calculate correct macronutrient goals', () => {
      const userProfile = createMockUserProfile();
      const goals = calculateDailyGoals(userProfile);
      
      expect(goals.calories).toBe(2000);
      expect(goals.protein).toBe(150);
    });
  });
});
```

### Integration Tests

- Test API integrations
- Test navigation flows
- Test data persistence

### Manual Testing Checklist

- [ ] App starts without crashes
- [ ] Navigation works correctly
- [ ] Food search returns results
- [ ] Nutrition tracking saves data
- [ ] Dark/light theme switching works
- [ ] Offline functionality works

## 📚 Documentation

### Code Documentation

- Use JSDoc for function documentation
- Add inline comments for complex logic
- Update README for new features

```typescript
/**
 * Calculates daily nutrition goals based on user profile
 * @param profile - User profile containing age, weight, height, activity level
 * @returns Calculated daily nutrition goals
 */
export const calculateDailyGoals = (profile: UserProfile): NutritionGoals => {
  // Implementation...
};
```

### API Documentation

- Document all API endpoints
- Include request/response examples
- Update OpenAPI/Swagger specs

## 🏆 Recognition

Contributors will be recognized in:
- README contributors section
- Release notes
- Annual contributor spotlight

## 📞 Getting Help

- Join our [Discord community](https://discord.gg/nutrition-tracker)
- Start a [GitHub Discussion](https://github.com/nutrition-tracker/discussions)
- Email us at contributors@nutritiontracker.dev

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Nutrition Tracker! 🎉 