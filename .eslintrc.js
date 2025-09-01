/**
 * ESLint Configuration
 * 
 * ESLint statically analyzes JavaScript/TypeScript code to find and fix problems.
 * This configuration enforces code quality, security, and consistency standards.
 * 
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  /**
   * Extend from base configurations to inherit common rules
   * - next/core-web-vitals: Next.js specific rules for performance and best practices
   * - plugin:prettier/recommended: Integrates Prettier formatting as ESLint rules
   */
  extends: [
    'next/core-web-vitals',
    'plugin:prettier/recommended'
  ],

  /**
   * ESLint plugins provide additional rules and functionality
   * - prettier: Runs Prettier as an ESLint rule and reports differences as ESLint issues
   */
  plugins: ['prettier'],

  /**
   * Custom rules configuration
   * Rules are categorized by type and severity level:
   * - "error": Will cause ESLint to exit with error code (breaks build)
   * - "warn": Will show warning but not break build
   * - "off": Disables the rule
   */
  rules: {
    // ==================== REACT HOOKS RULES ====================
    /**
     * Warn when missing dependencies in useEffect, useCallback, etc.
     * This helps prevent stale closures and unnecessary re-renders
     */
    'react-hooks/exhaustive-deps': 'warn',

    // ==================== VARIABLE DECLARATION RULES ====================
    /**
     * Error on unused variables, but ignore parameters starting with _
     * This helps keep code clean and prevents dead code accumulation
     */
    'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],

    /**
     * Warn on console statements to encourage proper logging practices
     * In production, console statements should be removed or replaced with proper logging
     */
    'no-console': 'warn',

    /**
     * Error on debugger statements to prevent accidental debug code in production
     */
    'no-debugger': 'error',

    // ==================== BEST PRACTICES RULES ====================
    /**
     * Error when curly braces are omitted for multi-line statements
     * Prevents bugs from misleading indentation
     */
    'curly': 'error',

    /**
     * Require strict equality (=== and !==) instead of loose equality (== and !=)
     * Prevents type coercion bugs
     */
    'eqeqeq': ['error', 'always'],

    /**
     * Disallow use of eval() due to security and performance concerns
     */
    'no-eval': 'error',

    /**
     * Disallow implied eval() through setTimeout, setInterval, etc.
     */
    'no-implied-eval': 'error',

    /**
     * Disallow Function constructor due to security concerns
     */
    'no-new-func': 'error',

    /**
     * Disallow assignment in return statements to prevent confusion
     */
    'no-return-assign': 'error',

    /**
     * Disallow javascript: URLs to prevent security vulnerabilities
     */
    'no-script-url': 'error',

    /**
     * Disallow comparisons where both sides are exactly the same
     */
    'no-self-compare': 'error',

    /**
     * Disallow use of the comma operator to prevent confusing code
     */
    'no-sequences': 'error',

    /**
     * Disallow throwing literals as exceptions (must throw Error objects)
     */
    'no-throw-literal': 'error',

    /**
     * Disallow unused expressions to prevent dead code
     */
    'no-unused-expressions': 'error',

    /**
     * Disallow unnecessary .call() and .apply() when normal function calls work
     */
    'no-useless-call': 'error',

    /**
     * Disallow unnecessary string concatenation with template literals available
     */
    'no-useless-concat': 'error',

    /**
     * Disallow unnecessary escape characters in strings and regex
     */
    'no-useless-escape': 'error',

    /**
     * Disallow void operator to prevent confusing code
     */
    'no-void': 'error',

    /**
     * Disallow with statement due to performance and clarity issues
     */
    'no-with': 'error',

    /**
     * Require radix parameter when using parseInt() to prevent octal interpretation
     */
    'radix': 'error',

    /**
     * Require var declarations at the top of their scope (function or global)
     */
    'vars-on-top': 'error',

    /**
     * Require immediate function invocations to be wrapped in parentheses
     */
    'wrap-iife': ['error', 'any'],

    /**
     * Disallow Yoda conditions (literal before variable) for better readability
     */
    'yoda': 'error',

    /**
     * Require strict mode for better error handling and ES6 features
     */
    'strict': ['error', 'global'],

    // ==================== VARIABLE SCOPE RULES ====================
    /**
     * Disallow variable declarations from shadowing variables in the outer scope
     */
    'no-catch-shadow': 'error',

    /**
     * Disallow labels that share a name with a variable
     */
    'no-label-var': 'error',

    /**
     * Disallow variable declarations from shadowing variables declared in the outer scope
     */
    'no-shadow': 'error',

    /**
     * Disallow initializing variables to undefined
     */
    'no-undef-init': 'error',

    /**
     * Disallow use of undefined variable (use null instead)
     */
    'no-undefined': 'error',

    /**
     * Disallow use of variables before they are defined
     */
    'no-use-before-define': 'error',

    // ==================== STYLISTIC RULES ====================
    /**
     * Require camelCase naming convention for consistency
     */
    'camelcase': 'error',

    /**
     * Require constructor names to begin with a capital letter
     */
    'new-cap': 'error',

    /**
     * Disallow Array constructors in favor of array literals []
     */
    'no-array-constructor': 'error',

    /**
     * Disallow Object constructors in favor of object literals {}
     */
    'no-new-object': 'error',

    /**
     * Disallow nested ternary expressions for better readability
     */
    'no-nested-ternary': 'error',

    /**
     * Disallow unnecessary ternary expressions
     */
    'no-unneeded-ternary': 'error',

    /**
     * Require each variable declaration to be on its own statement
     */
    'one-var': ['error', 'never'],

    /**
     * Require assignment operator shorthand where possible
     */
    'operator-assignment': ['error', 'always'],

    /**
     * Disallow padding within blocks for cleaner code
     */
    'padded-blocks': ['error', 'never'],

    // ==================== ES6/IMPORT RULES ====================
    /**
     * Disallow duplicate imports from the same module
     */
    'no-duplicate-imports': 'error',

    /**
     * Disallow unnecessary computed property keys in objects and classes
     */
    'no-useless-computed-key': 'error',

    /**
     * Disallow unnecessary constructors in classes
     */
    'no-useless-constructor': 'error',

    /**
     * Disallow renaming import, export, and destructured assignments to the same name
     */
    'no-useless-rename': 'error',

    /**
     * Require using arrow functions as callbacks for lexical this binding
     */
    'prefer-arrow-callback': 'error',

    /**
     * Require destructuring from arrays and objects when possible
     */
    'prefer-destructuring': 'error',

    /**
     * Disallow parseInt() and Number.parseInt() in favor of binary, octal, and hex literals
     */
    'prefer-numeric-literals': 'error',

    /**
     * Require rest parameters instead of arguments for variable function arguments
     */
    'prefer-rest-params': 'error',

    /**
     * Require spread syntax instead of .apply() for function calls
     */
    'prefer-spread': 'error',

    /**
     * Require template literals instead of string concatenation
     */
    'prefer-template': 'error',

    /**
     * Integrate Prettier formatting rules - reports Prettier issues as ESLint errors
     */
    'prettier/prettier': 'error'
  }
};