<!-- 
    Main TopView Template 
-->
<script type="text/html" id="main">
<div class="content-header">
    <div class="container-fluid">    
    
        <div class="row-fluid navbar">
            <div class="span4">
                <a href="#" class="brand" rel="index">
                    <img src="cs/img/redcross-logo.png" />
                    <%= app.app.get("title") %>
                </a>
            </div>
            
            <div class="span8 hidden-phone">
                <div class="row-fluid"><div class="span12">
                </div></div>
                
                <div class="row-fluid"><div class="span12">
                    <ul class="nav pull-right account">
                        <li class="dropdown">
                            <a href="#" class="user dropdown-toggle" data-toggle="dropdown">
                                <i class="icon-user"></i> <%= app.user.label("Hi, {{first_name}} {{last_name}}") %>
                                <b class="caret" style="margin-left:3px"></b>
                            </a>
                            <ul class="dropdown-menu pull-right" role="menu" aria-labelledby="dLabel">
                                <li>
                                    <a href="#account">Account Settings</a>
                                </li>
                                <li>
                                    <a href="#application">Application Settings</a>
                                </li>
                                <li class="divider"></li>
                                <li>
                                    <a href="#about">About <%= app.app.get("title") %></a>
                                </li>
                                <li class="divider"></li>
                                <li>
                                    <a href="#logout">Sign Out</a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <a href="#">English</a>
                        </li>
                    </ul>
                </div></div>
                
                <div class="row-fluid"><div class="span12">
                    <ul class="nav uppercase immersive pull-right">
                        <li>
                            <a href="#news"><i class="icon-bullhorn"></i> News</a>
                        </li>
                        <li>
                            <a href="#help"><i class="icon-comment"></i> Help</a>
                        </li>
                        <li>
                            <a href="#issues"><i class="icon-exclamation-sign"></i> Issues</a>
                        </li>
                    </ul>
                </div></div>
            </div>
        </div>
        
        <div class="row-fluid">
            <div class="span9 navbar banner">
                <ul class="nav uppercase">
                    <% var features = app.app.get("features"); for (var path in features) { %>
                    <li class="nav-<%= path %>">
                        <a href="#<%= path %>"><%= features[path] %></a>
                    </li>
                    <% } %>
                </ul>
            </div>
            <div class="span3 hidden-phone">
                <div class="input-append pull-right" style="padding-top:5px;margin:0;">
                    <input class="input-medium" placeholder="Quick Search" type="search">
                    <button class="btn" type="button"><i class="icon-search"></i></button>
                </div>
            </div>
        </div>
        
    </div>
</div>

<div class="container-fluid content-body"></div>
    
<div class="content-footer"><div class="container-fluid">
    <hr style="display:none" />
    <div class="navbar">
        <span class="copyright">&copy; Copyright 2013 The American Red Cross</span>
        <ul class="nav">
            <li><a target="_blank" href="http://www.redcross.org/privacy-policy"> Privacy Policy </a></li>
            <li><a target="_blank" href="http://www.redcross.org/terms-of-use"> Terms and Conditions </a></li>
        </ul>
    </div>
    <span class="muted">
        <%= app.app.label("{{title}} ({{version}} - {{environment}})") + (app.app.get("sandbox") ? "[Sandbox]" : "") %>
    </span>
</div></div>
</script>

<script type="text/html" id="newslink">
<i class="icon-bullhorn"></i> <%= count > 0 ? "<span style='color:red;font-weight:bold;'>News ("+count+")</span>": "News" %>
</script>

<script type="text/html" id="issueslink">
<i class="icon-exclamation-sign"></i> <%= count > 0 ? "<span style='color:"+ (count < 3 ? "orange" : "red") +";font-weight:bold;'>Issues ("+count+")</span>": "Issues" %>
</script>