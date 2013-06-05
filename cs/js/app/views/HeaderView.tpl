<!-- main template -->
<script type="text/html" id="main">
<div class="navbar navbar-inverse navbar-fixed-top">
    <div class="navbar-inner">
        <div class="container-fluid">
            <button type="button" class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a class="brand" href="#">Example</a>
            <div class="nav-collapse collapse">
                <p class="navbar-text pull-right">
                    Logged in as <a href="#" class="navbar-link">Username</a>
                </p>
                <ul class="nav">
                    <li><a href="#home">Home</a></li>
                    <li><a href="#about">About</a></li>
                </ul>
            </div>
        </div>
    </div>
</div>
</script>

<!-- nav template -->
<script type="text/html" id="navigation">
<li<%= path == "home" ? " class='active'" : "" %>><a href="#home">Home</a></li>
<li<%= path == "about" ? " class='active'" : "" %>><a href="#about">About</a></li>
</script>
