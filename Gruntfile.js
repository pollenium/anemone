module.exports = (grunt) => {

  require('load-grunt-tasks')(grunt)

  grunt.initConfig({
    eslint: {
      target: ['ts/**/*.ts']
    },
    watch: {
      files: [ 'Gruntfile.js', 'package.json', '.eslintrc.js', 'ts/**/*.ts', 'test/**/*.js'],
      tasks: ['build']
    },
    mochaTest: {
      test: {
        src: ['test/**/*'],
        options: {
          timeout: 100 * 1000,
          noFail: false
        }
      }
    },
    ts: {
      default : {
        tsconfig: './tsconfig.json'
      }
    },
    run: {
      options: {
        'no-color': false
      },
      'npm-test': {
        cmd: 'npm',
        args: ['test']
      }
    }
  })

  grunt.loadNpmTasks(
    'grunt-contrib-watch',
    'grunt-mocha-test',
    'grunt-ts',
    'grunt-run'
  )

  grunt.registerTask('build', [
    'eslint',
    'ts',
    'test'
  ])

  grunt.registerTask('test', [
    'run:npm-test',
  ])

  grunt.registerTask('default', 'default', () => {
    grunt.option('force', true)
    grunt.task.run(['build', 'watch'])
  });

}
