module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    requirejs: {
      compile: {
        options: {
          name : 'main',
          baseUrl: "public/app/",
          mainConfigFile: "public/app/main.js",
          out: "public/dist/app.js",
          wrap: false
        }
      }
    }

  });

  // Load the Grunt tasks
  grunt.loadNpmTasks('grunt-contrib-requirejs');

  // Default task(s).
  grunt.registerTask('default', ['requirejs']);

};