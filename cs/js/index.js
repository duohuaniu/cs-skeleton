/**
 * index.js
 * Harry Truong (harry.truong@redcross.org)
 *
 * AMD Module Pattern
 *
 * This file follows the standard AMD module pattern, which is required for 
 * all our modules. See http://requirejs.org/docs/whyamd.html#definition.
 *
 * It all begins with define(), on line 7. Define is provided two arguments:
 * 1) Array of Module Dependencies, and 2) Module Factory Function.
 *
 * The Module Dependencies (1), are passed as arguments to the Factory 
 * Function (2) in the same order that they are listed.
 *
 * Example: 
 *  
 *      // We start with a new file, named "ModuleC.js"
 *      // We list ModuleA and ModuleB as dependencies for this new module.
 *      define(["ModuleA","ModuleB"], function(ModA,ModB){
 *          
 *          // start defining your new module
 *          var ModuleC = {};
 *          
 *          // Use ModuleA and ModuleB as needed,
 *          // but note that they are now locally named 
 *          // as ModA and ModB respectively.
 *          ModA.doSomething(ModuleC);
 *          ModuleC.foo = ModB.property;
 *
 *          // And then remember to return the new module.
 *          // This is important for using ModuleC as a 
 *          // dependency in another module.
 *          return ModuleC;
 *      });
 *
 *
 * Additional Notes: 
 *
 *   - See the define() statement below this comment block. The arguments are 
 *     broken into multiple lines by convention, purely for readability.
 *      
 *   - Module dependencies are first checked against the "path" configuration 
 *     from config.js. If the module path was not mapped there, requirejs 
 *     loads the module relative to the "baseUrl" configuration. 
 *          
 *     For this example, the "baseUrl" configuration is "cs/js", and the module 
 *     dependency is "ModuleA". Therefore, the module is loaded from 
 *     "cs/js/ModuleA.js". (Note how the ".js" suffix is auto-appended.)
 *
 */
define([
    "example"
],function(
    Example
){ 
    
    /** 
     * The index.js module focuses on bootstrapping the application. 
     * 
     * In this example, we're going to display an intro message, and ask
     * developers to run "start()" in their console, before continuing.
     */
     
    // check if console.log exists
    if (window.console === undefined || ! window.console.log) {
        alert('Sorry, please use a browser that implements a console. (i.e., Firefox)');
        return;
    }
     
    // directly inserts a basic introduction message
    var body = document.getElementsByTagName('body')[0];
    var intro = document.createElement('div');
    intro.innerHTML = 
        "<div class='well' style='margin:0 auto;width:700px;text-align:center;color:gray'>" + 
            "<h1>It's all in the source code.</h1>" + 
            "<div style='display:block;width:400px;margin:0 auto;'><ol style='text-align:left;'>" +
                "<li>Read the documentation: <a target='_blank' href='#'>http://tbd-documentation/</a></li>" + 
                "<li>Review the bootstrap for this page: <code>index.html</code></li>" + 
                "<li>Review the configurations: <code>cs/js/config.js</code></li>" + 
                "<li>Review this demo application code: <code>cs/js/index.js</code></li>" +
            "</ol></div>" + 
            "<p>When you're ready, open your browser's console* and type <code>start()</code></p>" +
            "<p>(*Not familiar with the console? Go back to Step 1.)</p>" +
        "</div>" + 
        "<a target='_blank' href='https://github.com/ARCPHSSIT'>" + 
            "<img style='position:absolute;top:0;right:0;border:0;' " + 
                "src='//s3.amazonaws.com/github/ribbons/forkme_right_gray_6d6d6d.png' " +
                "alt='Fork me on GitHub' />" +
        "</a>";
    body.appendChild(intro);
    
    // set a one-time global start()
    this.start = function(){
        delete this.start;
        body.removeChild(intro);
        
        // create new Example() instance
        var example = new Example();
        example.start(); // and away we go!
    }
    
    /**
     * Some Final Remarks
     * 
     * cs-skeleton is bundled with a few development utilities, and some 
     * extensions to popular libraries. The core of these extensions focus on 
     * building a framework around BackboneJS. (see http://backbonejs.org/#FAQ-tim-toady)
     * 
     * By providing these extensions and utilities, we've come up with an 
     * architecture and development roadmap that works for our team. 
     * 
     * Ultimately, this means you can opt NOT to use our extensions, and instead 
     * declare your own extensions/dependencies/architecture. (If you're coding
     * alongside our team and choose to do this, remember that you are now 
     * responsible for your own code!)
     * 
     * The rest of this example will highlight our architecture and review the
     * development practices that we find useful. Go look at "example.js", and 
     * run "start()" in your browser's console, if you haven't done so.
     * 
     * 
     *                                  Happy Coding,
     *                                     ARCPHSSIT
     */
     
    // this index.js module does not need to 
    // return anything, since it is only for 
    // bootstrapping, and will not be reused 
    // by another module.
    return undefined;
});