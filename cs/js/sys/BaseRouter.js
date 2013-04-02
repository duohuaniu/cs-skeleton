/**
 * BaseRouter - Backbone Router
 * Harry Truong (harry.truong@redcross.org)
 *
 * Implements a basic Backbone Router. 
 *
 */
define([
    'backbone'
  , 'sys/BaseView'
  , 'sys/BaseModel'
  // , 'BaseCollection'
],function(
    Backbone
  , BaseView
  , BaseModel
  // , BaseCollection
){

    /**
     * Custom Backbone Router Configurations
     */
    var DefaultRouterConfig = {
        
        // http://backbonejs.org/#History-start
        root : '/'
      , pushState : false
      
    };
    
    
    /**
     * Example Router Definition
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
    var BaseRouter = Backbone.Router.extend({
    
        // views container for "Content" and "Static" views
        views: {content:{}, static:{}} 
    
        // extended default constructor
      , constructor: function(options){
            
            // save default options config
            this.options = _.defaults(options||{}, DefaultRouterConfig);
            
            // set a global reference for all Views, Models
            // and Collections to this Router instance.
            BaseView.setApp(this);
            BaseModel.setApp(this);
            // BaseCollection.setApp(this);
            
            // call original constructor
            Backbone.Router.call(this, options);
        }
        
        // non-standard wrapper for Backbone.History.start()
      , start: function(){
      
            // see http://backbonejs.org/#History-start
            var routed = Backbone.history.start({
                root: this.options.root
              , pushState: this.options.pushState
            });
            
            // on failure to match route, navigate to default (empty)
            if (! routed) this.navigate('', {trigger:true, replace:true});
            
            // render any static views
            _.invoke(this.views.static || {}, 'render');
        }
        
        // helper to return current route fragment
      , fragment: function(){
            return Backbone.history.fragment;
        }
        
    });
    
    return BaseRouter;
});