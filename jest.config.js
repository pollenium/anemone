module.exports = {
  "roots": [
    "<rootDir>/ts"
  ],
  testMatch: [
    "**/?(*.)+(spec|test).+(ts|tsx|js)"
  ],
  "transform": {
    "^.+\\.(ts|tsx)?$": "ts-jest"
  },
  "timers": "real",
  "verbose": true,
  "maxWorkers": "100%",
  "logHeapUsage": true,
  "testTimeout": 10000,
  "maxConcurrency": 1,
  "bail": true
}
