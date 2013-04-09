/**
 * ExampleView - Backbone View
 * Harry Truong (harry.truong@redcross.org)
 *
 * Implements a basic Backbone Router. 
 *
 */
define([
    'sys/BaseRouter'
  , 'app/models/AppModel'
  , 'app/models/UserModel'
  , 'app/views/TopbarView'
  , 'app/views/ExampleView'
  , 'app/views/ExampleView'
  , 'app/views/ExampleView'
],function(
    BaseRouter
  , AppModel
  , UserModel
  , TopbarView
  , HomeView
  , AboutView
  , ContactView
){

    /**
     * Example BaseRouter Definition
     * 
     * For full details on Backbone Router configurations, see 
     * http://backbonejs.org/#Router. 
     *
     * For this example, we focus on routing to three "Content" views: 
     * HomeView, AboutView and ContactView. There is also one "Static" 
     * view, TopbarView.
     * 
     * When planning views for your app, see documentation notes on 
     * "Content" and "Static" views: http://documentation.tbd/views.
     * 
     */
    var ExampleRouter = BaseRouter.extend({
        
        initialize: function(options){
            
            // initialize common models: AppModel, UserModel
            this.model = new AppModel();
            this.user = new UserModel();
            
            // initialize static views
            this.static = {
                topbar  : new TopbarView()
            };
            
            // initialize content views
            this.views = {
                home    : new HomeView()
              // , about   : new AboutView()
              // , contact : new ContactView()
            };
        }
        
        // see http://backbonejs.org/#Router-routes
      , routes: {
            ''                      : 'default'
          , 'home(/*splat)'         : 'home'
          , 'about(/*splat)'        : 'about'
          , 'contact(/*splat)'      : 'contact'
        }
        
      , default: function(){
            this.navigate('home', {trigger: true, replace: true});
        }
        
      , home: function(path){
            console.log(path);
            // remove current active content view
            _.invoke(_.filter(this.views, function(v){return v.inDOM();}),'remove');
            
            // render routed view
            this.views.home.render();
        }
        
    });
    
    return ExampleRouter;
});