define([
    'backbone'
  , 'sys/ViewTemplateMgr'
  , 'sys/ViewHintsMgr'
  , 'sys/ViewAjaxMgr'
  , 'bootstrap'
  , 'jquery'
],function(
    Backbone
  , ViewTemplateMgr
  , ViewHintsMgr
  , ViewAjaxMgr
){

    // original BackboneView
    var BackboneView = Backbone.View;
    
    // list of baseview options to be merged as properties.
    var baseViewOptions = ['app', 'display'];
    
    // default baseview options
    var baseViewDefaults = {
        tooltips: true
      , popovers: true
    };
    
    // extend Backbone.View
    var BaseView = Backbone.View.extend({
        
        name        : 'BaseView' // view name, to be overwritten
      , template    : '' // view template, to be overwritten
      , hints       : {} // view hints hash, to be overwritten
        
        /**
         * constructor -- extended from Backbone.View to add:
         *   - reference to central router/special display model,
         *   - template handling,
         *   - .startListening() trigger
         */
      , constructor: function(options){
            options = _.defaults(options||{}, baseViewDefaults);
            
            // pick options to be attached directly to the view
            _.extend(this, _.pick(options, baseViewOptions));
            
            // BaseView requires a reference to the central Backbone.Router
            if (! (this.app instanceof Backbone.Router)) throw new Error(this.name + ' missing Backbone.Router (app)');
            
            // call original constructor
            BackboneView.call(this, options);
            
            // start listening to other objects
            this.startListening();
            
            // initialize view template manager
            var tpl = this.tpl = new ViewTemplateMgr({
                view: this
              , template: this.template
            });
            
            // attach listner for template render events
            this.listenTo(tpl, 'render', this._updateTargets);
            
            // initialize ajax requests manager
            var ajax = this.ajax = new ViewAjaxMgr();
            
            // initialize view hints manager
            var hints = this.hints = new ViewHintsMgr({
                view: this
              , hints: this.hints
            });
            
        }
        
        // update view targets ($t)
      , _updateTargets: function(){
            var $targets = {};
            
            // note: ensure the original selector is kept!
           for (var target in (this.$t||{})) {
                var sel = this.$t[target].selector; 
                $targets[target] = this.$(sel); 
                $targets[target].selector = sel;
            };
            
            // set new hash of targets
            this.$t = $targets;
        }
        
        // listenTo events from "listen" hash
      , startListening: function(events) {
            if (!(events || (events = _.result(this, 'listen')))) return;
            this.stopListening();
            
            for (var key in events) {
                var method = events[key]
                  , hash = key.split(' ')
                  , target = hash.length == 1 ? this : this[hash.pop()]
                  , eventName = hash.join(' ');
                  
                for (var i in (_.isArray(method) ? method : (method = [method]))) {
                    var m = _.isFunction(method[i]) ? method[i] : this[method[i]]; 
                    if (! m) throw new Error('Invalid method: "'+method[i]+'" for event: "'+eventName+'"');
                    this.listenTo(target,eventName,m); 
                }
            }
        }
        
        // extends delegateEvents to include view targets ($t)
      , delegateEvents: function(events) {
            if (!(events || (events = _.result(this, 'events')))) return;
            
            var $targets = this.$t
              , targetEvents = {};
            
            // re-map events hash
            _.each(events, function(event,eventHash){
                var hash = eventHash.split(' ')
                  , target = hash.pop();
                  
                // if a valid target was specified..
                if (hash.length > 0 && $targets[target]) {
                
                    // replace eventHash with the target's selector
                    eventHash = eventHash.replace(target, $targets[target].selector);//.replace(/:\S+/g,''));
                }
                
                // update new targeted events
                targetEvents[eventHash] = event;
            });
            
            // call original delegateEvents
            return BackboneView.prototype.delegateEvents.call(this, targetEvents);
        }
        
        /**
         * extended remove -- cleans up after the view is no longer needed
         */
      , remove: function(){
            
            // stop all ajax requests
            this.ajax.stop(); 
            
            // trigger "remove" event
            this.trigger("remove", this);
            
            // call original view.remove()
            return Backbone.View.prototype.remove.apply(this, arguments);
        }
        
        /**
         * render -- default rendering workflow
         */
      , render: function(){
      
            // render the main template to default $el
            this.tpl.render(this.$el, 'main');
            
            // trigger "render" event
            this.trigger("render", this);
            
            // return this instance
            return this;
        }
        
        // helper to determine if $el is in DOM
      , inDOM: function($el){
            return ($el || this.$el).closest('html').length > 0; 
        }
        
    });
    
    /**
     * Global Router Helper function
     * 
     * Handler helps to set reference to main router, for all BaseView instances.
     * 
     */
    BaseView.setApp = function(app){
        BaseView.prototype.app = app;
    };
    
    /**
     * Handler Helper function
     * 
     * Handler helps to segregate sections of minor functionality within a view. It is entirely 
     * optional and was solely implemented for code readability purposes. 
     * 
     * This utility functions exactly like .extend(), but merges three main properties: 
     * target elements ("$t"), mapped backbone events ("listen"), and mapped dom events ("events").
     * 
     * All other properties will be extended, as normal. 
     * 
     */
    BaseView.addHandler = function(ext){
        var proto = this.prototype;
        
        // merge listen property, merging by keys
        var listen = proto.listen || {};
        for (var e in ext.listen || {}) {
            listen[e] = listen[e] ? _.union([], ext.listen[e], listen[e]) : ext.listen[e];
        }
        
        // merge events property, merging by keys
        var events = proto.events || {};
        for (var e in ext.events || {}) {
            events[e] = events[e] ? _.union([], ext.events[e], events[e]) : ext.events[e];
        }
        
        // merge $t property, overwriting keys
        var $t = _.extend({}, ext.$t, proto.$t);
        
        // update the ext properties
        var prop = _.extend({}, ext, {
            $t: $t
          , listen: listen
          , events: events
        });
        
        // and extend the view
        return this.extend(prop);
    };
    
    
    return BaseView;
});