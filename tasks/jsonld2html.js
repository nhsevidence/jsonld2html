var path = require('path');
var Handlebars = require('handlebars');
var IRI = require('iri').IRI;

var defaults = {
	views: 			 './src/views/',
	partials:    './src/views/partials',
	wwwroot:     '/'
};

module.exports = function( grunt ) {

  grunt.registerMultiTask( 'jsonld2html', 'Renders RDF data using framed contexts and templated views', function() {
    var done = this.async();

    var options = this.options( defaults );

    var files = this.files.slice();
    var views = loadViews( options.views );
    var partials = loadPartials( options.partials );

    process();

    function process() {
      if ( files.length <= 0 ) {
        done();
        return;
      }

      var file = files.pop();

      grunt.log.writeln( "Loading " + file.src[0] + "...");
      var content = grunt.file.read(file.src[0], { encoding: 'utf8' });

      var html = renderWith( views, options )( JSON.parse( content ) );

      grunt.file.write( file.dest, html );
      grunt.log.ok( "Output written to " + file.dest );

      process();
    }
  });




  // helper methods

  function renderWith( views, options ) {
    return function( doc ) {
      var model = getModelFromFramedDocument( doc );
			var view = options.view || getViewFromModel( model );

			if ( !views[ view ] ) {
				throw new Error( 'Cannot locate view [ '+ view +' ] it is not in the path ' + options.views );
			}

      grunt.verbose.writeln( 'Rendering with model:' );
      grunt.verbose.writeln( JSON.stringify( model, null, '  ' ) );
      grunt.verbose.writeln();

      return views[ view ]( model );
    }
  }

  function getModelFromFramedDocument( doc ) {
    var graphProperty = "@graph";
    var contextProperty = "@context";

    var model = doc[ graphProperty ] || doc;
		if ( model.length === 1 ) model = model[ 0 ];

    if ( model[ contextProperty ] ) {
      delete model[ contextProperty ];
    }

    return clone( model );
  }

	function getViewFromModel( model ) {
		if ( !model.type || model.type === '' ) {
			throw new Error( 'Cannot determine model type please specify with grunt.options.view' );
		}

		var type = model.type.toLowerCase();

		if ( type.indexOf( ':' ) ) {
			return type.split( ':' )[ 1 ];
		}

		var iri = new IRI( type );
		var id = iri.fragment();
				id = path.basename( id ? id.replace( '#', '' ) : iri.toIRIString() );

		var ext = path.extname( id );
		return ext ? id.replace( ext, '' ) : id;
	}

  function clone( oldObj ) {
    var newObj = oldObj;
    if ( oldObj && typeof oldObj === 'object' ) {
        newObj = Object.prototype.toString.call( oldObj ) === "[object Array]" ? [] : {};
        for ( var i in oldObj ) {
          newObj[ toSafeModelPropertyName( i ) ] = clone( oldObj[ i ] );
        }
    }
    return newObj;
  }

	function toSafeModelPropertyName( key ) {
	  return key.replace( /[_:@]/gmi, ' ' ).trim().replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function( match, index ) {
	    if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
	    return index == 0 ? match.toLowerCase() : match.toUpperCase();
	  });
	}

  function loadViews( cwd ) {
  	var files = grunt.file.expand( { cwd: cwd }, '*.hbs' );

    return process( files );

    function process( files, views ) {
      views = views || {};

      if ( files.length <= 0 ) {
        return views;
      }

      var filename = files.pop();
      var file = path.join( cwd, filename );
      var type = filename.replace( '.hbs', '' );

      grunt.verbose.writeln( "Loading view " + file + "...");
      var content = grunt.file.read(file, { encoding: 'utf8' });

      views[ type ] = Handlebars.compile( content );

      return process( files, views );
    }
  }

  function loadPartials( cwd ) {
  	var files = grunt.file.expand( { cwd: cwd }, '*.hbs' );

    return process( files );

    function process( files ) {
      if ( files.length <= 0 ) {
        return;
      }

      var filename = files.pop();
      var file = path.join( cwd, filename );
      var partialName = filename.replace( '.hbs', '' );

      grunt.verbose.writeln( "Registering partial " + file + "...");
      var content = grunt.file.read(file, { encoding: 'utf8' });

      Handlebars.registerPartial( partialName, content );

      return process( files );
    }
  }

};
