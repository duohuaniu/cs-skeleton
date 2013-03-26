define([
    'backbone'
  , 'bbValidation'
], 
function(
    Backbone
  , bbValidation
){
    return Backbone.Model.extend(bbValidation.mixin);
});