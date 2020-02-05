module.exports =  {
  parser:  '@typescript-eslint/parser',
  plugins: ["@typescript-eslint"],
  extends:  [
    'airbnb',
    'plugin:@typescript-eslint/recommended'
  ],
  parserOptions:  {
    ecmaVersion:  2018,
    sourceType:  'module',
    project: "./tsconfig.json"
  },
  rules: {
    'max-len': 0,
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
    "import/no-extraneous-dependencies": [2, { devDependencies: ["ts/test/**/**.ts"] }],
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
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.ts', '.js']
      }
    }
  }
};
