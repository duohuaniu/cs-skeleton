define([
    'skeleton'
  , 'backbone'
],function(
    Skeleton
  , Backbone
){
    console.log(Skeleton.View);
    /**
     * View Plugin
     * Container for various additional view functionality.
     */
    var ViewPlugin = function(view){
        this.view = view; // save the view reference
        this.initialize(); // call initialize
    }
    
    // extended to add in Backbone.Events, and no-op initialize
    _.extend(ViewPlugin.prototype, Backbone.Events, { initialize: function(){} });
    ViewPlugin.extend = Backbone.View.extend; // and copy Backbone.extend() for good measure
        
    // and that's it!
    return ViewPlugin;
});