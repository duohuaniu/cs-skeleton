define([
    'backbone'
  , 'sys/TemplateMgr'
  , 'sys/AjaxMgr'
  , 'bootstrap'
  , 'jquery'
],function(
    Backbone
  , TemplateMgr
  , AjaxMgr
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
        
        /**
         * constructor -- extended from Backbone.View to add:
         *   - reference to central router/special display model,
         *   - template handling,
         *   - .startListening() trigger
         */
      , constructor: function(options){
            options = _.defaults(options, baseViewDefaults);
            
            // pick options to be attached directly to the view
            _.extend(this, _.pick(options || {}, baseViewOptions));
            
            // BaseView requires a reference to the central Backbone.Router
            if (! (this.app instanceof Backbone.Router)) throw new Error(this.name + ' missing Backbone.Router (app)');
            
            // call original constructor
            BackboneView.call(this, options);
            
            // initialize the view template manager and ajax requests manager
            this.tpl = new TemplateMgr(this.template);
            this.ajax = new AjaxMgr();
            
            // start listening to other objects
            this.startListening();
        }
        
        // update view targets ($t)
      , _updateTargets: function(){
            var $targets = {};
            
            // note: ensure the original selector is kept!
           for (var target in this.$t) {
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
        
        // template rendering helper
      , renderTemplate: function($el, template, data){
            
            // extend data to include view properties
            var data = _.extend({}, data || {}, this);
            
            // invoke the template manager
            this.tpl.render($el, template, data);
            
            // update view targets ($t)
            this._updateTargets();
        }
        
        // tooltips rendering helper
      , renderTooltips: function(tooltips){
            if (! this.options.tooltips) return;
            var tooltips = JSON.parse(tooltips || '[]');
            
            var $el = this.$el;
            for (var i in tooltips){
                var tooltip = tooltips[i]
                  , target = tooltip.target;
                
                $el.filter(target).add($el.find(target))
                   .tooltip(_.extend({
                        animation: false
                      , delay: { show: 0, hide: 0 }
                    },tooltip));
            }
        }
        
        // popovers rendering helper
      , renderPopovers: function(popovers, $toggle){
            if (! this.options.popovers) return;
            var popovers = JSON.parse(popovers || '[]')
              , enabled = $toggle.hasClass('enabled');
            
            var $el = this.$el;
            for (var i in popovers){
                var popover = popovers[i]
                  , target = popover.target;
                
                // note: we cheaply append the "close" icon to the popovers
                popover.title = popover.title + "<span class='close' data-dismiss='popover'>&times;</span>";
                
                popovers[i] = $el.filter(target).add($el.find(target)).first()
                    .popover(_.extend({
                        trigger: 'manual'
                      , animation: false
                    },popover))
                    .popover(enabled ? 'show' : 'hide');
            }
            
            // ensure $toggle is ready asToggle
            $toggle.off('click.asToggle').on('click.asToggle',function(){
                $(this).toggleClass('enabled').trigger('togglePopovers');
            });
            
            // attach togglePopover event listner
            var event = 'togglePopovers.'+this._cid;
            $toggle.off(event).on(event, function(){
                _.invoke(popovers,'popover', $(this).hasClass('enabled') ? 'show' : 'hide');
            });
            
            // final cleanup of event listener
            this.on('dispose', function(){$toggle.off(event)});
        }
    
        /**
         * dispose -- cleans up after the view is no longer needed
         */
      , dispose: function(){
            
            // we expect any extended views to overwrite this
            // ...
            
            // any extended views should always make this call at the end
            return this._disposed();
        }
        
        // background cleanup helper
      , _disposed: function(){
            
            // stop all ajax requests
            this.ajax.stop(); 
            
            // final cleanup of DOM items
            this.$el.empty().remove();
            
            // trigger "dispose" event
            this.trigger("dispose", this);
            
            // stop listening for events
            this.stopListening();
            
            // return myself
            return this;
        }
        
        /**
         * render -- default rendering workflow
         */
      , render: function(){
            this.renderTemplate(this.$el, 'main');
            return this._rendered();
        }
      
        // background rendering helper
      , _rendered: function(){
            
            // set $el's '_view' reference
            this.$el.data('_view',this);
            
            // trigger "render" event
            this.trigger("render",this);
            
            // return this instance
            return this;
        }
        
        // helper to determine if $el is in DOM
      , inDOM: function($el){
            return ($el || this.$el).closest('html').length > 0; 
        }
        
    });
    
    return BaseView;
});