module.exports = {
  // Line width
  printWidth: 80,
  
  // Tab settings
  tabWidth: 2,
  useTabs: false,
  
  // Semicolons
  semi: true,
  
  // Quotes
  singleQuote: true,
  quoteProps: 'as-needed',
  jsxSingleQuote: false,
  
  // Trailing commas
  trailingComma: 'es5',
  
  // Bracket spacing
  bracketSpacing: true,
  bracketSameLine: false,
  
  // Arrow function parentheses
  arrowParens: 'avoid',
  
  // Range formatting
  rangeStart: 0,
  rangeEnd: Infinity,
  
  // Parser
  requirePragma: false,
  insertPragma: false,
  
  // Prose wrapping
  proseWrap: 'preserve',
  
  // HTML whitespace sensitivity
  htmlWhitespaceSensitivity: 'css',
  
  // Vue files script and style tags indentation
  vueIndentScriptAndStyle: false,
  
  // End of line
  endOfLine: 'lf',
  
  // Embedded language formatting
  embeddedLanguageFormatting: 'auto',
  
  // Single attribute per line in HTML, Vue and JSX
  singleAttributePerLine: false,
  
  // Override settings for specific file types
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 200,
        trailingComma: 'none'
      }
    },
    {
      files: '*.md',
      options: {
        proseWrap: 'always',
        printWidth: 100
      }
    },
    {
      files: '*.yaml',
      options: {
        tabWidth: 2
      }
    },
    {
      files: '*.yml',
      options: {
        tabWidth: 2
      }
    }
  ]
}; 