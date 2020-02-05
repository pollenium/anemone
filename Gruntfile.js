const chromeLauncher = require('chrome-launcher')
const delay = require('delay')
const prompt = require('prompt-promise')
const httpServerLib = require('http-server')

let signalingServers

module.exports = (grunt) => {

  require('load-grunt-tasks')(grunt)

  grunt.initConfig({
    eslint: {
      target: ['ts/**/*.ts'],
      options: {
        fix: true,
        configFile: '.eslintrc.js'
      }
    },
    watch: {
      files: [
        'Gruntfile.js',
        'package.json',
        'tsconfig.json',
        '.eslintrc.js',
        '.prettierrc.js',
        'ts/**/*.ts',
      ],
      tasks: ['build', 'test'],
      options: {
        spawn: true,
        interrupt: true
      }
    },
    clean: ['node', 'browser'],
    mkdir: {
      node: {
        options: {
          create: ['node']
        },
      },
      browser: {
        options: {
          create: ['browser']
        },
      },
    },
    ts: {
      default : {
        tsconfig: './tsconfig.json',
        options: {
          fast: 'never'
        }
      }
    },
    run: {
      'mocha': {
        cmd: 'npm',
        args: ['run', 'mocha', './ts/test/index.ts']
      },
      browserify: {
        cmd: 'npm',
        args: ['run', 'browserify']
      },
      'browserify-hashcash-worker': {
        cmd: 'npm',
        args: ['run', 'browserify-hashcash-worker']
      },
      'browserify-test': {
        cmd: 'npm',
        args: ['run', 'browserify-test']
      },
    }
  })

  grunt.loadNpmTasks(
    'grunt-contrib-watch',
    'grunt-contrib-clean',
    'grunt-mkdir',
    'grunt-ts',
    'grunt-run',
    'grunt-force-task'
  )

  grunt.registerTask('default', ['watch'])

  grunt.registerTask('build', [
    'clean',
    'mkdir',
    'ts',
    'eslint',
    'run:browserify',
    'run:browserify-hashcash-worker',
    'run:browserify-test',
  ])

  grunt.registerTask('test', [
    'servers',
    'run:mocha',
    'test-browser',
  ])

  grunt.registerTask('test-browser', 'open browser test in chrome', async function() {
    const done = this.async()

    const port = 5555
    const httpServer = httpServerLib.createServer()

    httpServer.listen(port)

    const chrome = await chromeLauncher.launch({
      startingUrl: `http://localhost:${port}/test-browser.html`,
      chromeFlags: ['--args', '--incognito']
    })

    const response = await prompt('browser test succeeded? (y/n): ')
    httpServer.close()
    await chrome.kill()

    if (response == 'y') {
      done()
    } else {
      done(false)
    }

  })

  grunt.registerTask('servers', 'start test servers', async function() {

    const done = this.async()

    if (signalingServers) {
      signalingServers.forEach((signalingServer) => {
        signalingServer.destroy()
      })
    }


    const params = require('./node/test/e2e/lib/params')
    const SignalingServer = require('./node/classes/SignalingServer').SignalingServer
    signalingServers = params.signalingServerPorts.map((port) => {
      return new SignalingServer(port)
      console.log(`start server ${port}`)
    })

    await delay(1000)

    done()
  })

}
