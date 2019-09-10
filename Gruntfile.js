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
    ts: {
      default : {
        tsconfig: './tsconfig.json'
      }
    },
    run: {
      'npm-test': {
        cmd: 'npm',
        args: ['test']
      }
    }
  })

  grunt.loadNpmTasks(
    'grunt-contrib-watch',
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
