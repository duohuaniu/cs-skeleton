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
      // , haveView: function(func){
            // var fragment = Backbone.history.fragment;
            // var view = this._views[fragment];
            // if (! view) func.call(this);
            // else view.$modal.focusin();
        // }
        
        trackView: function(view, active, dispose){
            var fragment = Backbone.history.fragment;
            
            // store view, keyed to current fragment
            this._views[fragment] = view;
            
            // attach "active" event listener
            this.listenTo(view, active, function(){
                this.app.navigate(fragment, {trigger:false});
            });
            
            // attach "dispose" event listener
            this.listenTo(view, dispose, function(){
            
                // remove view reference
                delete this._views[fragment];
                
                // stop listening to view
                this.stopListening(view);
                
                // navigate to current index
                if (this.adminView.$el.is(':visible')) this.navigate('admin',{trigger:false});
                else if (this.requestsView.$el.is(':visible')) this.navigate('requests',{trigger:false});
            });
        }
    });
    
    return RouterViewMgr;
    
});