define([
    'backbone'
  , 'sys/views/ViewRouterPlugin'
  , 'sys/views/ViewTemplatePlugin'
  , 'sys/views/ViewHintsPlugin'
  , 'sys/views/ViewAjaxPlugin'
  , 'sys/views/ViewModalPlugin'
],function(
    Backbone
  , ViewRouterPlugin
  , ViewTemplatePlugin
  , ViewHintsPlugin
  , ViewAjaxPlugin
  , ViewModalPlugin
){
    
    // list of baseview options to be directly attached as properties.
    var baseViewProps = ['app', 'display'];
    
    // extend Backbone.View
    var BaseView = Backbone.View.extend({
        
        name        : 'BaseView' // view name, to be overwritten
      , options     : {} // options from init (useful for plugins)
      
        // plugins mapping, w/ default BaseView plugins
      , plugins     : { 
                        router  : ViewRouterPlugin
                      , tpl     : ViewTemplatePlugin
                      , hints   : ViewHintsPlugin
                      , ajax    : ViewAjaxPlugin
                      , modal    : ViewModalPlugin
                      }
        
        // convenience properties (see extendHander())
      , $targets    : {} // convenience mappings for target $els
      , listen      : {} // convenience mappings for backbone events
      , events      : {} // convenience mappings for DOM events
        
        /**
         * constructor -- extended from Backbone.View to add:
         */
      , constructor: function(options){
            var options = options || {};
            
            // pick properties to be attached directly to the view
            _.extend(this, _.pick(options, baseViewProps));
            
            // BaseView requires a reference to the central Backbone.Router
            if (! (this.app instanceof Backbone.Router)) throw new Error(this.name + ' missing Backbone.Router (app)');
            
            // initialize plugins container
            this.use = {}; 
            
            // initialize plugins
            var plugins = this.plugins;
            for (var p in plugins) {
                this.use[p] = new plugins[p](this);
            }
            
            // start listening to other objects
            this.startListening();
            
            // call original constructor
            Backbone.View.call(this, options);
        }
        
        // helper function for selecting DOM elements
        // (this setup allows us to alias key $els)
      , $t: function(key){
            return this.$(this.$targets[key]);
        }
        
        // listenTo events from "listen" hash
      , startListening: function(events) {
            if (!(events || (events = _.result(this, 'listen')))) return;
            this.stopListening();
            
            for (var key in events) {
                var method = events[key]
                  , hash = key.split(' ')
                  , eventName = hash[0]
                  
                // allow target to traverse properties (i.e., "foo.bar.baz")
                var target = hash.length == 1 ? this : 
                            _.reduce(hash.slice(1),function(m,k){
                                return _.isObject(m)?m[k]:undefined; 
                            },this);
                            
                for (var i in (_.isArray(method) ? method : (method = [method]))) {
                    var m = _.isFunction(method[i]) ? method[i] : this[method[i]]; 
                    if (! m) throw new Error('Invalid method: "'+method[i]+'" for event: "'+eventName+'"');
                    this.listenTo(target,eventName,m); 
                }
            }
        }
        
        // extends delegateEvents to include view targets ($targets)
      , delegateEvents: function(events) {
            if (!(events || (events = _.result(this, 'events')))) return;
            
            var $targets = this.$targets
              , targetEvents = {};
            
            // re-map events hash
            _.each(events, function(event,eventHash){
                var hash = eventHash.split(' ')
                  , target = hash.pop();
                  
                // if a valid target was specified..
                if (hash.length > 0 && $targets[target]) {
                
                    // replace eventHash with the target's selector
                    eventHash = eventHash.replace(target, $targets[target]);
                }
                
                // update new targeted events
                targetEvents[eventHash] = event;
            });
            
            // call original delegateEvents
            return Backbone.View.prototype.delegateEvents.call(this, targetEvents);
        }
        
        /**
         * extended remove -- cleans up after the view is no longer needed
         */
      , remove: function(){
            
            // trigger "remove" event
            this.trigger("remove", this);
            
            // call and return original view.remove()
            return Backbone.View.prototype.remove.apply(this, arguments);
        }
        
        /**
         * render -- default rendering workflow
         */
      , render: function(){
      
            // render the main template to default $el
            this.use.tpl.render(this.$el, 'main');
            
            // trigger "render" event
            this.trigger("render", this);
            
            // return this instance
            return this;
        }
        
        // helper to determine if $el is in DOM
      , inDOM: function($el){
            return ($el || this.$el).closest('html').length > 0; 
        }
        
    }, {
        
        /**
         * "Handler" Helper function
         * 
         * extendHandler helps to segregate sections of minor functionality within 
         * a view. It is entirely OPTIONAL and was solely implemented for code 
         * readability purposes. 
         * 
         * This utility behaves like .extend(), but merges three main properties: 
         * target elements ("$targets"), mapped backbone events ("listen"), and 
         * mapped DOM events ("events").
         * 
         * All other properties must be prefixed with "_" in order to be attached.
         * 
         */
        extendHandler: function(ext){
            var proto = this.prototype
              , exts = _.defaults(ext||{},{$targets:{},listen:{},events:{}});
            
            // merge $targets property, overwriting keys
            var $targets = _.extend({}, proto.$targets, exts.$targets);
            
            // merge listen property, merging by keys
            var listen = _.clone(proto.listen);
            for (var e in exts.listen) {
                listen[e] = listen[e] ? _.union([], exts.listen[e], listen[e]) : exts.listen[e];
            }
            
            // merge events property, merging by keys
            var events = _.clone(proto.events);
            for (var e in exts.events) {
                events[e] = events[e] ? _.union([], exts.events[e], events[e]) : exts.events[e];
            }
            
            // filter for valid "_" prefixed properties
            var validProps = _.pick(ext,_.filter(_.keys(ext),function(k){return k.indexOf("_") === 0;}));
            
            // directly extend this prototype
            _.extend(this.prototype, {
                $targets: $targets
              , listen: listen
              , events: events
            }, validProps);
            
            return this; // for chaining..
        }
        
    });
    
    return BaseView;
});