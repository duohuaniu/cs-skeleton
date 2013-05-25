/**
 * Basic Extensions for Backbone Classes
 * Harry Truong (harry.truong@redcross.org)
 *
 *
 */
define([
    './skeleton/Router'
  , './skeleton/View'
  , './skeleton/view/Plugins'
  , './skeleton/Model'
  , './skeleton/Collection'
  , './skeleton/Dispatcher'
],function(
    Router
  , View
  , ViewPlugins
  , Model
  , Collection
  , Dispatcher
){
    
    // "global" scope reference (window)
    var root = this;
    var noConflict = root.Skeleton;

    // our top level namespace
    var Skeleton = root.Skeleton = {};
    
    // standard noConflict
    Skeleton.noConflict = function(){
        root.Skeleton = noConflict;
        return this;
    };
    
    // new View declaration 
    Skeleton.View = View.extend({
        
        // extended to use default ViewPlugins
        use: ViewPlugins
    });
    
    // new Model declaration
    Skeleton.Model = Model;

    // new Collection declaration
    Skeleton.Collection = Collection;
    
    // new Router declaration
    Skeleton.Router = Router.extend({
    
        // extended to enforce psudo-"global" availablity
        constructor: function(){
            var psGlobal = [View, Model, Collection];
            for (var i in psGlobal) psGlobal[i].prototype['router'] = this;
            return Router.apply(this, arguments);
        }
    });
    
    // new Dispatcher declaration
    Skeleton.Dispatcher = Dispatcher;
    
    // and that's it!
    return Skeleton;
});
