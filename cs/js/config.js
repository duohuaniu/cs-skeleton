require([],function(){
    
    /**
     * http://requirejs.org/docs/api.html#config
     */
    require.config({
        
        // stops caching of js (remember to disable me!)
        urlArgs: (new Date()).getTime()
        
        // forces all loaded scripts to follow define() pattern
      , enforceDefine: true //'xcept shims
        
        // think like root application directory
      , baseUrl: "cs/js"
        
        // custom path re-routing: (but not loading!)
      , paths: {
            
            // core system classes
            BaseModel       : "sys/BaseModel"
          , BaseView        : "sys/BaseView"
          , ModalView       : "sys/ModalView"
            
            // basic libraries
          , json            : "//cdnjs.cloudflare.com/ajax/libs/json2/20121008/json2" //"sys/core/json2"
          , jquery          : "//ajax.googleapis.com/ajax/libs/jquery/1/jquery" //"sys/core/jquery"
          , jqueryui        : "//ajax.googleapis.com/ajax/libs/jqueryui/1/jquery-ui" //"sys/core/jquery.ui"
          , bootstrap       : "//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/2.2.2/bootstrap" //"sys/core/bootstrap"
          , underscore      : "//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.3/underscore" //"sys/core/underscore"
          , backbone        : "http://backbonejs.org/backbone" //"sys/core/backbone"
          , modernizr       : "//cdnjs.cloudflare.com/ajax/libs/modernizr/2.6.2/modernizr" //"sys/core/modernizr"
          , moment          : "//cdnjs.cloudflare.com/ajax/libs/moment.js/1.7.2/moment"  //"sys/core/moment"
          
            // unit testing libraries
          , sinon           : "https://raw.github.com/cjohansen/Sinon.JS/v1.5.2/lib/sinon"
            
            // requirejs lib (used for compiling)
          , requireLib      : 'sys/core/requirejs'
          
            // requirejs plugins
          , text            : "//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.3/text" //'sys/core/requirejs.text'
          , async           : "https://raw.github.com/millermedeiros/requirejs-plugins/master/src/async"
        }
        
        // special "don't enforce define" dependencies
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
          , 'modernizr' :  { 
                exports : 'Modernizr'
            }
          , 'moment' : {
                exports: 'moment'
            }
          , 'sinon' : {
                exports: 'sinon'
            }
            
        }
        
        // core application dependencies
      , deps: [
            'json'
        ]
        
    });
    
    // and away we go!
    require(['index']);
});