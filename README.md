# grunt-hockeyapp-puck

> Interface to HockeyApp RESTful API for grunt

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-hockeyapp-puck --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-hockeyapp-puck');
```

## Upgrading from `0.3.x`

Task names have changed to align them better with the API.

 * `hockeyapp_listapps` -> `puck_app_list`
 * `hockeyapp_create` -> `puck_app_new`
   * check `puck_app_id` instead of `ha_app_id`
 * `hockeyapp_addteam` -> `puck_team_add`
 * `hockeyapp_listteams` -> `puck_team_list`
   * check `puck_teams` instead of `ha_teams`
 * `hockeyapp_upload` -> `puck_version_upload`
   * instead of `file` use `ipa`

## API Token

This plugin requires an API token to communicate with the RESTful API. See [API: Basics and Authentication](http://support.hockeyapp.net/kb/api/api-basics-and-authentication) for more details. 

## Caveats

This is not a complete implementation of the API, although the intention is to fill this out as time allows. Currently you can create an app ID, add an app to team and upload a new version of your app. 

Also, this is a pain to test as to be able to upload builds you need a developer account and that costs money :$

## The "puck_app_list" task

Get list of apps for your token.

See [this link](http://support.hockeyapp.net/kb/api/api-apps#list-apps) for more details.

### Overview

```js
grunt.initConfig({
  puck_app_list {
    your_target: {
      options:{
        token: null,
      }
    },
  }
});
```
### Options

#### options.token (required)
Type: `String`
Default value: null

The authentication token.

### Result

```js
grunt.config('puck_apps'); // contains list of apps
```

## The "puck_app_new" task

Create a new app id. If successful, this sets `puck_app_id` in the `grunt` config to the new app id.

See [this link](http://support.hockeyapp.net/kb/api/api-apps#create-app) for more details.

### Overview

```js
grunt.initConfig({
  puck_app_new {
    your_target: {
      options:{
        token: null,
        title: null,
        bundle_identifier: null,
        platform: 'iOS', //Android, Mac OS, Windows Phone, Custom
        release_type: '0',
        custom_release_type: null,
        icon:null,
        private: 'true'
      }
    },
  }
});
```

### Options

#### options.token (required)
Type: `String`
Default value: null

The authentication token.

#### options.title (required)
Type: `String`
Default value: null

The apps name.

#### options.bundle_identifier (required)
Type: `String`
Default value: null

The bundle identifier on iOS or Mac OS X, the package name on Android, or the namespace on Windows Phone.

#### options.platform 
Type: `String`
Default value: `iOS`

App platform, valid values are `iOS`, `Android`, `Mac OS`, `Windows Phone` or `Custom`.

#### options.release_type
Type: `String`
Default value: `0`

Set release type of the app, valid values are `0` for beta, `1` for store, `2` for alpha and `3` for enterprise. 

#### options.custom_release_type
Type: `String`
Default value: ` `

Set to the custom release type.

#### options.icon
Type: `String`
Default value: null

Optional icon file with content type image/png, image/jpeg, or image image/gif

#### options.private
Type: `String`
Default value: `false`

Set to true to enable the private download page.

### Usage Examples

```js
grunt.initConfig({
  puck_app_new {
    iOS: {
      options:{
        token: '1234567890',
        title: 'New App',
        bundle_identifier: 'com.newbiz.NewApp',
        platform: 'iOS', 
        release_type: '0'
      }
    },
  }
});

grunt.config('puck_app_id'); // contains new app id

```

## The "puck_team_add" task

Add a team to an app.

See [this link](http://support.hockeyapp.net/kb/api/api-teams-app-users) for more details.

### Overview

```js
grunt.initConfig({
  puck_team_add {
    your_target: {
      options:{
        token: null,
        app_id: null,
        team_id: null
      }
    },
  }
});
```

### Options

#### options.token (required)
Type: `String`
Default value: null

The authentication token.

#### options.app_id (required)
Type: `String`
Default value: null

The apps identifier.

#### options.title (required)
Type: `String`
Default value: null

The team identifier you want to add the app to.


### Usage Examples

```js
grunt.initConfig({
  puck_team_add {
    iOS: {
      options:{
        token: '1234567890',
        app_id: '0987654321',
        team_id: '762'
      }
    }
  }
});
```

## The "puck_version_upload" task

Upload an app (.ipa, .apk or .zip). 

See [this link](http://support.hockeyapp.net/kb/api/api-apps#upload-app) for more details.

NB: use `puck_app_new` to get the app_id first before calling this task if you do not have one already.

### Overview

```js
grunt.initConfig({
  puck_version_upload {
    your_target: {
      options:{
        token: null,
        app_id: null,
        ipa null,
        notes: 'Changelog',
        notes_type: 1
        notify: 2,
        status: 2,
        tags: '',
        teams: null
      }
    }
  }
});
```

### Options

#### options.token (required)
Type: `String`
Default value: null

The authentication token.

#### options.app_id (required)
Type: `String`
Default value: null

The apps identifier.

#### options.file (required)
Type: `String`
Default value: null

File data of the .ipa for iOS, .app.zip for OS X, or .apk file for Android.

#### options.notes
Type: `String`
Default value: 'Changelog'

Change log in either Markdown or Textile format.

#### options.notes_type
Type: `Number`
Default value: '1'

Type of change log, `0` for Textile, `1` for Markdown.

#### options.notify
Type: `Number`
Default value: 2

Notify testers, `0` do not notify, `1` notify testers who can install this app or `2` notify all testers.

#### options.status
Type: `Number`
Default value: 2

Download status of app, `1` do not allow download, `2` allow download.

#### options.tags
Type: `String`
Default value: ''

Restrict download to CSV list of tags.

#### options.teams
Type: `String`
Default value: null

Restrict download to CSV list of team IDs.


### Usage Examples

```js
grunt.initConfig({
  puck_version_upload {
    iOS: {
      options:{
        token: '1234567890',
        app_id: '0987654321',
        file: <file data>,
        notes:'fixed bugs',
        teams:'22,33'
      }
    }
  }
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).
