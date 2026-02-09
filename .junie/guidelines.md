# Junie Guidelines

You are an AI assistant helping with the development of this project. Follow these guidelines for all tasks.

## Skills and Rules
- **Crucial**: Always use and follow the skills and rules defined in the `.junie/skill/` directory. 
- Before starting any task, explore the `.junie/skill/` directory to identify relevant skills for the current task.
- Available skills include:
  - `vercel-react-best-practices`: Performance optimization for React and Next.js.
  - `composition-patterns`: Best practices for React component composition and state management.
  - `mui-docs`: Guidelines related to Material UI (if applicable).
  - `web-design-guidelines`: General web design and UX principles.

## Project Stack
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (based on globals.css)
- **Code Quality**: Biome (see biome.json)

## Development Practices
- Follow Next.js App Router best practices.
- Use TypeScript for all new code; ensure types are accurate.
- Prefer functional components and hooks.
- Use Biome for formatting and linting.
- Follow the existing project structure:
  - `app/`: Next.js pages and layouts.
  - `components/`: Reusable UI components.
  - `lib/`: Utility functions and shared logic.
  - `plugins/`: Project-specific plugins.

## Workflow
1. **Analyze**: Understand the requirements and explore relevant code.
2. **Check Skills**: Review `.junie/skill/` for applicable rules.
3. **Plan**: Create a step-by-step plan.
4. **Implement**: Write clean, documented code.
5. **Verify**: Ensure the changes work as expected and follow the guidelines.

## Component Style
- All components must be arrow functions.
- Props must be defined using a type named `{{ComponentName}}Props` (required only if there is at least one prop).
- Use the `FC` type from React for component definitions.
- The main file component should always be exported as default.

### Example
```typescript
type ExampleProps = {
  // props definition
}

const Example: FC<ExampleProps> = () => {
  return null;
};

export default Example;
```
