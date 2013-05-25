/**
 * HomeView
 * Harry Truong (harry.truong@redcross.org)
 *
 *
 */
define([
    'skeleton'
  , 'text!./HomeView.tpl'
  , 'text!./HomeView.hint'
],function(
    Skeleton
  , Template
  , Hints
){
    
    var HomeView = Skeleton.View.extend({
        
        options: { 
            template : Template 
          , hints : Hints
        }
        
      , initialize: function(){
            
            // register relevant routes
            this.router.route('home','home');
        }
        
      , render: function(){
            
            // render main view template
            this.use.tpl.render(this.$el, 'main');
            
            // trigger "render" event
            this.trigger("render", this);
            return this;
        }
        
      // , remove: function(){ ... }
        
    });
    
    
    // Region Display Handler
    HomeView.extendHandler({
    
        $targets: {}
        
      , listen: {
            'route:home router' : function(){ this.trigger('show', this); }
        }
      
      , events: {}
        
    });
    
    // handler for view's hints plugin
    HomeView.extendHandler({
    
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
    
    // handler for 
    HomeView.extendHandler({
    
        listen: {
            'route:foo router' : '_foo'
        }
        
      , _nothing: function(){
            console.log('called nothing');
        }
      , _foo: function(){
            console.log('called foo');
        }
      , _splat: function(){
            console.log('called splat');
            console.log(arguments);
        }
      , _parts: function(){
            console.log('called parts');
            console.log(arguments);
        }
        
    });
    
    return HomeView;
});