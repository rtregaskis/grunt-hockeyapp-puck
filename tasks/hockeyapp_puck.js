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

	// API: apps - http://support.hockeyapp.net/kb/api/api-apps
    grunt.registerMultiTask('puck_app_new', 'Create new app without uploading files', function() {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            token: null,
			title: null,
			bundle_identifier: null,
			platform: 'iOS', //Android, Mac OS, Windows Phone, Custom
			release_type: '0',
			custom_release_type: null,
			icon:null,
			private: 'true'
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
			private:options.private
        };

        // tidy up url
        var url = 'https://rink.hockeyapp.net/api/2/apps/new';

        // run this asynchronously
        var done = this.async();

        grunt.log.subhead('Creating a new app instance for '+options.title);

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

				grunt.config('puck_app_id', JSON.parse(body)['public_identifier']);
                grunt.log.ok('Created new app "' + options['title'] + '" successfully');
                done();
            }
        });
    });

    grunt.registerMultiTask('puck_app_list', 'List all apps for the logged user.', function() {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            token: null,
        });

		// warn and exit on missing options
        if (!options['token'] || options['token'] === undefined || options['token'] === '') {
            return grunt.fatal(
                'token option is required!'
            );
        } 

        // tidy up url
        var url = 'https://rink.hockeyapp.net/api/2/apps';

        // run this asynchronously
        var done = this.async();

        grunt.log.subhead('Listing apps');

        // fire request to server.
        request.get({
            url: url,
            headers: {
                'X-HockeyAppToken': options['token']
            }
        }, function(error, response, body) {
            if (error !== null) {
                grunt.log.error(error);
                grunt.log.error('Error listing apps!');
                done(false);
            } else {
				body = JSON.parse(body);
				console.log(body);
				grunt.config('puck_apps', body.apps);
				for (var i = 0; i < body.apps.length; i++){
					console.log(body.apps[i]['title']);
				}
                done();
            }
        });
    });

	// API: Teams - http://support.hockeyapp.net/kb/api/api-teams-app-user
	grunt.registerMultiTask('puck_team_list', 'Lists teams of app', function(){
		var options = this.options({
            token: null,
			app_id:null
		});

		// warn and exit on missing options
        if (!options['app_id'] || options['app_id'] === undefined || options['app_id'] === '') {
            return grunt.fatal(
                'app_id option is required!'
            );
        } 

        // tidy up url
        var url = 'https://rink.hockeyapp.net/api/2/apps/'+options.app_id+'/app_teams';

        // run this asynchronously
        var done = this.async();

        grunt.log.subhead('List teams of app');

        // fire request to server.
        request.get({
            url: url,
            headers: {
                'X-HockeyAppToken': options['token']
            }
        }, function(error, response, body) {
            if (error !== null) {
                grunt.log.error(error);
                grunt.log.error('Error listing team to app!');
                done(false);
            } else {
				body = JSON.parse(body);
                grunt.log.ok('Teams linked to this app:');
				grunt.config('puck_teams', body.teams);
				for (var i = 0; i < body.teams.length; i++){
					console.log(body.teams[i]['id'], body.teams[i]['name']);
				}
                done();
            }
        });
	});

	grunt.registerMultiTask('puck_team_add', 'Add team to app', function(){
		var options = this.options({
			app_id:null,
			team_id:null
		});

		// warn and exit on missing options
        if (!options['token'] || options['token'] === undefined || options['token'] === '') {
            return grunt.fatal(
                'token option is required!'
            );
        } 
        if (!options['app_id'] || options['app_id'] === undefined || options['app_id'] === '') {
            return grunt.fatal(
                'app_id option is required!'
            );
        } 
        if (!options['team_id'] || options['team_id'] === undefined || options['team_id'] === '') {
            return grunt.fatal(
                'team_id option is required!'
            );
        } 

        // tidy up url
        var url = 'https://rink.hockeyapp.net/api/2/apps/'+options.app_id+'/app_teams/'+options.team_id;

        // run this asynchronously
        var done = this.async();

        grunt.log.subhead('Add app to team');

        // fire request to server.
        request.put({
            url: url,
            headers: {
                'X-HockeyAppToken': options['token']
            }
        }, function(error, response, body) {
            if (error !== null) {
                grunt.log.error(error);
                grunt.log.error('Error adding team to app!');
                done(false);
            } else {
                grunt.log.ok('Added team to app successfully');
                done();
            }
        });
	});

	// API: Versions - http://support.hockeyapp.net/kb/api/api-versions
    grunt.registerMultiTask('puck_version_upload', 'Upload Version', function() {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            token: null,
            app_id: null,
            ipa: null,
            dsym: null,
            notes: 'Changelog',
			notes_type:1,
            notify: 2,
            status: 2,
            tags: '',
			teams:null,
			users:null,
			mandatory:0,
			commit_sha:null,
			build_server_url:null,
			repository_url:null
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
        } else if (!options['ipa'] || options['ipa'] === undefined || options['ipa'] === '') {
            return grunt.fatal(
                'IPA option is required!'
            );
        } 

        // construct form data
        // NB: use read stream to access IPA file
		// TODO: merge options into formData
        var formData = {
            ipa: fs.createReadStream(options['ipa']),
            status: options.status,
            notify: options.notify,
            notes: options.notes,
            notes_type: options.notes_type,
			teams: options.teams
        };

        // tidy up url
        var url = 'https://rink.hockeyapp.net/api/2/apps/' + options.app_id + '/app_versions/upload';

        // run this asynchronously
        var done = this.async();

        grunt.log.subhead('Uploading "' + options['ipa'] + '"');

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
                grunt.log.error('Error uploading "' + options['ipa'] + '"');
                done(false);
            } else {
                grunt.log.ok('Uploaded "' + options['ipa'] + '" successfully');
                done();
            }
        });
    });
};
