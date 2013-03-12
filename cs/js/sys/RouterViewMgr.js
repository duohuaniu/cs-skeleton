define([
    'backbone'
],function(
    Backbone
){
    var RouterViewMgr = function(app){
        this.app = app; // reference to backbone router
        this._views = {}; // map of views tracked
    };
    
    _.extend(RouterViewMgr.prototype, Backbone.Events, {
    
        // start tracking this view
        track: function(path, view){
        
            // store view, keyed to current fragment
            this._views[path] = view;
            
            // attach "dispose" event listener
            this.listenTo(view, 'dispose', function(){
            
                // remove view reference
                delete this._views[path];
                
                // stop listening to view
                this.stopListening(view);
                
                // update current path, if still set for this view
                if (this.app.path() == path) {
                
                    // navigate to blank (default route)
                    this.app.navigate('', {trigger: true});
                }
            });
        }
        
        // return this view
      , get: function(path){
            return this._views[path] ? this._views[path] : false;
        }
    });
    
    return RouterViewMgr;
    
});