define([
    'BaseView'
  , 'text!app/templates/RequestsView.tpl'
  , 'app/models/RequestCollection'
],function(
    BaseView
  , ViewTemplate
  , RequestCollection
){
    
    var RequestsView = BaseView.extend({
        
        name: 'RequestsView'
      , template: ViewTemplate
        
        // setup this view
      , initialize: function(options){
            
            // base collection
            this.collection = new RequestCollection();
        }
        
      , $t: {
            newRequest  : $('a.btn.request:first')
          , requestList : $('div.requestlist:first')
          , requestRow  : $('tr.request')
        }
        
        // render this view's template
      , render: function(){
            
            // avoid re-rendering
            if (this.$el.html()) {
                this.$el.show();
                return this;
            }
            
            // render root element
            this.renderElement();
            
            // begin fetching current open requests
            this.ajax.track(this.collection.fetch());
            
            // finish
            return this._rendered(); 
        }
        
      , renderElement: function(){
            
            // set your own new $el to <body />
            if (! this.inDOM()) this.setElement($('<div class="RequestsView"></div>').appendTo('.content-body'));
            
            // load view template
            this.renderTemplate(this.$el, 'main'); 
        }
        
        // render user's list of requests
      , _renderRequests: function(){
            this.renderTemplate(this.$t.requestList, 'requests');
        }
        
      , listen: {
            'render'            : []
          , 'sync collection'   : '_renderRequests'
        }
        
      , events: {
            'click requestRow'      : '_eventClickRequestRow'
        }
        
      , _eventClickRequestRow: function(ev){
            var rowIndex = $(ev.currentTarget).index();
            var request = this.collection.at(rowIndex);
            if (request) this.app.navigate('requests/'+request.get('id'),{trigger:true});
        }
        
    });

    return RequestsView;
});