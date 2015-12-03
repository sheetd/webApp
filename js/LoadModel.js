//-----------------------------------------------------
// 3D Model Loader
//-----------------------------------------------------

// Globals
var urn = null;

// Initialize (when DOM assembled)
$(document).ready(function () {
    processUI();
    initialize3d();
})

// Process user interface
function processUI() {
    // Pull string value from URL, ex.: http://app.sheetd.com/?id=123456
    var urlId = urlParam("id");
    if (urlId === "") {
        urlId = "[None Selected]";
    };

    // Put model ID in the header
    //document.getElementById("sId").innerHTML = urlId; //js method (deprecated)      
    $("#sId").html(urlId); //jQuery method
    console.log("1 --> id from URL: " + urlId);

    // Model selection
    var modelInt = 0;

    // Get model URN from external JSON file
    $.getJSON("models.json", function (data) {
        urn = data[modelInt].urn;
        console.log("2 --> urn: " + urn);
    });
}

// Initialize 3d viewer
function initialize3d() {
    var options = {
        //document: urn,  // NOT WORKING - initialize3D running before processUI?!?!
        document: "urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bm1fYnVja2V0L01HTV9EU1RfUGFuZWxMLkNBVFBhcnQ=",
        env: "AutodeskProduction",
        getAccessToken: getToken, //why not getToken(), instead?
        refreshToken: getToken
    };

    // TESTING
    console.log("3 -->" + urn)
    console.log("4 -->" + options)

    var viewerElement = document.getElementById("viewer3d");

    //var viewer = new Autodesk.Viewing.Viewer3D(viewerElement, {}); //plain viewer
    var viewer = new Autodesk.Viewing.Private.GuiViewer3D(viewerElement, {}); //viewer with toolbars

    Autodesk.Viewing.Initializer(options, function () {
        viewer.start();

        // View preferences - 'Riverbank' render setting
        viewer.impl.setLightPreset(8);

        // TO DO: additional viewer settings  

        loadDocument(viewer, options.document);
    });
}

// Utility Functions
function getToken() {
    //var theUrl = "http://" + location.hostname + ":5000/auth";//production
    var theUrl = "http://api.sheetd.com:5000/auth";//testing
    var xmlHttp = null;
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false);
    xmlHttp.send(null);
    var resp = JSON.parse(xmlHttp.responseText);
    var token = resp["access_token"];

    // TO DO: new jQuery based method
    //$.get(theUrl, function () {
    //    console.log("--> token: " + token)
    //});

    return token;
}

function loadDocument(viewer, documentId) {
    Autodesk.Viewing.Document.load(documentId, function (doc) {// onLoadCallback
        var geometryItems = [];
        geometryItems = Autodesk.Viewing.Document.getSubItemsWithProperties(doc.getRootItem(), {
            type: "geometry",
            role: "3d"
        }, true);
        if (geometryItems.length > 0) {
            viewer.load(doc.getViewablePath(geometryItems[0]));
        }
    }, function (errorMsg) {// onErrorCallback
        alert("Load Error: " + errorMsg);
    });
}

function urlParam(name, w) { // Extract string value from URL
    w = w || window;
    var rx = new RegExp('[\&|\?]' + name + '=([^\&\#]+)'),
        val = w.location.search.match(rx);
    return !val ? '' : val[1];
}