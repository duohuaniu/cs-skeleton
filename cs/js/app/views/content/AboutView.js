/**
 * AboutView
 * Harry Truong (harry.truong@redcross.org)
 *
 *
 */
define([
    'skeleton'
  , 'text!./AboutView.tpl'
],function(
    Skeleton
  , Template
){
    
    var AboutView = Skeleton.View.extend({
        
        options: { template : Template }
        
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
    
    
    return AboutView;
});