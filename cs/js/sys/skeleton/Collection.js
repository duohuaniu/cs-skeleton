define([
    'backbone'
  , './Model'
  , 'underscore'
], 
function(
    Backbone
  , Model
  , _
){
    
    // extend Backbone.Collection
    var Collection = Backbone.Collection.extend({
                
        // update default model to Skeleton Model
        model: Model
      
        // model for tracking meta props
      , metaModel: Model
        
      , constructor: function() {
            
            // initialize new meta instance
            this.meta = new (this.metaModel)();
            
            // call orginal constructor
            return Backbone.Collection.apply(this, arguments);
        }
        
      , fetch: function(options){
            var opts = options||{};
            
            // always include meta as data during fetch
            opts.data = _.extend(opts.data || {}, this.meta.toJSON());
            
            // call original fetch
            return Backbone.Collection.prototype.fetch.call(this, opts);
        }

    }); 
    
    // and that's it!
    return Collection;
});
