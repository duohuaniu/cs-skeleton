define([
    'backbone'
  , 'underscore'
],function(
    Backbone
  , _ 
){

    // Backbone team was right, this does come in handy.
    // http://backbonejs.org/#Events
    var Dispatcher = function(options){
        this.options = options || {};
        this.initialize.apply(this, arguments);
    };
    
    // extended to add in a tiny bit more flexibility
    _.extend(Dispatcher.prototype, Backbone.Events, {
      
        // no-op, for convenience
        initialize: function(){}
        
        // method overloading to allows events map
      , on: function(events, context){
            
            // events map was passed
            if (_.isObject(events)) for (var ev in events){
                Backbone.Events.on.call(this, ev, events[ev], context);
            }
            
            // default behavior
            else Backbone.Events.on.apply(this, arguments);
        }
        
        // more method overloading for events map
      , listenTo: function(obj, events){
            
            // events map was passed
            if (_.isObject(events)) for (var ev in events){
                Backbone.Events.listenTo.call(this, obj, ev, events[ev]);
            }

            // default behavior
            else Backbone.Events.listenTo.apply(this, arguments);
        }
        
        // and last method overloading for events map
      , listenToOnce: function(obj, events){
            
            // events map was passed
            if (_.isObject(events)) for (var ev in events){
                Backbone.Events.listenToOnce.call(this, obj, ev, events[ev]);
            }

            // default behavior
            else Backbone.Events.listenToOnce.apply(this, arguments);
        }

    });
    
    // copy Backbone's .extend() pattern
    Dispatcher.extend = Backbone.Model.extend;
    
    // and that's it!
    return Dispatcher;
});
