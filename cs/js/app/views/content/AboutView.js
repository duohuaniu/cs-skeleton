/**
 * AboutView
 * Harry Truong (harry.truong@redcross.org)
 *
 *
 */
define([
    'skeleton'
  , 'text!./AboutView.tpl'
  , 'text!./AboutView.hint'
],function(
    Skeleton
  , Template
  , Hints
){
    
    var AboutView = Skeleton.View.extend({
        
        options: { 
            template : Template 
          , hints : Hints
        }
        
      , initialize: function(){
            
            // register relevant routes
            this.router.route('about','about');
        }
        
      , render: function(){
            
            // render main view template
            this.use.tpl.render(this.$el, 'main');
            
            // trigger "render" event
            this.trigger("render", this);
            return this;
        }
        
    });
    
    
    // Region Display Handler
    AboutView.extendHandler({
    
        $targets: {}
        
      , listen: {
            'route:about router' : function(){ this.trigger('show', this); }
        }
      
      , events: {}
        
    });
    
    // handler for view's hints plugin
    AboutView.extendHandler({
    
        listen: {
            'render'    :['_renderTooltips'
                        , '_renderPopovers']
        }
        
      , _renderTooltips: function(){
            
            // enable view tooltip hints
            this.use.hints.tooltips(true);
        }
        
      , _renderPopovers: function(){
            
            // enable view popover hints
            this.once('open', function(){
                this.use.hints.popoverToggle({
                    $el: this.$('.hero-unit button') 
                  , enabled: true
                  , event: 'click.popoverToggle'
                  , toggleClass: 'btn-danger'
                });
            });
        }
    });
    
    
    // Handler Template
    AboutView.extendHandler({
    
        $targets: {}
        
      , listen: {}
        
      , events: {}
      
    });
    
    
    return AboutView;
});