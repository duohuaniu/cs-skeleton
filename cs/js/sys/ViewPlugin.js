define([
    'backbone'
  , 'underscore'
],function(
    Backbone
  , _
){
  
    // ViewPlugin basic constructor
    var ViewPlugin = function(view){
    
        // expects view to be a Backbone.View
        if (! (view instanceof Backbone.View)) throw new Error('Plugin missing Backbone.View (view)');
        
        // save the view reference
        this.view = view;
        
        // call initialize
        this.initialize();
    }
    
    // add in Backbone.Events
    _.extend(ViewPlugin.prototype, Backbone.Events, {
    
        // to be defined by actual plugin
        initialize: function(){}
        
    });
    
    // allow extensions (stolen directly from backbone's extend handler)
    // see http://backbonejs.org/docs/backbone.html#section-189
    ViewPlugin.extend = Backbone.Model.extend;
    
    // and that's it!
    return ViewPlugin;
    
});