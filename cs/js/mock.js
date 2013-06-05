define([
    "sinon"
  , 'mock/example'
], function(
    sinon
){ 
    
    /**
     * Configuration
     */
    var config = {
        
        // skip over mocking these requests
        skipFilter : ['cs/']
        
        // skip having to call server.respond();
      , autoRespond : true
        
        // auto respond delay (ms)
      , autoRespondAfter : 0
        
    };
    
    
    /**
     * Server Mockup Script 
     */
    var root = this; // get global root ("window")
    
    // make sure we don't mock these requests
    sinon.FakeXMLHttpRequest.useFilters = true;
    for (var i = 0; i < config.skipFilter.length; i++) {
        var filter = config.skipFilter[i];
        sinon.FakeXMLHttpRequest.addFilter(function(method, url){
            return url.indexOf(filter) === 0;
        });
    }

    // create a fake server
    // see http://sinonjs.org/docs/#server
    var server = sinon.fakeServer.create();
    
    // set server to autorespond after 3 seconds
    server.autoRespond = config.autoRespond;
    server.autoRespondAfter = config.autoRespondAfter;
    
    // start mapping responses! 
    var regex = /^(GET|POST|PUT|DELETE):(.+)$/
      , mocks = Array.prototype.slice.call(arguments,1);
    
    for (var i = 0; i < mocks.length; i++) {
        for (var hash in mocks[i]) {
        
            // parse request key 
            var req = hash.match(regex);
            
            // and set response
            if (req) server.respondWith(req[1], new RegExp('^'+req[2].trim()+'$'), mocks[i][hash]);
        }
    }
    
    // set to root, so devs can play with it
    root.server = server;
    
    // and return for completness
    return server;
    
});