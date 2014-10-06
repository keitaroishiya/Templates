module.exports = function(grunt) {
	grunt.initConfig({
		jshint: {
			all: [
				'Gruntfile.js',
				'js/src/**/*.js'
			]
		},

		concat: {
            files: {
                // 元ファイルの指定
                src : 'js/src/*.js',
                // 出力ファイルの指定
                dest: 'js/script.js'
            }
        },

        uglify: {
            dist: {
                files: {
                    // 出力ファイル: 元ファイル
                    'js/script.min.js': 'js/script.js'
                }
            }
        },

        handlebars: {
			compile: {
				options: {
					namespace: "HBTemplates",
					processName: function(filepath) { // input -> app/hbs/partial.hbs
						var pieces = filepath.split("/");
						return pieces[pieces.length - 1].replace(/.html$/ , ''); //output -> partial
					}
				},
				files: {
					"js/template.js": "templates/*.html"
				}
			}
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
			js: {
				files: [
					'Gruntfile.js',
					'js/src/**/*.js'
				],
				tasks: [
						// 'jshint',
						'handlebars',
						'concat',
						'uglify'
					]
			},
			css: {
				files: [
					'css/src/style.scss'
				],
				tasks: 'compass'
			},
			// img: {
			// 	files: [
			// 		'img/*.png',
			// 		'img/**/*.png'
			// 	],
			// 	tasks: 'copy:styleguide_img'
			// }
		}
	});
	
	grunt.loadNpmTasks('grunt-contrib-handlebars');
	grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
 	grunt.loadNpmTasks('grunt-contrib-compass');
};
