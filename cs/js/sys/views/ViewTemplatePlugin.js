define([
    'sys/ViewPlugin'
  , 'underscore'
  , 'jquery'
],function(
    ViewPlugin
  , _
  , $
){
    
    // simple template management library
    var ViewTemplatePlugin = ViewPlugin.extend({
    
        // plugin init
        initialize: function(){
            var template = (this.view.options || {}).template;
            
            // store reference to parsed templates
            if (template) this.templates = this._parseTemplate(template);
        }
    
        // takes a raw .tpl collection and keys them by id
      , _parseTemplate: function(template){
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
    
    // and that's it!
    return ViewTemplatePlugin;
});