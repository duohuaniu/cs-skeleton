define([
    // './RouterPlugin'
    './TemplatePlugin'
  , './AjaxPlugin'
  , './RegionPlugin'
  , './HintsPlugin'
  , './PlaceholderPlugin'
  // , './ModalPlugin'
],function(
    // RouterPlugin
    TemplatePlugin
  , AjaxPlugin
  , RegionPlugin
  , HintsPlugin
  , PlaceholderPlugin
  // , ModalPlugin
){
    
    // simple mapping of default plugins
    return {
        tpl: TemplatePlugin
      , ajax: AjaxPlugin
      , region: RegionPlugin
      , placeholder: PlaceholderPlugin
      , hints: HintsPlugin
      // , modal: ModalPlugin
    };
});