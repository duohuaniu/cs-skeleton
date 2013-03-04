define([
    "backbone"
  , "app/views/RedCrossView"
  , "BaseModel"
  , "BaseModel"
], function(
    Backbone
  , RedCrossView
  , UserModel
  , AppModel
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
            
            // setup configuration values
            this.version = options.version;
            this.environment = options.environment;
            this.sandbox = options.sandbox;
            
            // setup core user model
            this.user = new UserModel(options.user);
            
            // setup application model
            this.app = new AppModel(options.app);
            
            // initialize map of tracked views
            this.views = {};
            
            // setup core red cross view
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
            
            // render top view
            this.rc.render();
        }
        
      // , haveView: function(func){
            // var fragment = Backbone.history.fragment;
            // var view = this.views[fragment];
            // if (! view) func.call(this);
            // else view.$modal.focusin();
        // }
        
      , trackView: function(view, active, dispose){
            var fragment = Backbone.history.fragment;
            
            // store view, keyed to current fragment
            this.views[fragment] = view;
            
            // attach "active" event listener
            this.listenTo(view, active, function(){
                this.navigate(fragment, {trigger:false});
            });
            
            // attach "dispose" event listener
            this.listenTo(view, dispose, function(){
            
                // remove view reference
                delete this.views[fragment];
                
                // stop listening to view
                this.stopListening(view);
                
                // navigate to current index
                if (this.adminView.$el.is(':visible')) this.navigate('admin',{trigger:false});
                else if (this.requestsView.$el.is(':visible')) this.navigate('requests',{trigger:false});
            });
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
        
      , fragment: function(){
            return Backbone.history.fragment;
        }
    });
    
    // bootstrap app configurations
    var app = root.app = new AppRouter(root.app);
    
    // and AWAY WE GO!
    app.start();
    
    // (& for completeness..)
    return app;
});