module.exports =  {
  parser:  '@typescript-eslint/parser',  // Specifies the ESLint parser
  plugins: ["@typescript-eslint"],
  extends:  [
    'airbnb',
    'plugin:@typescript-eslint/recommended',  // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    // 'prettier',
    // 'plugin:prettier/recommended',  // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  parserOptions:  {
    ecmaVersion:  2018,  // Allows for the parsing of modern ECMAScript features
    sourceType:  'module',  // Allows for the use of imports
    project: "./tsconfig.json"
  },
  rules: {
    'no-underscore-dangle': 0,
    "no-useless-constructor": 0,
    "no-case-declarations": 0,
    "semi": [2, "never"],
    "arrow-body-style": [2, "always"],
    "no-await-in-loop": 0,
    "no-plusplus": [2, { allowForLoopAfterthoughts: true }],
    "lines-between-class-members": 0,
    "padded-blocks": [2, { "blocks": "never", "switches": "never", "classes": "always" }],
    "object-curly-spacing": [2, "always"],
    "import/no-extraneous-dependencies": [2, { devDependencies: ["**/*.test.ts"] }],
    "import/prefer-default-export": 0,
    "@typescript-eslint/no-inferrable-types": [2, { ignoreParameters: true, ignoreProperties: true }],
    "@typescript-eslint/no-unused-vars": 2,
    "@typescript-eslint/no-empty-interface": 0,
    "@typescript-eslint/no-useless-constructors": 0,
    "@typescript-eslint/explicit-function-return-type": 2,
    "@typescript-eslint/member-delimiter-style": [
      2,
      {
        multiline: { delimiter: "semi", requireLast: true },
        singleline: { delimiter: "semi", requireLast: true },
      }
    ]
  },
  // "env": {
  //   "browser": true,
  // },
  // "globals": {
  //
  // }
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.ts', '.js']
      }
    }
  }
};
