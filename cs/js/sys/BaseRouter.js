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
  // , 'sys/BaseCollection'
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
        root : window.location.pathname
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
            BaseView.prototype.app = this;
            BaseModel.prototype.app = this;
            // BaseCollection.prototype.app = this;
            
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
            
            // see documentation on "PushState Considerations"
            // if pushState is enabled, we want to prevent
            // default page navigations via <a /> tags
            if (this.options.pushState) {
                var router = this;
                
                // see http://stackoverflow.com/a/9331734
                $(document).on('click','a:not([data-bypass])',function(ev){
                    var href = $(this).attr('href')
                      , protocol = this.protocol + '//';
                    
                    if (href.slice(protocol.length) !== protocol) {
                        ev.preventDefault();
                        router.navigate(href, {trigger: true});
                    }
                });
            }
            
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