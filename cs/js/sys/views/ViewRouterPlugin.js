/**
 * SubRouter - Backbone Router
 * Harry Truong (harry.truong@redcross.org)
 *
 * Implements a basic Backbone Router. 
 *
 */
define([
    'sys/ViewPlugin'
  , 'backbone'
  , 'underscore'
],function(
    ViewPlugin
  , Backbone
  , _
){

    // we're going to borrow these two utilities from Backbone.Router
    var RouterUtils = _.pick(Backbone.Router.prototype, ['_routeToRegExp','_extractParameters']);
    
    // router one-off for views
    var ViewRouterPlugin = ViewPlugin.extend({
        
        // init plugin 
        initialize: function(){
            var view = this.view
              , options = view.options || {}
              , routerEvent = options.routerEvent || ''
              , routes = options.routes || {};
            
            // proceed only if we have valid options
            if (routerEvent && routes) {
            
                // parse event hash and start listening
                var rev = routerEvent.split(' '), event = rev[0]
                  , obj = rev.length == 1 ? view : view[rev[1]];
                if (obj && event) this.listenTo(obj, event, this._checkRoutes);
                    
                // parse and store routes definition
                this.routes = _.map(_.keys(routes), RouterUtils._routeToRegExp);
                
                // store routes definition
                this.callbacks = _.values(routes);
                
                // setup cleanup
                this.listenTo(view, 'remove', this.stopListening);
            }
        }
        
        // check for matched routes
      , _checkRoutes: function(route){
            var routes = this.routes
              , callbacks = this.callbacks
              , view = this.view;
              
            // find matching regex route
            var match = _.find(routes, function(r){ return r.test(route); });
            
            // did we have a match?
            if (match) { 
            
                // select the callback
                var callback = callbacks[_.indexOf(routes, match)];
                
                // extract parameters
                var params = RouterUtils._extractParameters(match, route);
                
                // trigger callback on view
                if (_.isFunction(view[callback])) {
                    view[callback].apply(view, params);
                }
            }
        }
        
    });
    
    // and that's it!
    return ViewRouterPlugin;
});