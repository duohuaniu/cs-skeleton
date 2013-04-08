/**
 * SubRouter - Backbone Router
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
     * Sub Router Definition
     */
    var SubRouter = Backbone.Router.extend({
    
        // extended default constructor
        constructor: function(view, options){
            
            // set reference to this view
            this.view = view;
            
            // set routes from the view
            var options = view.options || {}
              , routes = options.routes;
            
            // call original constructor
            Backbone.Router.call(this, options);
        }
        
        // helper to return current route fragment
      , fragment: function(){
            return Backbone.history.fragment;
        }
    });
    
    return SubRouter;
});