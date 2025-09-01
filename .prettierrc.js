/**
 * Prettier Configuration
 * 
 * Prettier is an opinionated code formatter that ensures consistent code style across the project.
 * This configuration enforces a strict coding standard with specific rules for formatting.
 * 
 * @type {import('prettier').Config}
 */
module.exports = {
  /**
   * Always add semicolons at the end of statements
   * This prevents ASI (Automatic Semicolon Insertion) issues
   */
  semi: true,

  /**
   * Use ES5-compatible trailing commas in objects and arrays
   * This makes git diffs cleaner and allows easier adding of new items
   */
  trailingComma: 'es5',

  /**
   * Use single quotes instead of double quotes for strings
   * This is consistent with modern JavaScript conventions
   */
  singleQuote: true,

  /**
   * Maximum line length before Prettier will wrap code
   * 80 characters is a common standard for readability
   */
  printWidth: 80,

  /**
   * Number of spaces per indentation level
   * 2 spaces is standard for JavaScript and TypeScript
   */
  tabWidth: 2,

  /**
   * Use spaces instead of tabs for indentation
   * This ensures consistent rendering across different editors
   */
  useTabs: false,

  /**
   * Only add quotes around object properties when necessary
   * This minimizes unnecessary quoting in object literals
   */
  quoteProps: 'as-needed',

  /**
   * Print spaces between brackets in object literals
   * Example: { foo: bar } instead of {foo:bar}
   */
  bracketSpacing: true,

  /**
   * Always include parentheses around arrow function parameters
   * This improves clarity and avoids ambiguity
   */
  arrowParens: 'always',

  /**
   * Use LF (Line Feed) for line endings
   * This ensures consistency across different operating systems
   */
  endOfLine: 'lf'
};