define([
    'backbone'
  , 'underscore'
  , 'jquery'
],function(
    Backbone
  , _ 
  , $
){

    /**
     * Region
     */
    var Region = function(options){
        this._configure(options || {});
        this.initialize.apply(this, arguments);
    };
    
    var regionOptions = ['el'];
    _.extend(Region.prototype, Backbone.Events, {
       
        _configure: function(options) {
            if (this.options) options = _.extend({}, _.result(this, 'options'), options);
            _.extend(this, _.pick(options, regionOptions));
            this.options = options;
        }

      , initialize: function(){} // no-op
      
    });

    // and that's it!
    return Region;
});
