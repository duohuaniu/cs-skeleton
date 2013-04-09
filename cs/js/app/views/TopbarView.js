/**
 * TopbarView - Backbone View
 * Harry Truong (harry.truong@redcross.org)
 *
 *
 */
define([
    'sys/BaseView'
  , 'text!app/templates/TopbarView.tpl'
],function(
    BaseView
  , ViewTemplate
){
    
    /**
     * TopbarView
     * 
     * 
     */
    var TopbarView = BaseView.extend({
        
        name: 'TopbarView'
      , options: {
            template: ViewTemplate
        }
        
        // (nothing to initialize)
      , initialize: function(){}
        
      , render: function(){
      
            // render main view $el
            this.renderElement();
            
            // trigger "render" event
            this.trigger("render", this);
            
            // return this instance
            return this;
        }
        
      , renderElement: function(){
            
            // if we're not in the DOM yet.. 
            if (! this.inDOM()) {
            
                // create root element, append into <body />
                var $el = $('<div class="'+ this.name +'"></div>').prependTo('body');
                this.setElement($el); // and update view element
            }
            
            // render main view template
            this.use.tpl.render(this.$el, 'main');
        }
        
    });
    
    /**
     * Navigation Handler
     */
    TopbarView.extendHandler({
    
        $targets: {
            'navigation' : 'ul.nav'
        }
        
      , listen: {
            // 'render' : '_renderNavigation'
          // , 'route app' : '_renderNavigation'
        }
        
      , _renderNavigation: function(){
            this.use.tpl.render(this.$t('navigation'), 'navigation', {path: this.app.fragment()});
        }
    });
    
    
    return TopbarView;
});