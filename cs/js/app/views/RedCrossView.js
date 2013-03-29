/**
 * RedCrossView - Backbone View
 * Harry Truong (harry.truong@redcross.org)
 *
 * This view handles all functionality within header and footer sections. 
 * 
 * Current functionality includes:
 *      - pinging of issues tracker for current major issues (see "Issues Handler"), 
 *      - pinging of news blog for latest announcements (see "News Handler"), and
 *      - updating of navigation banner (see "Navigation Handler")
 *
 */

define([
    'sys/BaseView'
  , 'text!app/templates/RedCrossView.tpl'
  , 'text!app/templates/RedCrossView.tip'
  , 'text!app/templates/RedCrossView.pop'
],function(
    BaseView
  , ViewTemplate
  , ViewTooltips
  , ViewPopovers
){
    
    /**
     * RedCrossView
     * 
     * Contains all functionality within header and footer sections. This view is styled 
     * according to redcross.org, and also with responsive media queries. 
     *
     */
    var RedCrossView = BaseView.extend({
        
        name: 'RedCrossView'
      , template: ViewTemplate
        
        // (nothing to initialize)
      , initialize: function(){}
        
      , render: function(){
            this.renderElement();
            return this._rendered();
        }
        
      , renderElement: function(){
            
            // if we're not in the DOM yet.. 
            if (! this.inDOM()) {
            
                // create root element, append into <body />
                var $el = $('<div class="'+ this.name +'"></div>').appendTo('body');
                this.setElement($el); // and update view element
            }
            
            // render main view template
            this.renderTemplate(this.$el, 'main');
        }
      
    });
    
    
    /**
     * Navigation Handler
     *  
     * Updates the navigation banner to highlight user's current page. 
     * 
     */
    RedCrossView = RedCrossView.addHandler({
        
        $t: {
            'navigation'    : $('.navbar.banner ul.nav:first')
        }
        
      , listen: {
            'render'        : '_renderNavigation'
          , 'route app'     : '_renderNavigation'
        }
        
        // updates navigation to reflect current uri
      , _renderNavigation: function(){
            var $nav = this.$t.navigation
              , path = this.app.path()
              , indexes = this.app.app.get('indexes');
            
            //updates navbar focus
            if (indexes[path]) { 
                $nav.find('li').removeClass('active');
                $nav.find('.nav-'+path).addClass('active');
            };
        }
    });

    
    /**
     * Issues Handler
     * 
     * Pings issues tracker (via JSONP request) to fetch latest "critical" issues. Updates Issues
     * icon accordingly. Opens IssuesView when user clicks on issues icon.
     * 
     */
    RedCrossView = RedCrossView.addHandler({
        
        $t:     {
            'issueslink'    : $('a[href="#issues"]:first')
        }
        
      , listen: {
            'render'        : 'startIssuesPing'
          , 'dispose'       : 'stopIssuesPing'
        }
        
        // starts recurring issues ping
      , startIssuesPing: function(){
            
            // start issues pinger
            this.pingIssues();
            this._issues_ping = setInterval(_.bind(this.pingIssues,this), 30000);
        }
        
        // sets up jsonp request
      , pingIssues: function(){
        
            // set issues ping rendering callback
            this.app.ipc = _.once(_.bind(this._renderIssues,this));
            
            // ping away!
            this.ajax.request({
                url: 'https://issues.arcphss.org/rest/api/2/search'
              , data: 'fields=id&jql=project+%3D+PP+AND+resolution+%3D+Unresolved' +
                    '+AND+priority+%3D+Critical+ORDER+BY+key+DESC&jsonp-callback=window.app.ipc'
              , dataType: 'script'
              , crossDomain: true
            });
            
            // set a manual timeout of 5 seconds
            setTimeout(window.app.ipc, 5000);
        }
        
        // stops recurring issues ping
      , stopIssuesPing: function(){
            clearInterval(this._issues_ping);
        }
        
        // parses jsonp callback
      , _renderIssues: function(issues){
            
            // callback triggered unsuccessfully
            if (! issues) { clearInterval(this._issues_ping); return; }
            
            // when we get the response, render template
            this.renderTemplate(this.$t.issueslink, 'issueslink', {count: issues.total});
        }
    });

    
    /**
     * News Handler
     * 
     * TBD. Currently disabled in main template.
     * 
     * Pings news blog (via JSONP request) to fetch latest announcements. Updates Issues
     * icon accordingly. Also prepends banner notifications into content body for critical 
     * announcements. Opens NewsView when user clicks on news icon.
     * 
     */
    /* RedCrossView = RedCrossView.addHandler({
        
        $t:     {
            'newslink'    : $('a[href="#news"]:first')
        }
        
      , listen: {
            'render'        : 'startNewsPing'
          , 'dispose'       : 'stopNewsPing'
        }
        
        // starts recurring news ping
      , startNewsPing: function(){
            
            // start issues pinger
            this.pingNews();
            this._news_ping = setInterval(_.bind(this.pingNews,this), 30000);
        }
        
        // sets up jsonp request
      , pingNews: function(){
        
            // set issues ping rendering callback
            this.app.npc = _.once(_.bind(this._renderNews,this));
            
            // ping away!
            this.ajax.request({
                // url: 'https://issues.arcphss.org/rest/api/2/search'
              // , data: 'fields=id&jql=project+%3D+PP+AND+resolution+%3D+Unresolved' +
                    // '+AND+priority+%3D+Critical+ORDER+BY+key+DESC&jsonp-callback=window.app.npc'
              , dataType: 'script'
              , crossDomain: true
            });
            
            // set a manual timeout of 5 seconds
            setTimeout(window.app.npc, 5000);
        }
        
        // stops recurring news ping
      , stopNewsPing: function(){
            clearInterval(this._news_ping);
        }
        
        // parses jsonp callback
      , _renderNews: function(news){
            
            // callback triggered unsuccessfully
            if (! issues) { clearInterval(this._news_ping); return; }
            
            // when we get the response, render template
            this.renderTemplate(this.$t.newslink, 'newslink', {count: issues.total});
        }
    }); */

    
    /**
     * Help Handler
     *
     * TBD. Currently disabled in main template.
     *
     */
    // RedCrossView = RedCrossView.addHandler({
    // });
     
    
    return RedCrossView;
});