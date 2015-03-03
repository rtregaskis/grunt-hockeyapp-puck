/*
 * grunt-hockeyapp-puck
 * https://github.com/dresources/grunt-hockeyapp-puck.git
 *
 * Copyright (c) 2015 rtregaskis
 * Licensed under the MIT license.
 */


var request = require('request'),
	fs = require('fs');

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
            tags: '',
			platform: null
        });

		console.log(options);

		var formData = {
			ipa : fs.createReadStream(options['file']),
			status:options.status,
			notify:options.notify,
			notes:options.notes,
			notes_type:1
		};

	
		var url = 'https://rink.hockeyapp.net/api/2/apps/' + options.app_id + '/app_version/upload';


        // warn on missing options

        var done = this.async();

        request.get({
            url: url,
			formData:formData,
            headers: {
                'X-HockeyAppToken': options['token']
            }
        }, function(error, response, body) {
	            console.log(body);
			if(error !== null){
				grunt.log.error(error);
				grunt.log.rror('Error uploading "'+options['file']+'"');
				done(false);
			}else{
				grunt.log.ok('Uploaded "'+options['file']+'"');
				done();
			}
        });
    });

};
