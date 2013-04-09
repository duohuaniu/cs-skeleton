define([
    'sys/ViewPlugin'
  , 'underscore'
  , 'jquery'
],function(
    ViewPlugin
  , _
  , $
){
    
    // tracks ajax requests for easy cleanup
    var ViewAjaxPlugin = ViewPlugin.extend({
        
        // init plugin
        initialize: function(){ 
    
            // initialize requests collection
            this.ajax = []; 
            
            // cleanup all requests when view is remove()'d
            this.listenTo(this.view, 'remove', this.cleanup);
        }
        
        // start listening for a request event to be emitted
      , listen: function(target, event){
            var event = event || "request";
            
            // attach standard backbone event listenr
            this.listenTo(target, event, function(t,xhr){
                
                // track xhr object
                this.track(xhr);
            });
        }
        
        // adds xhr object into collection
      , track: function(xhr){
      
            // is this an abortable ("xhr-like") object?
            if (_.isFunction(xhr.abort)) this.ajax.push(xhr);
            
            // else throw error
            else throw new Error('AjaxMgr cannot track invalid xhr object');  
        }
        
        // cleans up all tracked xhr objects
      , cleanup: function(){
            
            _.invoke(this.ajax, 'abort');
            this.stopListening();
        }
    });
    
    // and that's it!
    return ViewAjaxPlugin;
});