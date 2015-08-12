module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass: {
            dist: {
            	files: {
            		'static/styles.css': 'static/styles.scss'
            	}
            }
        },
        cssmin: {
        	css:{
        		src: 'static/styles.css',
        		dest: 'static/styles.min.css'
        	}
        },
        uglify: {
        	js: {
        		files: {
        			'static/main.min.js': ['static/main.js']
        		}
        	}
        },
        watch: {
            options: {
                livereload: true,
            },
            dist: {
                files: ['static/main.js', 'static/styles.scss', 'index.html'],
                tasks: ['sass', 'cssmin', 'uglify']
            }
        }
    });

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-sass');

	grunt.registerTask('default', ['sass:dist', 'cssmin:css', 'uglify:js']);
};
