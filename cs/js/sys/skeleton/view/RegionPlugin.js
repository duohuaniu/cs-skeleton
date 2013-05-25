define([
    './../View'
  , 'backbone'
  , 'underscore'
  , 'jquery'
],function(
    View
  , Backbone
  , _
  , $
){
    
    /**
     * Region Plugin vaguely inspired by 
     * 
     * Marionette - Region
     * Copyright (c) 2012 Derick Bailey; Muted Solutions, LLC
     * Distributed under MIT license.
     * https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.region.md
     */
    
    var Region = function(options){
        this._configure(options); // configure based on options
        this.listen(); // start tracking views
    };
    
    _.extend(Region.prototype, Backbone.Events, {
    
        _configure: function(options){
            var opts = this.options = options || {};
            
            // initialize current view
            this.current = false;
            
            // ensure we have valid $el
            var $el = this.$el = $(opts.el);
            if (! $el || $el.length == 0) throw new Error("An 'el' must be specified for a region.");
            
            // ensure we have views
            var views = this.views = opts.views;
            if (! this.views) throw new Error("'views' must be specified for a region.");
            
            // render views, unless told otherwise
            if (opts.render !== false) _.invoke(views, 'render');
            
            // opening event to listen to view for
            this.event = opts.event || 'show';
            
            // allow overridding of open/close behavior
            if (_.isFunction(opts.open)) this.open = opts.open;
            if (_.isFunction(opts.close)) this.close = opts.close;
        }
        
      , listen: function(){
            var event = this.event
              , views = this.views;
            
            for (var i in views){
                var view = views[i];
                
                this.listenTo(view, event, _.bind(function(view){
                    this._open(view);
                    this.current = view;
                },this,view));
            }
        }
        
      , _open: function(view){
            this._close();
            this.open(view);
            if (view.open) view.open();
            view.trigger("open", view);
            this.trigger("open", view);
        }
        
      , _close: function(){
            var view = this.current;
            if (! view) return;
            this.close(view);
            delete this.current;
            if (view.close) view.close();
            view.trigger("close", view);
            this.trigger("close", view);
        }
        
        // can be overridden to change region opening behavior
      , open: function(view){
            this.$el.append(view.$el);
            // this.$el.hide().append(view.$el).show('blinds');
        }
        
        // can be overridden to change region closing behavior
      , close: function(view){
            view.$el.detach();
        }
    });

    
    var ViewRegionPlugin = View.Plugin.extend({
    
        initialize: function(){
            
            // initialize regions collection
            this.regions = [];
            
            // tell all regions to stop listening when view is remove()'d
            this.listenTo(this.view, 'remove', function(){
                _.invoke(this.regions, 'stopListening');
                this.stopListening();
            });
        }
        
        // creates, saves and returns a new Region
      , create: function(options) {
            var region = new Region(options);
            this.regions.push(region);
            return region;
        }
        
    });
    
    // and that's it!
    return ViewRegionPlugin;
});