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
    
    
    // Render Handler
    HeaderView.extendHandler({
    
        $targets: {
            // 'header'    : '.header'
          // , 'content'   : '.content'
        }
        
      , listen: {
            // 'render'    :['_renderHeaderView'
                        // , '_renderContentRegion']
        }
        
      , events: {}
        
      // , _renderHeaderView: function(){
            // (new HeaderView({el: this.$t('header')})).render();
        // }
        
      // , _renderContentRegion: function(){
            // this.use.region.create({
                // el: this.$t('content')
              // , views: [new HomeView(), new AboutView()]
            // });
        // }
        
    });
    
    
    // Navigation Handler
    HeaderView.extendHandler({
    
        $targets: {
            'navigation' : 'ul.nav'
        }
        
      , listen: {
            // 'render' : '_renderNavigation'
          // , 'route app' : '_renderNavigation'
        }
        
      , events: {}
        
      , _renderNavigation: function(){
            this.use.tpl.render(this.$t('navigation'), 'navigation', {path: this.app.fragment()});
        }
        
    });
    
    
    return HeaderView;
});