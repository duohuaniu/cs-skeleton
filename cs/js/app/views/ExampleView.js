/**
 * ExampleView - Backbone View
 * Harry Truong (harry.truong@redcross.org)
 *
 *
 */
define([
    'sys/BaseView'
  , 'text!app/templates/ExampleView.tpl'
  , 'text!app/templates/ExampleView.hint'
],function(
    BaseView
  , ViewTemplate
  , ViewHints
){
    
    /**
     * ExampleView
     *
     */
    var ExampleView = BaseView.extend({
        
        name: 'ExampleView'
      , options: {            
            template: ViewTemplate
          , hints: ViewHints
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
                var $el = $('<div class="'+ this.name +'"></div>').appendTo('body');
                this.setElement($el); // and update view element
            }
            
            // render main view template
            this.use.tpl.render(this.$el, 'main');
            
            // enable view tooltip hints
            this.use.hints.tooltips(true).popoverToggle({
                $el: this.$('.hero-unit button') 
              , enabled: true
              , event: 'click.popoverToggle'
              , toggleClass: 'btn-danger'
            });
        }
    });
    
    return ExampleView;
});