// set up ========================
var express  = require('express');
var app      = express();                        // create our app w/ express
var port = process.env.PORT || 3000;

// configuration =================
app.use(express.static(__dirname + '/app'));     // set the static files location /public/img will be /img for users
app.use(function(req, res) {                     // catch all route middleware for page reload
    res.sendfile(__dirname + '/app/demo.html');
});

// listen (start app with node server.js) ======================================
app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});
