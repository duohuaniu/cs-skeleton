/**
 * RootView
 * Harry Truong (harry.truong@redcross.org)
 *
 *
 */
define([
    'skeleton'
  , 'text!./RootView.tpl'
  , './HeaderView'
  , './content/HomeView'
  , './content/AboutView'
],function(
    Skeleton
  , Template
  , HeaderView
  , HomeView
  , AboutView
){
    
    var RootView = Skeleton.View.extend({
        
        options: { template: Template }
        
      , initialize: function(){}
        
      , render: function(){
      
            // render main view template
            this.use.tpl.render(this.$el, 'main');
            
            // trigger render event
            this.trigger("render", this);
            return this;
        }
        
    });
    
    
    // Render Handler
    RootView.extendHandler({
        
        $targets: {
            'header'    : '.header'
          , 'content'   : '.content'
        }
        
      , listen: {
            'render'    :['_renderHeaderView'
                        , '_renderContentRegion']
        }
        
      , events: {}
        
      , _renderHeaderView: function(){
            (new HeaderView({el: this.$t('header')})).render();
        }
        
      , _renderContentRegion: function(){
            this.use.region.create({
                el: this.$t('content')
              , views: [new HomeView(), new AboutView()]
            });
        }
        
    });
    
    
    // Handler Template
    RootView.extendHandler({
    
        $targets: {}
        
      , listen: {}
        
      , events: {}
      
    });
    
    
    // and that's it.
    return RootView;
});