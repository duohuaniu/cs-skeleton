define([
    'sys/skeleton'
  , 'underscore'
  , 'jquery'
],function(
    Skeleton
  , _
  , $
){
    
    // swaps between various subviews by calling remove() 
    // when another view emits a "render" event 
    var ViewSwapPlugin = Skeleton.View.Plugin.extend({
        
        // simple utility function
        views: function(Views, $container){ 
            var parentView = this.view;
            
            // ensure all views use the same container node
            if ($container) _.invoke(Views, 'setDOM', $container);
            
            // create new event dispatcher
            var dispatcher = new Skeleton.Dispatcher();
            
            // create array of new view instances
            var views = _.map(Views, function(View){ return new View(); });
            
            // relevant dispatcher events map
            var events = {
                
                // update listener on remove event
                'remove' : function(view){
                    
                    // stop listening to this view
                    dispatcher.stopListening(view);
                    
                    // determine which view this was
                    var View = _.find(Views,function(View){return view instanceof View;});

                    // create a new view instance
                    // note: these subviews must render() themselves
                    newView = new View(); 

                    // apply dispatcher events map
                    dispatcher.listenTo(newView, events);
                    
                    // update views array
                    views = _.without(views, view);
                    views.push(newView);
                 }
                
                 // remove other subviews on render event
               , 'render' : function(view){
                    
                    // select other views
                    _.chain(views).without(view)
                                    
                    // determine which are rendered
                    .filter(function(v){ return v.inDOM(); })
                    
                    // and remove them              
                    .invoke('remove');
                 }
            };

            // apply events map
            _.each(views, function(v){ 
                dispatcher.listenTo(v, events); 
            });
            
            // and clean up, when parent view is remove()'d
            dispatcher.listenTo(parentView, 'remove', function(){
                _.invoke(views, 'remove');
                this.stopListening();
            });
        }
        
    });
    
    // and that's it!
    return ViewSwapPlugin;
});
