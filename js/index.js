define([
    "backbone"
], function(
    Backbone
){ 
    
    // root "window"/global scope
    var root = this;
        
    // extend Backbone Router
    var Index = Backbone.Router.extend({
        
        // setup configuration
        initialize: function(){
        
        }
        
      , start: function(){
      
            // begin active routing
            if (! Backbone.history.start({root: window.location.pathname})) {
                
                // handle failure
            }
        }
        
      , routes: {
            ''                              : '_default_index'
          , 'route'                         : '_route'
        }
        
      , _default_index: function(){
            
        }
        
      , _route: function(){
            
        }
        
    });
    
    // bootstrap app configurations
    var app = root.app = new Index(root.app);
    
    // and away we go!
    app.start();
    
    // for completeness
    return app;
});