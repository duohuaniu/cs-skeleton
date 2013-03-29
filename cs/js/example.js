/**
 * ExampleView - Backbone View
 * Harry Truong (harry.truong@redcross.org)
 *
 * See 
 *
 */
define([
    'backbone'
  , 'sys/BaseView'
  , 'text!app/templates/ExampleView.tpl'
  // , 'text!app/templates/ExampleView.tip'
  // , 'text!app/templates/ExampleView.pop'
],function(
    Backbone
  , BaseView
  , ViewTemplate
  // , ViewTooltips
  // , ViewPopovers
){
    
    /**
     * ExampleView
     *
     */
    var ExampleView = BaseView.extend({
        
        name: 'ExampleView'
      , template: ViewTemplate
        
        // (nothing to initialize)
      , initialize: function(){}
        
      , render: function(){
            this.renderElement();
            return this._rendered();
        }
        
      , renderElement: function(){
            
            // if we're not in the DOM yet.. 
            if (! this.inDOM()) {
            
                // create root element, append into <body />
                var $el = $('<div class="'+ this.name +'"></div>').appendTo('body');
                this.setElement($el); // and update view element
            }
            
            // render main view template
            this.renderTemplate(this.$el, 'main');
        }
    });
    
    var example = new ExampleView({app:new Backbone.Router()});
    
    var Example = function(){};
    Example.prototype.start = function(){example.render()};
    return Example;
});