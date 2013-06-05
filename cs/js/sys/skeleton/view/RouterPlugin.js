/**
 * SubRouter - Backbone Router
 * Harry Truong (harry.truong@redcross.org)
 *
 * Implements a basic Backbone Router. 
 *
 */
define([
    './../View'
  , 'backbone'
  , 'underscore'
],function(
    View
  , Backbone
  , _
){

    // key property name for the global router
    var RouterProp = 'router';

    // we're going to borrow these two utilities from Backbone.Router
    var RouterUtils = _.pick(Backbone.Router.prototype, ['_routeToRegExp','_extractParameters']);
    
    // router one-off for views
    var ViewRouterPlugin = View.Plugin.extend({
        
        // init plugin 
        initialize: function(){
            var view = this.view
              , options = view.options || {}
              , router = options.router || view[RouterProp] || {} 
              , routerEvent = options.routerEvent || ''
              , routes = options.routes || {};
            
            // proceed only if we have valid options
            if ((router instanceof Backbone.Router) && 
                routerEvent && routes) {
                
                // save reference to router
                this.router = router;

                // store key routerEvent
                this.routerEvent = routerEvent;

                // store route names
                this.routes = _.values(routes);

                // parse and store routes regex
                this.routesRegex = _.map(_.keys(routes), RouterUtils._routeToRegExp);
                
                // start listening for the special routerEvent
                this.listenTo(router, routerEvent, this._checkRoutes);
                
                // setup cleanup on remove event
                this.listenTo(view, 'remove', this.stopListening);
            }
        }
        
        // check for matched routes
      , _checkRoutes: function(route){
            var route = route || ''
              , router = this.router
              , routerEvent = this.routerEvent
              , routes = this.routes
              , routesRegex = this.routesRegex
              , view = this.view;
            
            // evaluate all regex routes
            var matches = _.map(routesRegex, function(r){ return r.test(route); });
            
            // for each match, start doing work
            for (var i in matches) {
                if (! matches[i]) continue;
                var routeName = routes[i];

                // extract parameters
                var params = RouterUtils._extractParameters(routesRegex[i], route);
                
                // insert the event name
                // params.unshift(routerEvent + "/" + routeName);
                params.unshift("route:" + routeName);

                // trigger event on router
                router.trigger.apply(router, params);
            }
        }
        
    });
    
    // and that's it!
    return ViewRouterPlugin;
});
