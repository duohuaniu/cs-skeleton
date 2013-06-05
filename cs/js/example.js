/**
 * ExampleView - Backbone View
 * Harry Truong (harry.truong@redcross.org)
 *
 * Implements a basic Backbone Router. 
 *
 */
define([
    'skeleton'
  , 'app/models/AppModel'
  , 'app/models/UserModel'
  , 'app/views/RootView'
],function(
    Skeleton
  , AppModel
  , UserModel
  , RootView
){

    /**
     * Example Skeleton Router
     * 
     * For full details on Backbone Router configurations, see 
     * http://backbonejs.org/#Router. 
     */
    var ExampleRouter = Skeleton.Router.extend({
        
        initialize: function(options){
            
            // initialize common models
            this.model = new AppModel();
            this.user = new UserModel();
            
            // initialize and render root view
            (new RootView({el: 'body'})).render();
        }
        
    });
    
    return ExampleRouter;
});