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

    // root "window"/global scope
    var root = this;
    
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
                , features    :{'kit'       : 'Get a Kit'
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
        }
        
        // startup configuration
      , start: function(){
            
            // begin active routing
            if (! Backbone.history.start({root: window.location.pathname})) {
            
                // todo: handle routing fail(?)
                // console.log('Router failed to match URL on start.');
                // this.navigate('', {trigger:true});
            }
            
            // render core RedCrossView
            this.rc.render();
        }
        
        // helper to return current route fragment
      , fragment: function(){
            return Backbone.history.fragment;
        }
        
      , routes: {
            ''              :'_route_'
          , 'plan'              :'_route_'
          , 'kit'              :'_route_'
          , 'informed'              :'_route_'
          , 'account'              :'_route_'
          , 'application'              :'_route_'
        }
        
      , _route_: function(){
            
        }
    });
    
    // bootstrap app configurations
    var app = root.app = new AppRouter(root.app);
    
    // and AWAY WE GO!
    app.start();
    
    // (& for completeness..)
    return app;
});