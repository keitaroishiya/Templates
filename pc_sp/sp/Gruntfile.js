module.exports = function(grunt) {
	grunt.initConfig({
		jshint: {
			all: [
				'Gruntfile.js',
				'js/src/**/*.js'
			]
		},

		// Compile Compass to CSS. 
		compass: {
			style: {
				options: {
					config: 'config.rb',
					sassDir: 'css/src',
					cssDir: 'css',
					outputStyle: 'compressed'
				}
			}
		},


		watch: {
			// js: {
			// 	files: [
			// 		'Gruntfile.js',
			// 		'js/src/**/*.js'
			// 	],
			// 	tasks: 'jshint'
			// },
			css: {
				files: [
					'css/src/style.scss'
				],
				tasks: 'compass'
			},
			img: {
				files: [
					'img/*.png',
					'img/**/*.png'
				],
				tasks: 'copy:styleguide_img'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
 	grunt.loadNpmTasks('grunt-contrib-compass');
};
