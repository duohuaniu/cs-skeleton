define([
    'backbone'
  , 'underscore'
  , 'jquery'
],function(
    Backbone
  , _
  , $
){
    
    // tracks ajax requests for easy cleanup
    var AjaxCleanupMgr = function(view){ 
    
        // initialize requests collection
        this.ajax = []; 
        
        // cleanup all requests when view is remove()'d
        this.listenTo(view, 'remove', this.cleanup);
    };
    
    _.extend(AjaxCleanupMgr.prototype, Backbone.Events, {
        
        // start listening for a request event to be emitted
        listen: function(target, event){
            var event = event || "request";
            
            // attach standard backbone event listenr
            this.listenTo(target, event, function(t,xhr){
            
                // is this an abortable ("xhr-like") object?
                if (_.isFunction(xhr.abort)) this.ajax.push(xhr);
                
                // else throw error
                else throw new Error('AjaxMgr cannot track invalid xhr object');  
            });
        }
        
        // cleans up all tracked xhr objects
      , cleanup: function(){
            
            _.invoke(this.ajax, 'abort');
        }
    });
    
    return AjaxCleanupMgr;
});