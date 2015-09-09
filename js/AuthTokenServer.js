//----------------------------------------------------- 
// Authentication Token Server
//----------------------------------------------------- 

var https = require("https");
var express = require("express");

var app = express();

// Call the Autodesk authentication API to get a token based on our client_id and client_secret.
// When we get a response, forward that response on to the browser-based app that called us needing
// the token.

function getAuthCode(mainResponse, baseUrl, clientId, clientSecret) {
	var dataString = "client_id=" + clientId + "&client_secret=" + clientSecret + "&grant_type=client_credentials";

    var headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    };

	var options = {
  		host: baseUrl,
  		port: 443,
  		path: "/authentication/v1/authenticate",
  		method: "POST",
  		headers: headers,

  		// only for dev!
  		rejectUnauthorized: false,
        requestCert: true,
        agent: false
	};

	var req = https.request(options, function(res) {
  		res.setEncoding("utf8");
  		var responseString = "";

  		res.on("data", function (data) {
    		responseString += data;
  		});

  		res.on("end", function() {
            console.log(responseString);
            mainResponse.setHeader('Content-Type', 'application/json');
            mainResponse.setHeader('Access-Control-Allow-Origin', '*');
            mainResponse.send(responseString);  // forward our response onto the original call from the browser app
    	});
    });

    req.write(dataString);
    req.end();
}

// these are the URLs the browser based app will send to us to get the token.  Send one appropriate for the
// given environment.  If you only have keys for the PRODUCTION environment, then just replace those below,
// otherwise you can replace them all and easily switch environments from your browser app.

app.get("/auth", function(req, res) {
    console.log("AuthTokenServer: getting PRODUCTION token...");
        // ***** PUT YOUR PRODUCTION KEYS HERE *****
    getAuthCode(res, "developer.api.autodesk.com", "xeRR1fXOYBQAda23xJOkGzLyUrtMEOBP", "MCCEXXeWCHEyRQfN");
});

app.get("/auth-stg", function(req, res) {
    console.log("AuthTokenServer: getting STAGING token...");
        // ***** PUT YOUR STAGING KEYS HERE *****
    getAuthCode(res, "developer-stg.api.autodesk.com", "xeRR1fXOYBQAda23xJOkGzLyUrtMEOBP", "MCCEXXeWCHEyRQfN");
});

app.get("/auth-dev", function(req, res) {
        // need endpoint and keys for DEV
    console.log("AuthTokenServer: getting DEV token...");
        // ***** PUT YOUR DEV KEYS HERE *****
    getAuthCode(res, "developer-dev.api.autodesk.com", "xeRR1fXOYBQAda23xJOkGzLyUrtMEOBP", "MCCEXXeWCHEyRQfN");
});

// test route to make sure everything is working
app.get("/", function(req, res) {
    res.send("I'm alive!");
});

app.listen(process.env.PORT || 5000);