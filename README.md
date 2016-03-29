# jsonld2html

> convert JSON-LD graphs into HTML with handlebars view templates

## Getting Started

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install https://github.com/nhsevidence/jsonld2html.git --save
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('jsonld2html');
```

## JSONLD2HTML task
_Run this task with the `grunt jsonld2html` command._

Task targets, files and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.

### Options

#### helpers
Type: `Object`
Default: `{}`

This provides access to helper methods, such as text formatters, within the Handlebars templates. 

_Note: Please, consider the map function before creating complex template logic._

#### metadata
Type: `Object`  
Default: `{}`

Provides a way to include cross template dynamic model data for inclusion in all templates.

#### partials
Type: 'String'
Default: './src/views/partials'

Location of view partial templates.

#### views
Type: 'String'
Default: './src/views'

Location of view templates.

#### map
Type: 'Function'
Default: (m) => m

Map function used to transform the JSON-LD Graph into a more viable JSON Model Object.

### Usage Example

```js
jsonld2html: {
  models: {
    options: {
      view: 'model',
      map: (m) => m,
    },
    expand: true,
    src:    ['path/to/dir/*.json'],
    dest:   'wwwroot',
    ext:    '.html',
  }
}
```

#### Globbing Patterns

See documentation [in the Grunt Docs](http://gruntjs.com/configuring-tasks#globbing-patterns), for globbing pattern information

##### Skipping Files

```js
// Process all .json files, but skips index.json file
jsonld2html: {
  models: {
    src: ["path/to/dir/*.json", "!path/to/dir/index.json"]
  }
}
```

###### Options

Options can be specified for all `jsonld2html` tasks and for each `jsonld2html:target` just like in other Grunt tasks.
