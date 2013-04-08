define([
    'backbone'
  , 'underscore'
  , 'jquery'
],function(
    Backbone
  , _
  , $
){
    
    // simple template management library
    var ViewTemplateMgr = function(view){
        var options = view.options || {}
          , template = options.template;
        
        // expects view to be a Backbone.View
        if (! (view instanceof Backbone.View)) throw new Error('ViewTemplateMgr missing Backbone.View (view)');
        
        // store reference to view
        this.view = view;
        
        // store reference to parsed templates
        this.templates = this._parseTemplate(template);
    };
    
    // extend prototype definition (incl. Backbone.Events)
    _.extend(ViewTemplateMgr.prototype, Backbone.Events, {
        
        // takes a raw .tpl collection and keys them by id
        _parseTemplate: function(template){
            var templates = {};
            $(template).each(function(i,t){
                templates[t.id || _.keys(templates).length] = $(t).html();
            });
            return templates;
        }
        
        // renders template for specified element
      , render: function($el, tpl, data) {
      
            // select template
            var template = this.templates[tpl];
      
            // throw error if template is missing
            if (! template) throw new Error('Template "' + tpl + '" for view "' + view.name + '" not found.');
      
            // extend data to include view properties
            var data = _.extend({}, this.view, data||{});
            
            // reset this $el, apply the template w/ data
            $el.empty().html(_.template(template)(data));
            
            // trigger a "render" event
            this.trigger("render", $el, tpl, this);
        }
    });
    
    // allow extensions (stolen directly from backbone's extend handler)
    // see http://backbonejs.org/docs/backbone.html#section-189
    ViewTemplateMgr.extend = Backbone.Model.extend;
    
    return ViewTemplateMgr;
});