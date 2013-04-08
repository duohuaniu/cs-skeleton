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
            
            // initialize "Content" and "Static" views
            this.views = {
                content: {
                    home    : new HomeView()
                  , about   : new AboutView()
                  , contact : new ContactView()
                }
              , static: {
                    topbar  : new TopbarView()
                }
            };
        }
        
        // see http://backbonejs.org/#Router-routes
      , routes: {
            '(:main)'          : '_route_default'
        }
        
      , _route_default: function(main){
            var view = main || 'home';
            
            // remove current active content view
            _.invoke(_.filter(this.views.content, function(v){return v.inDOM();}),'remove');
            
            // render routed view
            this.views.content[view].render();
            
            console.log(view);
        }
        
        
    });
    
    new (BaseRouter.extend({
        routes: {
            'blah'  : '_route_that'
        }
        
      , _route_that: function(){
            
            // remove all other content views
            _.invoke(this.views.content, 'remove');
            console.log('that');
            // render only about content view
            // this.views.content.about.render();
        }
    }));
    
    return ExampleRouter;
});