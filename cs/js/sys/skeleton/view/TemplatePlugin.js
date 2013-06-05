define([
    './../View'
  , 'underscore'
  , 'jquery'
],function(
    View
  , _
  , $
){
    
    // simple template management library
    var ViewTemplatePlugin = View.Plugin.extend({
    
        // plugin init
        initialize: function(){
            
            // add any templates
            this.addTemplate((this.view.options || {}).template);
        }
    
        // takes a raw .tpl collection and keys them by id
      , _parseTemplate: function(template){
            var templates = {};
            $(template||'').each(function(i,t){
                templates[t.id || _.keys(templates).length] = $(t).html();
            });
            return templates;
        }
        
        // loads additional templates
      , addTemplate: function(template){
            var templates = this._parseTemplate(template);
            this.templates = _.extend({}, this.templates || {}, templates);
        }
        
        // renders template for specified element
      , render: function($el, tpl, data) {
            var templates = this.templates || {}
              , view = this.view;
            
            // select template
            var template = templates[tpl];
      
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
    
    // and that's it!
    return ViewTemplatePlugin;
});