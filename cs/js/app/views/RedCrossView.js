define([
    'BaseView'
  , 'text!app/templates/RedCrossView.tpl'
  , 'text!app/templates/RedCrossView.tip'
  , 'text!app/templates/RedCrossView.pop'
],function(
    BaseView
  , ViewTemplate
  , ViewTooltips
  , ViewPopovers
){
    
    // View's Event Handler Lists
    var listenEvents = {}
      , domEvents = {};
      
    var RedCrossView = BaseView.extend({
        
        name: 'RedCrossView'
      , template: ViewTemplate
        
        // (nothing to initialize)
      , initialize: function(){}
        
      , $t: {
            navigation      : $('.navbar.banner ul.nav:first')
          , newslink        : $('a[href="#news"]:first')
          , issueslink      : $('a[href="#issues"]:first')
        }
        
        // render this view's template
      , render: function(){
            
            // render root element
            this.renderElement();
            
            // start issues pinger
            this.pingIssues();
            this._ping = setInterval(_.bind(this.pingIssues,this), 30000);
            
            // finish
            return this._rendered(); 
        }
        
      , renderElement: function(){
            
            // if we're not in the DOM yet.. 
            if (! this.inDOM()) {
            
                // create root element, append into <body />
                var $el = $('<div class="'+ this.name +'"></div>').appendTo('body')
                this.setElement($el); // and update view element
            }
            
            // render view template
            this.renderTemplate(this.$el, 'main');
        }
        
        // parses jsonp callback
      , _renderIssues: function(issues){
            
            // callback triggered unsuccessfully
            if (! issues) { clearInterval(this._ping); return; }
            
            // when we get the response, render template
            this.renderTemplate(this.$t.issueslink, 'issueslink', {count: issues.total});
        }
        
      , dispose: function(){
            clearInterval(this._ping);
            return this._disposed();
        }
        
        // sets up jsonp request
      , pingIssues: function(){
            
            // set issues ping rendering callback
            this.app.ipc = _.once(_.bind(this._renderIssues,this));
            
            // ping away!
            this.ajax.request({
                url: 'https://app.arcphss.org/issues-tracker/rest/api/2/search'
              , data: 'fields=id&jql=project+%3D+PP+AND+resolution+%3D+Unresolved' +
                    '+AND+priority+%3D+Critical+ORDER+BY+key+DESC&jsonp-callback=window.app.ipc'
              , dataType: 'script'
              , crossDomain: true
            });
            
            // set a manual timeout of 5 seconds
            setTimeout(window.app.ipc, 5000);
        }
        
      , listen: listenEvents
      , events: domEvents
    });
    
    
    /**
     *  Navigation Handlers
     */
    _.extend(listenEvents,{
        'route app': function(){
            var $nav = this.$t.navigation
              , fragment = this.app.fragment()
              , features = this.app.app.get('features');
            
            //updates navbar focus
            if (features[fragment]) { 
                $nav.find('li').removeClass('active');
                $nav.find('.nav-'+fragment).addClass('active');
            };
        }
    });

    /**
     *  Issues Handler
     */
    // RedCrossView.extend({
    
    // });

    return RedCrossView;
});