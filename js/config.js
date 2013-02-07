require([],function(){
    
    // mapping of css dependencies
    var moduleCss = {
        'jqueryui'      : ''
      , 'bootstrap'     : 'bootstrap.min'
      , 'bootstrap-res' : 'bootstrap.res'
    };
    
    /**
     * CSS loaded via JS
     * http://requirejs.org/docs/faq-advanced.html#css
     */
    var loadCss = function(module) {
        var css = moduleCss[module];
        if (! css) return;
        
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = 'cs/css/' + css + '.css?'+ (new Date()).getTime(); // note: cache breaking
        document.getElementsByTagName("head")[0].appendChild(link);
    }
    
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
          , ModalMgr        : "sys/ModalMgr"
            
            // basic libraries
          , json            : "//cdnjs.cloudflare.com/ajax/libs/json2/20121008/json2"
          , jquery          : "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min"
          , jqueryui        : "//ajax.googleapis.com/ajax/libs/jqueryui/1/jquery-ui.min"
          , bootstrap       : "//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/2.2.2/bootstrap.min"
          , underscore      : "//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.3/underscore-min"
          , backbone        : "//cdnjs.cloudflare.com/ajax/libs/backbone.js/0.9.10/backbone-min"
          , modernizr       : "//cdnjs.cloudflare.com/ajax/libs/modernizr/2.6.2/modernizr.min"
          , moment          : "//cdnjs.cloudflare.com/ajax/libs/moment.js/1.7.2/moment.min"
          , sinon           : "https://raw.github.com/cjohansen/Sinon.JS/v1.5.2/lib/sinon"
            
            // requirejs plugins
          , text            : "//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.3/text"
          // , async           : "https://raw.github.com/millermedeiros/requirejs-plugins/master/src/async"
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
              , init: function($){ 
                    loadCss('jqueryui');
                    return $; 
                }
            }
          , 'bootstrap' : { 
                deps: ['jquery','modernizr']
              , exports : '$'
              , init: function($){ 
                    loadCss('bootstrap'); 
                    
                    // should we be responsive? 
                    if (Modernizr.mq('') && window.screen.width < 800) {
                        
                        // <meta /> needed for response design
                        // http://twitter.github.com/bootstrap/scaffolding.html#responsive
                        var meta = document.createElement("meta");
                        meta.name = "viewport";
                        meta.content = "width=device-width, initial-scale=1.0";
                        document.getElementsByTagName("head")[0].appendChild(meta);
                        
                        loadCss('bootstrap-res');
                    }
                    
                    return $;
                }
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
          , 'modernizr'
          , 'text'
          // , 'async'
        ]
        
    });
    
    // and away we go!
    require(['index']);
});