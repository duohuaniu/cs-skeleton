define([
    'BaseView'
  , 'sys/ModalMgr'
  , 'bootstrap'
  , 'jqueryui'
],function(
    BaseView
  , ModalMgr
){
    
    // disable bootstrap's auto- $().modal()
    $('body').off('.modal.data-api');
    
    // modal manager instance (shared for all ModalViews)
    var modalMgr = new ModalMgr();
    
    // extend BaseView
    var ModalView = BaseView.extend({
        
        name        : 'ModalView' // modal name, to be overwritten
        
      , constructor: function(options){
            
            // call BaseView constructor
            BaseView.call(this, _.defaults(options || {}, {modal: true}));
        }
        
        // render modal plugin
      , renderModal: function($el){
            
            // 0. check for options flag
            if (! this.options.modal) return;
            
            // 1. locate $modal
            var $modal = ($el || this.$el).find('.modal:first');
            if ($modal.length == 0) throw new Error('Unable to locate modal for renderModal');
            this.$modal = $modal;
            
            // 2. re-centers modal, without 'margin-left' css trick
            $modal.css({
                'margin-left'   : (parseInt($modal.css('width'))/-2)
            }).css({
                'position'      : 'fixed'
              , 'left'          : ($modal.offset().left) + 'px'
              , 'margin-left'   : '0px'
            });
               
            // 3. add basic bootstrap modal plugin
            $modal.modal({
                backdrop: $modal.hasClass('modal-static') ? 'static' : false,
                keyboard: false,
                show: true
            });
            
            // 4. add jquery draggable effect
            $modal.draggable({ 
                containment: 'window', 
                scroll: false, 
                handle: '.modal-header, .modal-footer' 
            });
            
            // 5. modify DOM so modal-body can be made static
            var $body = $modal.find('.modal-body'),
                $static = $('<div />');
                
                // 5a. fix css based on $body's padding
                $static.css(_.reduce(["top","bottom","left","right"], function(p,c){
                    p['padding-'+c] = $body.css('padding-'+c); return p;
                }, {}));
                
                // 5b. format and wrap inner $body elements
                $body.css('padding','0px').prepend('<div class="white-static" />').wrapInner($static);
            
            // 6. ensure modal manager is tracking
            modalMgr.track($modal);
        }
        
        // extend delegateEvents to include modalEvents
      , delegateEvents: function(events){
            var modalEvents = _.extend({}, (events || _.result(this, 'events')), _.result(this, 'modalEvents'));
            return BaseView.prototype.delegateEvents.call(this, modalEvents);
        }
        
        // handles modal actions
      , modal: function(action, flag){
            var $modal = this.$modal;
            if (! $modal) return;
            
            switch (action){
            
                // collapse modal body and footer
                case 'minimize': 
                    var toggle = _.isBoolean(flag) ? flag : ! $modal.hasClass('minimized');
                    $modal.toggleClass('minimized', toggle).find('.modal-body, .modal-footer').toggle(! toggle);
                    
                    // trigger view modal:event
                    this.trigger('modal:minimize', this, toggle);
                    break;
                
                // prevent user from interacting with modal
                case 'static':
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
                    this.trigger('modal:static', this, toggle);
                    break;
            }
        }
        
        // special modal-related events
      , modalEvents: {
            'show .modal'                   : '_eventModalShow'
          , 'shown .modal'                  : '_eventModalShown'
          , 'click .modal-minimize'         : '_eventModalClickMin'
          , 'active .modal'                 : '_eventModalActive'
          , 'inactive .modal'               : '_eventModalInactive'
          , 'resize .modal'                 : '_eventModalResize'
          , 'hide .modal'                   : '_eventModalHide'
          , 'hidden .modal'                 : '_eventModalHidden'
        }
        
      , _eventModalShow: function(){}
      , _eventModalShown: function(){}
      , _eventModalClickMin: function(){ this.modal('minimize'); }
      , _eventModalActive: function(){ this.trigger('modal:active', this); }
      , _eventModalInactive: function(){ this.trigger('modal:inactive', this); }
      , _eventModalResize: function(){}
      , _eventModalHide: function(){}
      , _eventModalHidden: function(){ this.dispose(); }
        
    });
    
    return ModalView;
});