define([
    // './RouterPlugin'
    './TemplatePlugin'
  , './AjaxPlugin'
  // , './HintsPlugin'
  , './PlaceholderPlugin'
  // , './ModalPlugin'
],function(
    // RouterPlugin
    TemplatePlugin
  , AjaxPlugin
  , PlaceholderPlugin
  // , HintsPlugin
  // , ModalPlugin
){
    
    // simple mapping of default plugins
    return {
        tpl: TemplatePlugin
      , ajax: AjaxPlugin
      , placeholder: PlaceholderPlugin
      // , hints: HintsPlugin
      // , modal: ModalPlugin
    };
});