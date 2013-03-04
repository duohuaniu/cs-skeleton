define([
    'underscore'
  , 'jquery'
],function(
    _
  , $
){
    
    // simple template management library
    var TemplateMgr = function(template){
        var templates = {};
        
        // takes a raw .tpl collection and keys them by id
        $(template).each(function(i,t){
            if (t.type == 'text/html' && t.id) templates[t.id] = $(t).html();
        });
        
        // store templates
        this.templates = templates;
    };
    
    _.extend(TemplateMgr.prototype, {
        
        // renders template for specified element
        render: function(el, tpl, data) {
            var template = this.templates[tpl];
            
            // throw error if template is missing
            if (! template) throw new Error('Template for "' + tpl + '" not found.');
            
            // reset this $el, apply the template w/ data
            $(el).empty().html(_.template(template)(data || {}));
        }
    });
    
    return TemplateMgr;
});