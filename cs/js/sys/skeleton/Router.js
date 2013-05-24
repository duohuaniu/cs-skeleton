/**
 * Router - Backbone Router
 * Harry Truong (harry.truong@redcross.org)
 *
 * Implements a basic Backbone Router. 
 *
 */
define([
    'backbone'
],function(
    Backbone
){

    /**
     * Default BaseRouter Config
     */
    var defaultConfig = {
        
        // passed to Backbone.history.start()
        root        : window.location.pathname
      , pushState   : false
    };
    
    
    /**
     * Router
     * Backbone.Router extended to add:
     *      - singleton pattern
     *      - psudo-"global" availability
     *      - act only as a route event emitter.
     */
    var routerSingleton, 
        protoVar = 'router'
      , appendProto = [];
    var Router = Backbone.Router.extend({

        // extended default constructor
        constructor: function(options){
            
            // enforce a singleton router
            if (routerSingleton) return routerSingleton;
            routerSingleton = this;
            
            // save default options config
            var options = this.options = _.defaults(options||{}, defaultConfig);
            
            // enforce psudo-"global" availablity
            for (var i in appendProto) appendProto[i].prototype[protoVar] = this;
            
            // call original constructor
            Backbone.Router.call(this, options);
        }
        
        // non-standard wrapper for Backbone.History.start()
      , start: function(){
            var options = this.options;
            
            // see http://backbonejs.org/#History-start
            var routed = Backbone.history.start({
                root: options.root
              , pushState: options.pushState
            });
            
            // see documentation on "PushState Considerations"
            // if pushState is enabled, we want to prevent
            // default page navigations via <a /> tags
            if (options.pushState) {
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
            // note: this is impossible, because the routes defined below
            //       should cover every possibe case.
            if (! routed) this.navigate('', {trigger:true, replace:true});
        }
        
        // see http://backbonejs.org/#Router-routes
      , routes: {}
        
    },{
    
        // "setProto" Helper to collect targets for psudo-global state
        setProto: function(list, prop){
            appendProto = list;
            protoVar = prop;
        }
        
        // "extendRoutes" helper to keep appending to routes hash
      , extendRoutes: function(hash){
            var routes = this.prototype.routes;
            this.prototype.routes = _.extend(routes || {}, hash);
        }
        
    });
   
    // and that's it! 
    return Router;
});
