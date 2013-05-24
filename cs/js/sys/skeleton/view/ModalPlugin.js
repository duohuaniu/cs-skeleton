define([
    './../View'
  // , 'sys/ModalMgr'
  , 'bootstrap'
  , 'jqueryui'
],function(
    View
  // , ModalMgr
  , $
){

    // disable bootstrap's auto- $().modal()
    $('body').off('.modal.data-api');
    
    // modal manager instance (singleton, shared for all Modals)
    // var modalMgr = new ModalMgr();
    
    // enables modal-type UI
    var ViewModalPlugin = View.Plugin.extend({
        
        // init plugin (nothing to do)
        initialize: function(){} 
        
        // render modal plugin
      , render: function($modal){
            
            // store refernce to $modal 
            this.$modal = $modal
            
            // enable modal effects
            this._modalEffects();
            
            // ensure modal manager is tracking
            // modalMgr.track($modal);
            
            // add special events handler
            this._modalEvents();
        }
        
      , _modalEffects: function(){
            var $modal = this.$modal;
            
            // re-centers modal, without 'margin-left' css trick
            $modal.css({
                'margin-left'   : (parseInt($modal.css('width'))/-2)
            }).css({
                'position'      : 'fixed'
              , 'left'          : ($modal.offset().left) + 'px'
              , 'margin-left'   : '0px'
            });
               
            // add basic bootstrap modal plugin
            $modal.modal({
                backdrop: $modal.hasClass('modal-static') ? 'static' : false,
                keyboard: false,
                show: true
            });
            
            // add jquery draggable effect
            $modal.draggable({ 
                containment: 'window', 
                scroll: false, 
                handle: '.modal-header, .modal-footer' 
            });
            
            // ensure $modal can be made "static"
            var $body = $modal.find('.modal-body'),
                $static = $('<div />');
                
                // 5a. fix css based on $body's padding
                $static.css(_.reduce(["top","bottom","left","right"], function(p,c){
                    p['padding-'+c] = $body.css('padding-'+c); return p;
                }, {}));
                
                // 5b. format and wrap inner $body elements
                $body.css('padding','0px').prepend('<div class="white-static" />').wrapInner($static);
        }
        
      , _modalEvents: function(){
            var modalPlugin = this, $modal = this.$modal;
            
            // setup DOM event listners
            $modal.on('hidden',function(){modalPlugin.view.remove();});
            $modal.on('click','.modal-minimize',null,function(){modalPlugin.minimize();});
            $modal.on('active',function(){ console.log('active');modalPlugin.trigger('active', this); });
            $modal.on('inactive',function(){ modalPlugin.trigger('inactive', this); });
        }
        
        // modal minimize action (collapse modal body and footer)
      , minimize: function(flag){
            var $modal = this.$modal;
            if (! $modal) return;
            
            var toggle = _.isBoolean(flag) ? flag : ! $modal.hasClass('minimized');
            $modal.toggleClass('minimized', toggle).find('.modal-body, .modal-footer').toggle(! toggle);
            
            // trigger view modal:event
            this.trigger('minimize', this, toggle);
        }
        
        // modal static action (prevent user from interacting with modal)
      , static: function(flag){
            var $modal = this.$modal;
            if (! $modal) return;
            
            var toggle = _.isBoolean(flag) ? flag : ! $modal.hasClass('static');
                
            $modal.toggleClass('static', toggle)
                .find(toggle ? '.modal-footer button' : '.modal-footer button.static-disabled:disabled')
                .toggleClass('disabled static-disabled', toggle)
                .attr('disabled', toggle);
            
            // adjust static overlay css
            var ws = $modal.find('.white-static')
              , mb = $modal.find('.modal-body');
              
            // (MSIE 7 "disappearing labels" fix)
            ws.parent().css('position', toggle ? 'relative' : 'static');
            
            if (toggle) {
                ws.height(ws.height() < parseInt(mb.css('max-height')) ? mb.css('max-height') : '100%');
                $modal.on("hide",false);
            } else { 
                $modal.off("hide",false); 
            }
            
            // trigger view modal:event
            this.trigger('static', this, toggle);
        }
    });
    
    // and that's it!
    return ViewModalPlugin;
});
