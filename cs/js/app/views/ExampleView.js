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
     * router plugin mapping
     */
    var ViewRoutes = {
        ''                  : '_nothing'
      , 'foo'               : '_foo'
      , 'splat(/*path)'     : '_splat'
      , 'parts(/date/:val)' : '_parts'
    };
    
    /**
     * ExampleView
     *
     */
    var ExampleView = BaseView.extend({
        
        name: 'ExampleView'
      , options: {            
            template        : ViewTemplate
          , hints           : ViewHints
          , routes          : ViewRoutes
          , routerEvent     : 'route:home app'
        }
        
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
    
    return ExampleView;
});