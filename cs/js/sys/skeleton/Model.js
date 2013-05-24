define([
    'backbone'
  , 'underscore'
], 
function(
    Backbone
  , _
){
    // temp
    var defaultPlugins = {};
    
    /**
     * Model Plugin
     * Container for various additional model functionality.
     */
    var ModelPlugin = function(model){
    
        // expects model to be a Model object (as defined below)
        if (! (model instanceof Model)) throw new Error('Plugin missing Model instance (model)');
        
        this.model = model; // save the model reference
        this.initialize(); // call initialize
    }
    
    // extended to add in Backbone.Events, and no-op initialize
    _.extend(ModelPlugin.prototype, Backbone.Events, { initialize: function(){} });
    ModelPlugin.extend = Backbone.Model.extend; // and copy Backbone.extend() for good measure
    
    /**
     * Model 
     * Backbone.Model extended to add:
     *      - basic plugin functionality, 
     *      - label helper method
     *      - "check" validation mapping
     */
    var mustachejsRegx = /\{\{(.+?)\}\}/g;
    var Model = Backbone.Model.extend({
        
        use: defaultPlugins || {} // mapping of plugins
      
      , checks: [] // convenience mappings for validation checks
      
      , constructor: function() {
            
            // initialize plugins
            this._init_plugins();
             
            // call original constructor
            Backbone.Model.apply(this, arguments);
        }
        
      , _init_plugins: function(){
            var plugins = _.result(this, 'use') || {};
            
            for (var name in plugins) {
                var P = plugins[name];
                
                // check it's a valid plugin
                if (P instanceof ModelPlugin) plugins[name] = new P(this);
            }
            
            this.use = plugins; // save plugins to "use" property
        }
        
        // generates label based on attributes (basically a proxy to _.template)
        // see http://underscorejs.org/#template
      , label: function(tpl, s){
            var s = s || {interpolate : mustachejsRegx};
            return _.template(tpl, this.toJSON(), s);
        }
        
        // implemented to validate against "check" functions
      , validate: function(attributes, options){
            var errors = _.chain(this.checks || [])
                          .map(function(fn){return fn(attributes,options);})
                          .without(undefined).value();
            
            if (! _.isEmpty(errors)) return errors;
        }
    },{
    
        /**
         * Validation Logic Helper
         * Appends additional callbacks for checking valid state.
         */
        check: function(fn){
            var checks = this.prototype.checks || []; checks.push(fn);
            this.prototype.check = checks;
        }
        
    });
    
    // and that's it! 
    return Model;
});
