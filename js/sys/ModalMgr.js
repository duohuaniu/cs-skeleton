define([
    "underscore"
  , "jqueryui"
],function(
    _
  , $
){

    // disable bootstrap's auto- $().modal()
    $('body').off('.modal.data-api');
    
    // ModalMgr Constructor
    var ModalMgr = function(){
        
        // enforce singleton!
        if (arguments.callee._singletonInstance) return arguments.callee._singletonInstance;
        arguments.callee._singletonInstance = this;
        
        // z-index minimum
        this._z = 3000;
        
        // window.height minimum
        this._wh = 600;
        
        // current window height : minimum difference
        this.wh = $(window).height() - this._wh;
        
        // list of DOM "windows"
        this._boxes = [];
        
        // attach window listening event
        this.listen();
    };
    
    // ModalMgr definition
    _.extend(ModalMgr.prototype, {
        
        // attach/detach event listeners
        listen: function(toggle){ 
            (! _.isBoolean(toggle) || toggle) ?
                $(window).bind('resize.wm',_.bind(this._resize,this)) : 
                $(window).unbind('resize.wm'); 
            return this; 
        }
        
        // cleans out all boxes
      , reset: function(){ 
            this._boxes = []; 
            return this; 
        }
        
        // resize popovers when window height is too small (_.debounced delay)
      , _resize: _.debounce(function(ev){
            if (ev.target !== window) return;
            
            // what's the window height vs minimum?
            this.wh = $(window).height() - this._wh;
            
            // loop through each current box
            _.each(this._boxes,_.bind(this._resizeBox,this))
        },500)
        
      , _resizeBox: function(box){
            
            // target the .modal-body, and its height
            var $box = $(box)
              , wh = this.wh
              , $boxbody = $box.find('.modal-body')
              , mbh = $boxbody.data('orig-height') || parseInt($boxbody.css('max-height') || $boxbody.css('height'));
            
            // if wh is negative, scale $box
            // (store original height, set new max-height, and overflow-y auto)
            if (wh < 0) $boxbody.data('orig-height', mbh).css({'max-height': mbh + wh, 'overflow-y': 'auto'});
            
            // otherwise, revert $box
            else $boxbody.css('max-height', $boxbody.data('orig-height'));
            
            // trigger a resize event
            $box.trigger("resize");
        }
        
      , _active: function(box){
            var $box = $(box);
            
            // make top/last box look "active", and trigger event
            if ($box.hasClass('muted') || _.indexOf(this._boxes,$box[0]) == -1) {
               $box.removeClass('muted').trigger("active");
            }
            
            // move box to end of list
            this._boxes = _.without(this._boxes, $box[0]);
            this._boxes.push($box[0]); 
            
            // re-adjust layers
            var z = this._z; // minimum z-index
            
            // set appropriate z-indexes
            _.each(this._boxes, function(box){
                var $box = $(box);
                
                // high z-index if backdrop
                if ($box.hasClass('modal-static')) {
                    $box.css('z-index', '9050'); 
                }
                
                // otherwise set appropriate z-index
                else { 
                    $box.css('z-index', z); 
                    z = z+5; // increment z-index for each box
                }
            });
            
            
            // make all other boxes look "inactive" and trigger event
            _.each(_.initial(this._boxes),function(box){
                var $box = $(box); if (! $box.hasClass('muted')) $box.addClass('muted').trigger("inactive");
            });
        }
        
      , add: function($box){
            
            // we must have a valid jQuery object!
            if (! ($box instanceof jQuery) || 
                
                // and must be in actual DOM
                $box.closest('body').length == 0) return;
            
            // make sure $box is focusing on ".modal" node
            if (! $box.hasClass('modal')) {
                $box = $box.find('.modal:first');
                if ($box.length == 0) return;
            }
            
            // the $box!
            $box 
                // "active" event listeners
                .on({"focusin mousedown": _.bind(this._active, this, $box)}) 
                
                // "resize" event listener
                .on({"click":_.bind(this._minimize, this, $box, 'toggle')},"span.modal-minimize")
                
                // "email" (todo)
                // .on({"click":function(){ 
                // }},"span.modal-email")
                
                // centers box, without having to declare the 'margin-left'
                .css('margin-left', parseInt($box.css('width'))/-2)
                
                // add basic bootstrap modal effect
                .modal({
                    backdrop: $box.hasClass('modal-static') ? 'static' : false,
                    keyboard: false,
                    show: true
                })
                
                // add css adjustments
                .css({
                    'position':'fixed',
                    'left': ($box.offset().left) + 'px',
                    'margin-left':'0px'
                })
                
                // add jquery draggable effect
                .draggable({ 
                    containment: 'window', 
                    scroll: false, 
                    handle: '.modal-header, .modal-footer' 
                });
            
            // modify DOM so modal-body can be made static
            var $body = $box.find('.modal-body'),
                $static = $('<div />');
            
            // fix css based on $body's padding
            $static.css(_.reduce(["top","bottom","left","right"], function(p,c){
                p['padding-'+c] = $body.css('padding-'+c); return p;
            }, {}));
            
            // format and wrap inner $body elements
            $body.css('padding','0px').prepend('<div class="white-static" />').wrapInner($static);
            
            // make this $box active
            // this._active($box); 
            // NOT NECESSARY! .modal() triggers focus event
            
            // adjust for viewport height
            this._resizeBox($box);
            
            return $box; // give it back
        }
        
      , _minimize: function($box, flag){
            if (! _.isBoolean(flag) && flag != 'toggle') return $box.hasClass('minimized');
            var flag = flag == 'toggle' ? !$box.hasClass('minimized') : flag;
            
            return $box.toggleClass('minimized', flag); // give it back
        }
        
      , _static: function($box, flag){
            if (! _.isBoolean(flag) && flag != 'toggle') return $box.hasClass('static');
            var flag = flag == 'toggle' ? !$box.hasClass('static') : flag;
            
            $box.toggleClass('static', flag)
                .find(flag ? '.modal-footer button' : '.modal-footer button.static-disabled:disabled')
                .toggleClass('disabled static-disabled', flag)
                .attr('disabled', flag);
            
            var ws = $box.find('.white-static')
              , mb = $box.find('.modal-body');
              
            /* MSIE 7 "disappearing labels" fix */
            ws.parent().css('position', flag ? 'relative' : 'static');
            
            if (flag) ws.height(ws.height() < parseInt(mb.css('max-height')) ? mb.css('max-height') : '100%');
            
            flag ? $box.on("hide",false) : $box.off("hide",false);
            
            return $box; // give it back
        }
        
      , remove: function(box){
            var $box = $(box);
            if ($box.is(':visible')) $box.modal('hide');
            this._boxes = _.without(this._boxes, $box[0]);
            
            return $box;  // give it back
        }
    });
    
    return ModalMgr;
    
});