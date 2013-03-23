define({ 

    /**
     * MOCKUP SYNTAX:
     *
     *      "[HTTP_METHOD]: [URI_PATH]" : [RESPONSE]
     *
     *  - HTTP_METHOD must be either GET, POST, PUT or DELETE.
     *
     *  - URI_PATH is a regex i.e., "/api/v1/res", "/api/v1/res/[0-9]", "/api/v[0-9]+/res"
     *
     *  - RESPONSE can be either an Array, Function or String.
     *    (See http://sinonjs.org/docs/#fakeServer)
     *
     *
     * EXAMPLE MOCKUPS:
     *
     * Tip: Use this command w/ your own [HTTP_METHOD], [DATA] and [URI_PATH] values:
     *
     *      $.ajax({type: [HTTP_METHOD] , data: [DATA], url: [URI_PATH] , complete: function(){console.log(arguments);}})
     *
     */
     
    // basic raw text response
    "GET: api/v1/ex/foo" : 'Hello World'
    
    // basic JSON response
  , "GET: api/v1/test/json" : [200, { "Content-Type" : "application/json" }, '[{"foo":"bar"},{"foo":"bar"}]']
    
    // basic error response
  , "GET: api/v1/test/error" : [401, {}, ""]
    
    // special regex uri path
  , "GET: api/v1/test/(a|b|c)" : 'Easy as 1, 2, 3!'
    
    // another special regex uri path
  , "GET: api/v[0-9]+/test" : 'Respond to all versions!'
    
    // special complex response
  , "POST: api/v1/test" : function(request){
        
        // we can examine the current request
        // console.log(request);
        
        // we have the request headers/body
        var headers = request.requestHeaders
          , body = request.requestBody || "";
            // note that body is a raw string, 
            // and may need to be url-decoded
            // (which is annoying to do in JS)
        
        // do logic to determine response
        var response = (body.indexOf('foo=bar') >= 0) ?
            [201, { "Content-Type" : "application/json" }, '{"status":"Created", "id": 12345}'] :
            [401, { "Content-Type" : "application/json" }, '{"status":"Unauthorized"}'];
        
        // remember to call request.respond()
        // (see http://sinonjs.org/docs/#respond)
        request.respond.apply(request, response);
    }
    
    // special complex regex path and response
  , "GET: /api/v1/test/[0-9]+" : function(request){
  
        // sometimes, we want to return a response 
        // based off of the request url
        var url = request.url;
        
        // let's parse for the key value
        var match = url.match(new RegExp('/api/v1/test/([0-9]+)'));
        
        // and respond with a object that includes that matched value
        request.respond(200, { "Content-Type" : "application/json" }, '{"id":'+match[1]+',"foo":"bar"}');
    }
    
});