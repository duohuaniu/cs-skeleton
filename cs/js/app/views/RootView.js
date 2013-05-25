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
  // , './content/ContactView'
],function(
    Skeleton
  , Template
  , HeaderView
  , HomeView
  , AboutView
  // , ContactView
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
        
      // , remove: function(){ ... }
        
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
    
    
    // and that's it.
    return RootView;
});