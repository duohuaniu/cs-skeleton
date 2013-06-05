/**
 * HomeView
 * Harry Truong (harry.truong@redcross.org)
 *
 *
 */
define([
    'skeleton'
  , 'text!./HomeView.tpl'
],function(
    Skeleton
  , Template
){
    
    var HomeView = Skeleton.View.extend({
        
        options: { template : Template }
        
      , initialize: function(){
            
            // register relevant routes
            this.router.route('','home');
            this.router.route('home','home');
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
    HomeView.extendHandler({
    
        $targets: {}
        
      , listen: {
            'route:home router' : function(){ this.trigger('show', this); }
        }
      
      , events: {}
        
    });
    
    
    // Handler Template
    HomeView.extendHandler({
    
        $targets: {}
        
      , listen: {}
        
      , events: {}
      
    });
    
    
    return HomeView;
});