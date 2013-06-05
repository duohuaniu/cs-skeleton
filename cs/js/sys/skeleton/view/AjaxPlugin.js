define([
    './../View'
  , 'underscore'
  , 'jquery'
],function(
    View
  , _
  , $
){
    
    // tracks ajax requests for easy cleanup
    var ViewAjaxPlugin = View.Plugin.extend({
        
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
        
        // manually make a direct ajax requset
      , request: function(settings){
            var xhr = $.ajax(settings);
            this.track(xhr);
            return xhr;
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
