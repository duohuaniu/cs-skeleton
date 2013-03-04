define([
    'backbone'
  , 'moment'
], 
function(
    Backbone
  , moment
){
    
    // save original Backbone.Model prototype
    var BackboneModel = Backbone.Model;
    
    // IMO: Backbone should really implement these..
    var BaseModel = Backbone.Model.extend({
        
        // extend constructor to call isValid() before initialize
        constructor: function(attributes, options) {
        
            // CHANGE: set user property based on reference to window.app.user
            if (_.isObject(window.app)) {
                this.user = window.app.user;
                this.app = window.app;
            }
            
            // mostly copied straight from backbone-0.9.9
            var defaults;
            var attrs = _.isObject(attributes) ? attributes : {}; // CHANGE: attributes must be an object map
            var opts = options || {};
            this.cid = _.uniqueId('c');
            this.changed = {};
            this.attributes = {};
            this._changes = [];
            if (opts.collection) this.collection = opts.collection;
            if (opts.parse) attrs = this.parse(attrs);
            if (defaults = _.result(this, 'defaults')) _.defaults(attrs, defaults);
            this._defaults = defaults; // CHANGE: cache result of this.defaults
            // CHANGE: add an extra validate check
            if (this.verify && !opts.error) {
                opts.error = function(model, errors){ 
                    throw new Error('Model bootstrap invalid: '+JSON.stringify(errors)); 
                };
            }
            this.set(attrs, _.extend({silent: true},opts)); // CHANGE: pass through options to set()
            this._currentAttributes = _.clone(this.attributes);
            this._previousAttributes = _.clone(this.attributes);
            this.initialize.apply(this, arguments);
            
            this.on('sync', function(){ this._sync_timestamp = new moment(); });
            this.on('request', function(model, xhr){ this._request = xhr });
        }
        
      , synchronized: function(){
            var ts = this._sync_timestamp;
            return ts ? moment(ts) : false
        }
        
        // default option flag to enforce validity on bootstrap
      , verify: false
        
        // default option flag to enforce whitelisting
      , whitelist: false
        
        // generates label based on attributes
      , label: function(syntax){
            var get = _.bind(this.get,this);
            return syntax.replace(new RegExp('{{(.+?)}}','g'),function(m, p1){ return get(p1); });
        }
        
        // toJSON should look deep into attributes
      , toJSON: function(error, refs){
            
            // should we throw error on recursion?
            error || (error = false);
            
            // container for circular refs
            refs = refs || {}; 
            
            // main reduce callback
            var reduceFunc = function(m,v,k){
            
                // check if array
                if (_.isArray(v) && v.length) {
                    
                    // reduce recursively
                    m[k] = _.reduce(v,reduceFunc,[]);
                }
                
                // check if object
                else if (_.isObject(v)) {
                    
                    // check if .toJSON() is defined
                    if (_.isFunction(v.toJSON)) {
                        var index = _.indexOf(_.values(refs),v);
                        
                        // throw error and break any recursion
                        if (index >= 0) {
                            if (error) throw new Error('Warning: Recursion detected!');
                            else m[k] = '__recursion:'+_.keys(refs)[index]+'__';
                        } else {
                            
                            // store a reference
                            refs[k] = v; 
                            
                            // reduce recursively
                            m[k] = v.toJSON(error, _.clone(refs)); 
                        }
                    } 
                    
                    // check if .valueOf() is defined
                    else if (Object.prototype.valueOf !== v.valueOf 
                        && _.isFunction(v.valueOf)) {
                    
                        // use that value
                        m[k] = v.valueOf();
                    }
                    
                    // check if .toString() is defined
                    else if (_.isFunction(v.toString)) {
                    
                        // use that string value
                        m[k] = v.toString();
                    }
                    
                    // otherwise, proceed as possible
                    else {
                    
                        // reduce recursively
                        m[k] = _.reduce(v,reduceFunc,{});
                    }
                } 
                
                // otherwise, just keep the value
                else m[k] = v; 
                
                // pass on the memo.
                return m;
            }
            
            return _.reduce(this.attributes,reduceFunc,{});
        }
        
        // clear() should have consideration for defaults
      , clear: function(options){
            var defaults = this._defaults;
            if (defaults) {
                BackboneModel.prototype.clear.call(this,_.extend({},options,{silent:true}));
                return this.set(defaults,options);
            } else {
                return BackboneModel.prototype.clear.call(this,options);
            }
        }
        
        // set should include instify
      , set: function(key, val, options){
            
            // v0.9.10 removed default validate:true
            options = _.defaults(options||{},{validate:true});
            
            var attrs;
            if (key == null) return this;

            // Handle both `"key", value` and `{key: value}` -style arguments.
            if (_.isObject(key)) {
                attrs = key;
                options = val;
            } else {
                (attrs = {})[key] = val;
            }
            
            // enforcing attribute instances
            attrs = this._tamper(attrs, options);
            
            // and back to the original set
            return BackboneModel.prototype.set.call(this,attrs,options);
        }
        
      , _tamper: function(attrMap, options){
            
            // are instances even set?
            if (this.instances) {
               
                // go through each attr, with instance set
                var instances = this.instances
                  , mapInstances = _.pick.apply(_,[attrMap].concat(_.keys(instances)));
                  
                // and inflate if not proper instance
                _.each(mapInstances,function(a,k,l){
                    if (! (a instanceof instances[k])) {
                        if (a instanceof Backbone.Model || a instanceof Backbone.Collection)
                            l[k] = new instances[k](a, options); // backbone obj
                        else 
                            l[k] = new instances[k](a); // momentjs
                    }
                });
                
                // merge together
                attrMap = _.extend({},attrMap,mapInstances);
            }
            
            // do we have to do any tampering?
            for (var k in attrMap) {
                
                // check functions
                if (_.isFunction(this['_tamper_'+k])) {
                    attrMap[k] = this['_tamper_'+k](attrMap);
                }
            }
            
            // finished
            return attrMap;
        }
        
        // unset() should consider defaults
      , unset: function(attr, options){
            var defaults = this._defaults;
            
            // does a default exist? set it
            if (_.isObject(defaults) && _.has(defaults,attr)) 
                this.set(attr, defaults[attr], options);
            
            // otherwise, call native unset
            else BackboneModel.prototype.unset.call(this,attr,options);
        }
        
        // make get recursive based on "/"
      , get: function(attr, actual){
            if (attr == null) return void 0;
            
            var path = attr.split('/')
              , step = path.shift()
                        
                // is a special _get_ATTR available?
              , item = (_.isFunction(this['_get_'+step]) && ! actual) ? 
                        this['_get_'+step]() : BackboneModel.prototype.get.call(this,step);
            
            // shallow get?
            if (! /\//.test(attr)) return item;
            
            // otherwise, reduce and call recursively
            // else return _.reduce(attr.split('/'), function(m,a){
                // return ! m ? m : _.isFunction(m.get) ? m.get.call(m,a) : undefined;
            // },this);
            
            // otherwise, call and keep moving
            else return (item && _.isFunction(item.get)) ? item.get(path.join('/')) : item;
        }
        
        // make clone recursive
      , clone: function(deep){
            
            // are we looking to make a shallow clone?
            if (! deep) return BackboneModel.prototype.clone.apply(this,arguments);
            
            // continue to call clone as necessary
            return new this.constructor(_.reduce(this.attributes,function(m,a,k){
            
                // call only if .clone is function
                m[k] = (_.isObject(a) && _.isFunction(a.clone)) ? a.clone(deep) : a; return m;
            },{}));
        }
        
        // auto-validate against whitelist and "_valid_ATTR" functions
      , validate: function(attrs, options){
            
            // temp working attrs
            var wattrs = _.extend({}, this._tamper(attrs,options))
              , whitelisting = this.whitelist
              , defaults = this._defaults;
            
            var errors = {};
            for (var k in wattrs){
                
                // check whitelist
                if (whitelisting && ! _.has(defaults,k)) {
                    errors[k] = "not found in whitelist.";
                }
            
                // check valid
                else if (_.isFunction(this['_valid_'+k])) {
                    var err = this['_valid_'+k](wattrs);
                    if (err) errors[k] = err;
                }
            }
            
            if (! _.isEmpty(errors)) return errors;
        }
       
      , state: function(){
            return this._request || false;
        }
        
    });
    
    return BaseModel;
});