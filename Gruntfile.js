module.exports = function(grunt) {

    // configurable paths
    var appConfig = {
        app: 'app',
        dist: 'dist'
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        app: appConfig,

        // copy
        copy: {
            main: {
                files: [
                {
                    src: '<%= app.app %>/img/**',
                    dest: '<%= app.dist %>/img/',
                    expand: true,
                    flatten: true,
                    filter: 'isFile'
                }]
            }
        },

        useminPrepare: {
            html: '<%= app.app %>/index.html',
            options: {
                dest: '<%= app.dist %>'
            }
        },

        usemin: {
            html: ['<%= app.dist %>/index.html'],
            css: ['<%= app.dist %>/css/{,*/}*.css'],
            options: {
                dirs: ['<%= app.dist %>']
            }
        },

        htmlmin: {
            dist: {
                options: {
                },
                files: [{
                    expand: true,
                    cwd: '<%= app.app %>',
                    src: 'index.html',
                    dest: '<%= app.dist %>'
                }]
            }
        }

    });
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-usemin');

    grunt.registerTask('default',
    [
        'useminPrepare',
        'htmlmin',
        'concat',
        'cssmin',
        'uglify',
        'usemin',
        'copy'
    ]);

}
