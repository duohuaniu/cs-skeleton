define([
    "underscore"
  , "jquery"
],function(
    _
  , $
){
    
    // modal stacking z-index minimum
    var minZIndex = 1000;
    
    // browser window.height minimum
    var minWindowHeight = 600;
    
    // tracks each modal window for stacking and browser resizing
    var ModalMgr = function(){
        
        // enforce singleton!
        if (arguments.callee._singletonInstance) return arguments.callee._singletonInstance;
        arguments.callee._singletonInstance = this;
        
        // initialize modal collection
        this.modals = [];
        
        // set current window height
        this.windowHeight = $(window).height();
        
        // attach window listening event
        $(window).bind('resize.modalmgr', _.bind(this._resizeAll, this));
    };
    
    _.extend(ModalMgr.prototype, {
        
        // start tracking a $modal
        track: function($modal){
            
            // ensure $modal is valid object
            if (! ($modal instanceof $ && $modal.data('modal'))) throw new Error('ModalMgr can only track $modal elements');
            
            // attach active event listener for stacking
            $modal.on('focusin mousedown', _.bind(this._active, this, $modal));
            
            // run initial resize for current browser viewport
            this._resize($modal);
            
            // store $modal for future stacking/browser resizing events
            // note: store dom elements, not jquery objects!
            this.modals.push($modal[0]); 
            
            // add cleanup handler
            $modal.on('hidden', _.bind(function(){
                this.modals = _.without(this.modals, $modal[0]);
            },this));
        }
        
        // helper to set $modal as active
      , _active: function($modal){
            
            // make top/last modal look "active", and trigger event
            if ($modal.hasClass('muted') || _.indexOf(this.modals,$modal[0]) == -1) {
               $modal.removeClass('muted').trigger("active");
            }
            
            // move modal to end of list
            this.modals = _.without(this.modals, $modal[0]);
            this.modals.push($modal[0]); 
            
            // re-adjust layers
            var z = minZIndex; // minimum z-index
            
            // set appropriate z-indexes
            _.each(this.modals, function(modal){
                var $modal = $(modal);
                
                // high z-index if backdrop
                if ($modal.hasClass('modal-static')) {
                    $modal.css('z-index', '9050'); 
                }
                
                // otherwise set appropriate z-index
                else { 
                    $modal.css('z-index', z); 
                    z = z+5; // increment z-index for each modal
                }
            });
            
            // make all other modals look "inactive" and trigger event
            _.each(_.initial(this.modals),function(modal){
                var $modal = $(modal); if (! $modal.hasClass('muted')) $modal.addClass('muted').trigger("inactive");
            }); 
        }
        
        // start resizing all modals
        // note: debounce because of window's habit of going crazy
      , _resizeAll: _.debounce(function(ev){
            if (ev.target !== window) return;
            
            // update current windowHeight
            this.windowHeight = $(window).height();
            
            // apply resize to each modal
            _.each(this.modals, _.bind(this._resize, this));
        },500)
        
        // resize modal when window height is too small (_.debounced delay)
      , _resize: function(modal){
            
            // target the .modal-body, and its height
            var $modal = $(modal)
              , wh = this.windowHeight - minWindowHeight
              , $boxbody = $modal.find('.modal-body')
              , mbh = $boxbody.data('orig-height') || parseInt($boxbody.css('max-height') || $boxbody.css('height'));
            
            // if wh is negative, scale $modal
            // (store original height, set new max-height, and overflow-y auto)
            if (wh < 0) $boxbody.data('orig-height', mbh).css({'max-height': mbh + wh, 'overflow-y': 'auto'});
            
            // otherwise, revert $modal
            else $boxbody.css('max-height', $boxbody.data('orig-height'));
            
            // trigger a resize event
            $modal.trigger("resize");
        }
    });
    
    return ModalMgr;
});