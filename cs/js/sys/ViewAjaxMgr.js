define([
    'underscore'
  , 'jquery'
],function(
    _
  , $
){
    
    // tracks ajax requests for each view
    var AjaxMgr = function(){ 
        this.ajax = []; 
    };
    
    _.extend(AjaxMgr.prototype, {
    
        // start tracking xhr object
        track: function(xhr){
            
            // is this an abortable ("xhr-like") object?
            if (_.isFunction(xhr.abort)) this.ajax.push(xhr);
            
            // else throw error
            else throw new Error('AjaxMgr cannot track invalid xhr object');
        }
        
        // make and track new ajax request
      , request: function(settings){
            this.track($.ajax(settings));
        }
        
        // stop all tracked xhr objects
      , stop: function(){
            _.invoke(this.ajax, 'abort');
        }
    });
    
    return AjaxMgr;
});