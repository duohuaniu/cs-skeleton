/**
 * ExampleView - Backbone View
 * Harry Truong (harry.truong@redcross.org)
 *
 *
 */
define([
    'skeleton'
  , 'text!./ExampleView.tpl'
  , 'text!./ExampleView.hint'
],function(
    Skeleton
  , ViewTemplate
  , ViewHints
){
    
    /**
     * ExampleView
     *
     */
    var ExampleView = Skeleton.View.extend({
        
        className: 'ExampleView'
      , options: {            
            template        : ViewTemplate
          // , hints           : ViewHints
        }
        
      , initialize: function(){
            
            // register relevant routes
            this.router.route('foo','foo');
        }
        
      , listen: {
            'route:foo router' : 'render'
        }
        
      , render: function(){
            
            // if we're not in the DOM yet, append into <body />
            if (! this.inDOM()) this.$el.appendTo('body');
            
            // render main view template
            this.use.tpl.render(this.$el, 'main');
            
            // trigger "render" event
            this.trigger("render", this);
            
            // return this instance
            return this;
        }
    });
    
    // handler for view's hints plugin
    ExampleView.extendHandler({
        listen: {
            'render' : '_renderHints'
        }
        
      , _renderHints: function(){
            
            // enable view tooltip hints
            // this.use.hints.tooltips(true).popoverToggle({
                // $el: this.$('.hero-unit button') 
              // , enabled: true
              // , event: 'click.popoverToggle'
              // , toggleClass: 'btn-danger'
            // });
        }
    });
    
    // handler for 
    ExampleView.extendHandler({
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
    
    return ExampleView;
});