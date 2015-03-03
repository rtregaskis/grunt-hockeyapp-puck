/*
 * grunt-hockeyapp-puck
 * https://github.com/rtregaskis/grunt-hockeyapp-puck
 *
 * Copyright (c) 2015 rtregaskis
 * Licensed under the MIT license.
 */


var request = require('request');

module.exports = function(grunt) {
    'use strict';

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('hockeyapp_puck', 'Interface to HockeyApp for grunt', function() {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            token: null,
            app_id: null,
            file: null,
            notes: 'Changelog',
            notify: 2,
            status: 2,
            tags: ''
        });

        // warn on missing options

        var done = this.async();

        request.get({
            url: 'https://rink.hockeyapp.net/api/2/apps',
            headers: {
                'X-HockeyAppToken': options['token']
            }
        }, function(e, r, b) {
            console.log(b);
        });
    });

};
