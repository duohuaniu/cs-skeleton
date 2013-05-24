define([
    './../View'
  , 'jquery'
],function(
    View
  , $
){
    
    // mock "placeholder" styling
    var ViewPlaceholderPlugin = View.Plugin.extend({
        
        style: function(el, text, color){
            var plugin = this
              , $el = $(el);
            
            // only works on <input /> or <textarea /> elemetns
            if ($el.is('input') || $el.is('textarea') && 
                
                // and if it's currently blank
                $el.val() == '') {
                
                // capture current color
                var curColor = $el.css('color');
                
                // insert text and set placeholder color
                $el.val(text).css('color', color || '#99999')
                
                // attach a one time cleanup event
                .one('focus', function(){
                    
                    // clean up text and styling
                    $el.val('').css('color', curColor)
                    
                    // and re-apply the placeholder styling
                    // if the user didn't do anything
                    .one('focusout', function(){
                        if ($el.val() == '') plugin.style($el, text, color);
                    });
                });
            }
        }
        
    });
    
    // and that's it!
    return ViewPlaceholderPlugin;
});
