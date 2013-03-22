define([
    "backbone"
  , "sys/RouterViewMgr"
  , "app/models/UserModel"
  , "app/models/AppModel"
  , "app/views/RedCrossView"
], function(
    Backbone
  , RouterViewMgr
  , UserModel
  , AppModel
  , RedCrossView
){ 
    // start the timer!
    var timer = +new Date();
    
    // root "window"/global scope
    var root = this;
    
    // clear <body />
    root.document.getElementsByTagName('body')[0].innerHTML = '';
    
    // default router options
    var routerDefaults = {
      
        // user information
        user    :{first_name  : 'John'
                , last_name   : 'Doe' 
                , email       : 'John.Doe@redcross.org'}
                      
        // app information
      , app     :{version     : 'x.x.x'
                , environment : '00_env'
                , sandbox     : false
                , title       : 'PHSS Application Skeleton'
                , indexes     :{'kit'       : 'Get a Kit'
                              , 'plan'      : 'Make a Plan'
                              , 'informed'  : 'Be Informed'}}
    };
    
    // extend Backbone Router
    var AppRouter = Backbone.Router.extend({
        
        // setup configuration
        initialize: function(opts){
            var options = _.defaults(opts, routerDefaults);
            
            // setup core user model
            this.user = new UserModel(options.user);
            
            // setup application model
            this.app = new AppModel(options.app);
            
            // initialize RouterViewMgr to track views
            this.views = new RouterViewMgr();
            
            // setup core RedCrossView
            this.rc = new RedCrossView({app: this});
            
            // setup each index view
            this.indexes = {
                // plan        : new PlanView({app: this})
              // , kit         : new KitView({app: this})
              // , informed    : new InformedView({app: this})
            };
        }
        
        // startup configuration
      , start: function(){
            
            // begin active routing
            if (! Backbone.history.start({root: window.location.pathname})) {
            
                // todo: handle routing fail(?)
                // console.log('Router failed to match URL on start.');
            }
            
            // page render event
            this.rc.once('render',function(){
                console.log('Page Rendered: '+ (+new Date() - timer) + 'ms');
            });
            
            // render core RedCrossView
            this.rc.render();
            
            
            // initialize each index view
            
        }
        
        // helper to return current route fragment
      , path: function(){
            return Backbone.history.fragment;
        }
        
        // map of navigation routes
      , routes: {
            ''                  :'_default_route_'
            
          , 'plan'              :'_plan'
          , 'kit'               :'_kit'
          , 'informed'          :'_informed'
          
          , 'account'           :'_route_'
          , 'application'       :'_route_'
        }
        
      , _default_route_: function(){
            /*var indexes = this.indexes;
            
            // determine which "index" is active
            for (var i = 0; i < indexes.length; i++) {
                
                if (indexes[i].inDOM() && indexes[i].$el.is(':visible'))
            }*/
        }
    });
    
    // bootstrap app configurations
    var app = root.app = new AppRouter(root.app);
    
    // and AWAY WE GO!
    app.start();
    
    // (& for completeness..)
    return app;
});