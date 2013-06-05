/**
 * HeaderView - Backbone View
 * Harry Truong (harry.truong@redcross.org)
 *
 *
 */
define([
    'skeleton'
  , 'text!./HeaderView.tpl'
],function(
    Skeleton
  , Template
){
    
    var HeaderView = Skeleton.View.extend({
        
        options: { template: Template }
        
      , initialize: function(){}
        
      , render: function(){
            
            // render main view template
            this.use.tpl.render(this.$el, 'main');
            
            // trigger "render" event
            this.trigger("render", this);
            return this;
        }
        
    });
    
    
    // Navigation Handler
    HeaderView.extendHandler({
    
        $targets: {
            'navigation' : 'ul.nav'
        }
        
      , listen: {
            'route router' : '_renderNavigation'
        }
        
      , events: {}
        
      , _renderNavigation: function(path){
            if (! path) return;
            this.use.tpl.render(this.$t('navigation'), 'navigation', {path: path});
        }
        
    });
    
    
    // Handler Template
    HeaderView.extendHandler({
    
        $targets: {}
        
      , listen: {}
        
      , events: {}
      
    });
    
    
    return HeaderView;
});