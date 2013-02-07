define([
    'backbone'
  , 'ModalMgr'
  , 'bootstrap'
  , 'jqueryui'
],function(
    Backbone
  , ModalMgr
){
    
    // "global" context (i.e., "window")
    var root = this;
    
    // original BackboneView
    var BackboneView = Backbone.View;
    
    // singleton window manager object
    var modalManager = new ModalMgr();
    
    // extend Backbone.View
    var BaseView = Backbone.View.extend({
    
        /**
         * disable* - directly enable/disable rendering functionality
         */
        disableTooltips     : false
      , disablePopovers     : false
      , disableModal        : false
        
        /**
         * constructor -- extended to add :
         *   - shared globals (via root.app.globals),
         *   - mock dependency injection (via "_dep" prop),
         *   - ajax tracking (via "_ajax" prop and .ajax* methods),
         *   - special display control model (via "display" prop), and
         *   - .startListening() trigger
         */
      , constructor: function(opts){
            var options = opts || {};
            
            // set global properties based on root.app.globals
            if (root.app && root.app.globals) _.extend(this, root.app.globals);
            
            // make dependency injections, if provided
            this._dep = _.extend({}, this._dep, options._dep);
            
            // make a new container to hold xhr objects
            this._ajax = []; 
            
            // set special 'display' model, if given
            if (options && options.display) this.display = options.display;
            
            // call original constructor
            BackboneView.apply(this,arguments);
            
            // start listening to other objects
            this.startListening();
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
            
            // handle for any $modals
            this.modal('remove');
            
            // final cleanup of DOM items
            this.$el.empty().remove();
            
            // stop all ajax requests
            this.ajaxStop(); 
            
            // stop listening for events
            this.stopListening();
            
            // trigger "dispose" event
            this.trigger("dispose", this);
            
            // return myself
            return this;
        }
      
        /**
         * render -- default rendering workflow
         */
      , render: function(){
            this.renderTemplate(this);
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
            $el = $el ? ($el instanceof $ ? $el : $($el)) : this.$el; 
            return $el.closest('html').length > 0; 
        }
    
        // hijacking ensure element
      , _ensureElement: function(){
            
            // apply original _ensureElement()
            BackboneView.prototype._ensureElement.apply(this, arguments);
            
            // call _refreshTargets()
            this._refreshTargets();
        }
            
        // refresh targets by iterating over each selector
      , _refreshTargets: function(){
            this.$t = _.reduce(this.$t || [],_.bind(function(m,e,k){
                var a = e.selector; m[k] = this.$(a); m[k].selector = a; return m;
            },this), {});
        }
        
        // looks for "listen" hash of events to bind on model/col
        // (i.e., think like "delegateEvents", but for the *model/col* not DOM)
      , startListening: function(events) {
            if (!(events || (events = _.result(this, 'listen')))) return;
            
            for (var key in events) {
                var method = events[key]
                  , hash = key.split(' ')
                  , target = hash.length == 1 ? this : hash.pop()
                  , eventName = hash.join(' ');
                
                for (var i in (_.isArray(method) ? method : (method = [method]))) {
                    if (target = this[target]) this.listenTo(target,eventName,method[i]); 
                }
            }
        }
        
        // extends delegateEvents to look for "view target elements" ($t)
      , delegateEvents: function(events) {
            if (!(events || (events = _.result(this, 'events')))) return;
            
            // view target elements
            var targets = this.$t;
            
            // re-map events hash
            events = _.reduce(events,function(m,v,k){
                var hash = k.split(' ')
                  , t = hash.pop();
                
                // if a valid target was specified..
                if (hash.length > 0 && targets[t]) {
                    
                    // replace the event's target selector
                    k.replace(t, this.$t[target].selector.replace(/:\S+/g,''));
                }
                
                m[k] = v;
                return m;
            },{});
            
            // replace first argument
            var args = arguments;
            args[0] = events;
            
            // call original delegateEvents
            return BackboneView.prototype.delegateEvents.apply(this, args);
        }
        
        // template rendering helper
      , renderTemplate: function(Element, Template, TemplateData, Options) {
            if (Element instanceof jQuery && Element.is('script')) {
                var Element = Element.html();
            }
            
            var $el // target element
              , tpl // template string
              , data = {} // template data
              , opts = {}// rendering options
            
            // default usage: $el is this.$el
            if (typeof Element == "string") {
                $el = this.$el;
                tpl = Element;
                data = _.extend(data,Template);
                opts = _.extend(opts,TemplateData);
            } 
            
            // helper usage: $el is provided, in addition to a template
            else if (Element instanceof jQuery && typeof Template == "string") {
                $el = Element;
                tpl = Template;
                data = _.extend(data,TemplateData);
                opts = _.extend(opts,Options);
            }
            
            // check for invalid template or element
            if (! $el || $el.length == 0 || ! tpl) throw new Error("Failed to renderTemplate()!");
            
            // extend template data with all properties of this view
            var template_data = _.extend({}, data, _.omit(this,_.functions(this)));
            
            // reset this view, apply the main template with full data, 
            $el.empty().html(_.template(tpl)(template_data));
            
            // refresh targets
            this._refreshTargets();
            
            // at this point, we should definitely be listening for backbone events
            this.startListening();
                
            // trigger renderTemplate event
            this.trigger("renderTemplate", $el, tpl, data, opts);
            
            // for completeness
            return this;
        }
        
        // tooltips rendering helper
      , renderTooltips: function(tooltips){
            if (this.disableTooltips) return;
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
            if (this.disablePopovers) return;
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
        
        // modal rendering helper
      , renderModal: function(){
            if (this.disableModal) return;
            
            // is this a modal? if so, render it
            var $modal = this.$el.children('div.modal:first'); 
            if ($modal.length > 0) this.modal('add', $modal)
        }
        
        // helper to handle manipulating the $modal
      , modal: function(action, flag){
            var $modal = this.$modal;
            
            // are we newly adding this modal?
            if (action == 'add' && flag instanceof $) {
                this.$modal = modalManager.add(flag);
                return this.$modal;
            }
      
            // the rest of the actions require this.$modal to be set
            if ($modal) {
                
                // no action? here's the $modal
                if (! action) return this.$modal;
                
                // otherwise, since we're doing an action, focus!
                $modal.focus();
                
                switch (action){
                    case 'remove': // removes the modal entirely
                        if ($modal.is(':visible')) {
                            modalManager._static($modal, false);
                            this.$modal.modal('hide');
                        }
                        delete this.$modal;
                        return modalManager.remove($modal);
                
                    case 'minimize':  // hides the body
                        return modalManager._minimize($modal, flag);
                        
                    case 'static': // adds white static overlay into body
                        return modalManager._static($modal, flag);
                        
                    default: // pass through to native modal plugin
                        return $modal.modal(action);
                }
            }
        }
    
        // stores all xhr references, or makes requests
      , ajax: function(xhr){
            if (! xhr) return;
            
            // was this already an (abortable) "xhr-like" object?
            if (_.isFunction(xhr.abort)) {
            
                // directly save reference
                this._ajax.push(xhr);
                
            } else {

                // make and save reference
                xhr = Backbone.ajax(xhr);
                
                // extra check for abort-able-ness
                if (_.isFunction(xhr.abort)) this._ajax.push(xhr);
            }
            
            // notifying we're making an ajax call
            this.trigger("ajax", xhr);
            
            return xhr;
        }
        
        // helper for last xhr call
      , ajaxLast: function(){
            return _.last(this._ajax);
        }
        
        // helper to end all ajax calls
      , ajaxStop: function(){
            _.invoke(this._ajax,'abort');
        }
    
    });
    
    return BaseView;
});