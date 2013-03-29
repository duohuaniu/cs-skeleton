/**
 * config.js
 * Harry Truong (harry.truong@redcross.org)
 *
 * Configures RequireJS, and then bootstraps application (index.js).
 */
require([],function(){
    
    /**
     * RequireJS Configuration
     *
     * For full details, see http://requirejs.org/docs/api.html#config.
     */
    requirejs.config({
        
        /**
         * Root Directory
         * 
         * Relative "root" application directory. When possible, the <base /> 
         * tag should also be defined in <head />.
         */
        baseUrl: "cs/js"
        
        /**
         * Module Source Paths
         * 
         * Mapping of external libraries for convenience. By default, the 
         * libraries mapped below are loaded via a CDN. When compiling the 
         * project, remember to replace these paths with local file copies.
         * 
         * Final words of caution on loading files externally (i.e., from CDNs): 
         * 
         *     "USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM 
         *     SERVERS YOU DO NOT CONTROL." 
         *         - Douglas Crockford, json2.js lines 15-16.
         */
      , paths: {
            
            // JSON3 - "... a modern JSON implementation compatible with a 
            // variety of JavaScript platforms." (http://bestiejs.github.com/json3/)
            json : "//cdnjs.cloudflare.com/ajax/libs/json3/3.2.4/json3"
            
            // jQuery - "... a fast, small, and feature-rich JavaScript library. 
            // It makes things like HTML document traversal and manipulation, event 
            // handling, animation, and Ajax much simpler with an easy-to-use API 
            // that works across a multitude of browsers. (http://jquery.com/)
          , jquery : "//ajax.googleapis.com/ajax/libs/jquery/1/jquery"
          
            // jQuery UI - "... a curated set of user interface interactions, 
            // effects, widgets, and themes built on top of the jQuery JavaScript 
            // Library." (http://http://jqueryui.com/)
          , jqueryui : "//ajax.googleapis.com/ajax/libs/jqueryui/1/jquery-ui"
          
            // Bootstrap - "Sleek, intuitive, and powerful front-end framework for 
            // faster and easier web development." (http://twitter.github.com/bootstrap/)
          , bootstrap : "//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/2.3.1/js/bootstrap"
          
            // Underscore.js - "... is a utility-belt library for JavaScript that 
            // provides a lot of the functional programming support that you would 
            // expect in Prototype.js (or Ruby), but without extending any of the 
            // built-in JavaScript objects." (http://underscorejs.org/)
          , underscore : "//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4/underscore"
          
            // Backbone.js - ".. gives structure to web applications by providing 
            // models with key-value binding and custom events, collections with a 
            // rich API of enumerable functions, views with declarative event handling, 
            // and connects it all to your existing API over a RESTful JSON interface."
            // (http://backbonejs.org/)
          , backbone : "//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.0.0/backbone"
          
            // Moment.js - "A 5.5kb javascript date library for parsing, validating, 
            // manipulating, and formatting dates." (http://momentjs.com/)
          , moment : "//cdnjs.cloudflare.com/ajax/libs/moment.js/2.0.0/moment"
            
            // Sinon.JS - "Standalone test spies, stubs and mocks for JavaScript.
            // No dependencies, works with any unit testing framework." (http://sinonjs.org/)
          , sinon : "http://sinonjs.org/releases/sinon-1.6.0"
            
            // RequireJS Text Plugin - "Specify a Text File Dependency" 
            // (http://requirejs.org/docs/api.html#text)
          , text : "//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.5/text" 
          
            // RequireJS Local Library (used by compiler)
          // , requireLib : 'path/to/local/require'
          
            
            /**
             * ... And other great libraries. 
             * 
             * You should continue to declare your own personal preferences, 
             * as needed. There are tons of great open source projects out there, 
             * and our choices above are NOT representational of all the tools we
             * use. 
             * 
             * Check out different open source code repositories & CDNs to explore 
             * what's out there. Here are a few to get you started:
             *  - http://www.github.com
             *  - http://developers.google.com/speed/libraries/devguide
             *  - http://cdnjs.com/
             */
        }
        
        /**
         * Module Shim Configuration
         * 
         * If the lib is not available as an AMD module, it may be necessary to 
         * define a shim. Generally, this just means declaring what the module 
         * will export as a global variable, so that RequireJS can detect when 
         * the file has been successfully loaded. 
         * 
         * It is also useful to declare dependencies, if the shim requires other 
         * libraries to be loaded first.
         * 
         * See http://requirejs.org/docs/api.html#config-shim for more details.
         */
      , shim: {
            'json' : {
                exports: 'JSON'
            }
          , 'jquery' : {
                exports : '$'
            }
          , 'jqueryui' : {
                deps: ['jquery']
              , exports : '$.ui'
            }
          , 'bootstrap' : { 
                deps: ['jquery']
              , exports : '$'
            }
          , 'underscore' : {
                exports : '_'
            }
          , 'backbone' :  { 
                deps: ['underscore', 'jquery']
              , exports : 'Backbone'
            }
          , 'moment' : {
                exports: 'moment'
            }
          , 'sinon' : {
                exports: 'sinon'
            }
        }
        
        /**
         * Core Module Dependencies
         * 
         * These are application-wide dependencies you can declare, 
         * so that you don't have to worry about requiring them later.
         */
      , deps: [
            'json'
        ]
        
        /**
         * Misc. Configurations
         */
      , urlArgs: +new Date() // prevents file caching by appending timestamp
      , enforceDefine: true // always enforce modular AMD pattern  
        
    });
    
    /**
     * Bootstraps the application (index.js)
     */
    require(['index']); // away we go!
});