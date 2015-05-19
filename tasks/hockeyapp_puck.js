/*
 * grunt-hockeyapp-puck
 * https://github.com/dresources/grunt-hockeyapp-puck.git
 *
 * Copyright (c) 2015 rtregaskis
 * Licensed under the MIT license.
 */


var request = require('request'),
    fs = require('fs'),
	path = require('path');

module.exports = function(grunt) {
    'use strict';

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerTask('hockeyapp_create', 'Create new app on HockeyApp via grunt', function() {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            token: null,
			title: null,
			bundle_identifier: null,
			platform: 'iOS', //Android, Mac OS, Windows Phone, Custom
			release_type: '0',
			custom_release_type: null,
			icon:null,
			private: true
        });

		// warn and exit on missing options
        if (!options['token'] || options['token'] === undefined || options['token'] === '') {
            return grunt.fatal(
                'token option is required!'
            );
        } 
        if (!options['title'] || options['title'] === undefined || options['title'] === '') {
            return grunt.fatal(
                'title option is required!'
            );
        } 
        if (!options['bundle_identifier'] || options['bundle_identifier'] === undefined || options['bundle_identifier'] === '') {
            return grunt.fatal(
                'bundle_identifier option is required!'
            );
        } 

        // construct form data
        // NB: use read stream to access IPA file
        var formData = {
			title:options.title,
			bundle_identifier:options.bundle_identifier,
			platform:options.platform,
			release_type:options.release_type,
        };

        // tidy up url
        var url = 'https://rink.hockeyapp.net/api/2/apps/new';

        // run this asynchronously
        var done = this.async();

        grunt.log.subhead('Creating a new app instance for '+options.title);
		console.log(options);
		console.log(formData);

        // fire request to server.
        request.post({
            url: url,
            formData: formData,
            headers: {
                'X-HockeyAppToken': options['token']
            }
        }, function(error, response, body) {
            if (error !== null) {
                grunt.log.error(error);
                grunt.log.error('Error creating "' + options['title'] + '"');
                done(false);
            } else {
				grunt.config.set('ha_app_id', body.public_identifier);
                grunt.log.ok('Created new app "' + options['title'] + '" successfully');
                done();
            }
        });
    });


    grunt.registerTask('hockeyapp_upload', 'Upload builds to HockeyApp via grunt', function() {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            token: null,
            app_id: null,
            file: null,
            notes: 'Changelog',
            notify: 2,
            status: 2,
            tags: '',
			teams:null
        });

		// warn and exit on missing options
        if (!options['token'] || options['token'] === undefined || options['token'] === '') {
            return grunt.fatal(
                'Token option is required!'
            );
        } else if (!options['app_id'] || options['app_id'] === undefined || options['app_id'] === '') {
            return grunt.fatal(
                'Application id option is required!'
            );
        } else if (!options['file'] || options['file'] === undefined || options['file'] === '') {
            return grunt.fatal(
                'File option is required!'
            );
        } 

        // construct form data
        // NB: use read stream to access IPA file
        var formData = {
            ipa: fs.createReadStream(options['file']),
            status: options.status,
            notify: options.notify,
            notes: options.notes,
            notes_type: 1,
			teams: options.teams
        };

        // tidy up url
        var url = 'https://rink.hockeyapp.net/api/2/apps/' + options.app_id + '/app_versions/upload';

        // run this asynchronously
        var done = this.async();

        grunt.log.subhead('Uploading "' + options['file'] + '"');

        // fire request to server.
        request.post({
            url: url,
            formData: formData,
            headers: {
                'X-HockeyAppToken': options['token']
            }
        }, function(error, response, body) {
            if (error !== null) {
                grunt.log.error(error);
                grunt.log.error('Error uploading "' + options['file'] + '"');
                done(false);
            } else {
                grunt.log.ok('Uploaded "' + options['file'] + '" successfully');
                done();
            }
        });
    });
};
