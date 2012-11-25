/*global module:false*/
module.exports = function (grunt) {

    grunt.initConfig({
        meta:{
            version:'1.0',
            banner:"/* JS Table Frame <%= meta.version %> */"
        },
        concat:{
            dist:{
                src:['<banner:meta.banner>', 'src/*.js'],
                dest:'js-tableframe-<%= meta.version %>.js'
            }
        },
        min:{
            dist:{
                src:['<config:concat.dist.dest>'],
                dest:'js-tableframe-<%= meta.version %>.min.js'
            }
        },
        qunit: {
            all: ['test/tests.html']
        },
        server: {
            port: 8099,
            base: '.'
        }
    });

    grunt.registerTask('default', 'concat min');
    grunt.registerTask('run', 'default server watch');
    grunt.registerTask('test', 'default server qunit');

};