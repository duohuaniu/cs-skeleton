define([
    'backbone'
  , 'underscore'
  , 'jquery'
],function(
    Backbone
  , _ 
  , $
){

    /**
     * View Plugin
     * Container for various additional view functionality.
     */
    var ViewPlugin = function(view){
    
        // expects view to be a View object (as defined below)
        if (! (view instanceof View)) throw new Error('Plugin missing View instance (view)');
        
        this.view = view; // save the view reference
        this.initialize(); // call initialize
    }
    
    // extended to add in Backbone.Events, and no-op initialize
    _.extend(ViewPlugin.prototype, Backbone.Events, { initialize: function(){} });
    ViewPlugin.extend = Backbone.View.extend; // and copy Backbone.extend() for good measure
    
    
    /**
     * View 
     * Backbone.View extended to add:
     *      - basic plugin functionality, 
     *      - "parent" view reference, 
     *      - "listen" events mapping, 
     *      - "$targets" elements mapping,
     *      - $DOM container functionality, and 
     *      - "render"/"remove" event triggers.
     */
    var View = Backbone.View.extend({
        
        // view name, to be overwritten
        className : 'View' 
      
      , use: {} // mapping of plugins
      
        // DOM container node. see "setElement()" and static fn "setDOM()"
      // , $DOM : 'body' // defaulted to <body /> node
        
        // convenience properties (see extendHander())
      , $targets    : {} // convenience mappings for target $els
      , listen      : {} // convenience mappings for backbone events
      , events      : {} // convenience mappings for DOM events
        
      , constructor: function(options){
            
            // catch any parent view references
            var options = options || {};
            if (options.parent) this.parent = options.parent;
            
            // initialize plugins
            this._init_plugins();
            
            // call original constructor
            Backbone.View.apply(this, arguments);
            
            // start listening to other objects
            // note: always listen AFTER initialize()!
            this.startListening();
        }
        
      , _init_plugins: function(){
            var plugins = _.clone(_.result(this, 'use') || {});
            for (var p in plugins) plugins[p] = new plugins[p](this);
            this.use = plugins; // save plugins to "use" property
        }
        
        // helper function for selecting DOM elements
        // (this setup allows us to alias key $elements)
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
                            _.reduce(hash[1].split('.'),function(m,k){
                                return _.isObject(m)?m[k]:undefined; 
                            },this);
                            
                for (var i in (_.isArray(method) ? method : (method = [method]))) {
                    var m = _.isFunction(method[i]) ? method[i] : this[method[i]]; 
                    if (! m) throw new Error('Invalid method: "'+method[i]+'" for event: "'+eventName+'"');
                    if (target) this.listenTo(target,eventName,m); 
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
            
            // trigger "render" event
            this.trigger("render", this);
            
            // return this instance
            return this;
        }
        
        /* // overloaded to auto-insert into DOM
      , setElement: function(el){
            var setElement = Backbone.View.prototype.setElement;
            
            // auto-insert only if we're given a blank element
            // and if we're not in the DOM yet.. 
            if (_.isUndefined(el) && ! this.inDOM()) {
                
                // determine DOM target node for inserting
                var $dom = $(_.result(this, '$DOM'));

                // create root element, and append into $dom node
                var $el = Backbone.$('<' + _.result(this, 'tagName') + '>')
                                  .addClass(_.result(this, 'className'))
                                  .appendTo($dom);
                
                // and update view element
                return setElement.call(this, $el); 
            }
            
            // otherwise, just call original setElement
            return setElement.apply(this, arguments);
        } */
        
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

        /**
         * "DOM Container" Helper Function
         *
         * Updates the view's default DOM container node, for all instances of this view. 
         * Useful when used together with "setElementDOM()" to ensure view's $el is inserted
         * within the proper node. 
         *
         * The $DOM container node can be defined within the class definition, but sometimes
         * it's more useful to set the node during runtime, i.e., the container node does not
         * yet exist, because another view needs to be generated first.
         *
         * The target node can be specified as a selector, or as a jquery object.
         *
         */
      /* , setDOM: function(el){
            this.prototype.$DOM = el;
        } */
        
        // static property references the Plugin class
      , Plugin: ViewPlugin
        
    });

    // and that's it!
    return View;
});
