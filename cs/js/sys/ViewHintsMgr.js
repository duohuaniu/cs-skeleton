define([
    'backbone'
  , 'underscore'
  , 'jquery'
],function(
    Backbone
  , _
  , $
){
    
    // simple tooltip/popover management library
    var ViewHintsMgr = function(options){
        var options = options || {}
          , view = options.view
          , hints = options.hints;
        
        
        // expects view to be a Backbone.View
        if (! (view instanceof Backbone.View)) throw new Error('ViewHintsMgr missing Backbone.View (view)');
        
        // store reference to view
        this.view = view;
        
        // parse hints template
        var hints;
        try { hints = JSON.parse(hints||'{}'); }
        catch (e) { hints = {}; }
        
        // store references to parsed hints
        this._tooltips = hints.tooltips || [];
        this._popovers = hints.popovers || [];
        
        // attach clean up for tooltips
        this.listenTo(view, 'remove', function(){
            this.tooltips('disable');
        });
        
        // attach clean up for popovers
        this.listenTo(view, 'remove', function(){
            this.popovers('disable');
        });
    };
    
    // extend prototype definition (incl. Backbone.Events)
    _.extend(ViewHintsMgr.prototype, Backbone.Events, {
        
        // "enable" or "disable" tooltips
        // see http://twitter.github.com/bootstrap/javascript.html#tooltips
        tooltips: function(enable){
            var tooltips = this._tooltips
              , view = this.view;
            
            if (enable) {
            
                // enable each tooltip
                for (var i in tooltips){
                    view.$(tooltips[i].target).tooltip(_.extend({
                        animation: false
                      , delay: { show: 0, hide: 0 }
                    },tooltips[i]));
                }
                
                // trigger "tooltips:enabled" event
                this.trigger("tooltips:enabled", this);
            } 
            
            else {
            
                // destroy each tooltip
                for (var i in tooltips){
                    view.$(tooltips[i].target).tooltip('destroy');
                }
                
                // trigger "tooltips:disabled" event
                this.trigger("tooltips:disabled", this);
            }
            
            return this; // for chaining
        }
        
        // "enable" or "disable" popovers
        // see http://twitter.github.com/bootstrap/javascript.html#popovers
      , popovers: function(enable){
            var popovers = this._popovers
              , view = this.view;
            
            if (enable){
                
                // enable each popover
                for (var i in popovers){
                    var popover = _.clone(popovers[i])
                      , $target = view.$(popover.target);
                    
                    // skip over unmatched $targets
                    if ($target.length == 0) continue;
                    
                    // note: we cheaply append the "close" icon to the popovers
                    popover.title = popover.title + "<span class='close' data-dismiss='popover'>&times;</span>";
                    
                    $target.popover(_.extend({
                        trigger: 'manual'
                      , animation: false
                      , html: true
                    },popover)).popover('show');
                    
                    // enable dismiss on "close" icon click
                    $target.data('popover').$tip.find('[data-dismiss="popover"]').click(function(){
                        $target.popover('destroy');
                    });
                }
                
                // trigger "popovers:enabled" event
                this.trigger("popovers:enabled", this);    
            } 
            
            else {
                
                // disable each popover
                for (var i in popovers){
                    view.$(popovers[i].target).popover('destroy');
                }
                
                // trigger "popovers:disabled" event
                this.trigger("popovers:disabled", this);
            }
            
            return this; // for chaining
        }
        
        // designate a special $el to control popovers
      , popoverToggle: function(options){
            var options = options || {}
              , $el = options.$el
              , enabled = !!options.enabled
              , event = options.event || 'click.popoverToggle'
              , toggleClass = options.toggleClass || 'popoversEnabled';
            
            // pre-set current toggle mode
            $el.toggleClass(toggleClass, enabled);
            
            // match popovers with current state
            this.popovers(enabled);
            
            // attach a click event listener
            var hints = this;
            $el.on(event,function(){
                $el.toggleClass(toggleClass);
                hints.popovers($el.hasClass(toggleClass));
            });
            
            return this; // for chaining
        }
        
    });
    
    return ViewHintsMgr;
});