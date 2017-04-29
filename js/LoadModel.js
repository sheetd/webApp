//-----------------------------------------------------
// 3D Model Loader
//-----------------------------------------------------

// Globals
//"use strict";
var urn = null;
var modelList = null;

// Initialize (when DOM assembled)
$(document).ready(function () {
    processUI();
    initialize3d();
    changeModel();
})

// Process user interface
function processUI() {
    /*
    // Pull string value from URL, ex.: http://app.sheetd.com/?id=123456
    var urlId = urlParam("id");
    if (urlId === "") {
        urlId = "[None Selected]";
    };

    // Put model ID in the header
    //document.getElementById("sId").innerHTML = urlId; //js method (deprecated)
    $("#sId").html(urlId); //jQuery method
    console.log("1 --> id from URL: " + urlId);
    */

    // Process JSON model list
    var modelInt = 0;
    $.ajax({
        type: "GET",
        url: "models.json",
        dataType: "json",
        success: function (data) {
            urn = data[modelInt].urn;
            modelList = data
        },
        data: {},
        async: false
    });

    // TO DO: get model URN using async method
    //$.getJSON("models.json", function (data) {
    //    urn = data[modelInt].urn;
    //    console.log("2 --> urn: " + urn);
    //});

    // Append model list to pulldown
    for (i = 0; i < modelList.length; i++) {
        $("#partDropdown").append(new Option(modelList[i].id, i));
    };
}

// Initialize 3d viewer
function initialize3d() {
    var options = {
        document: urn,
        env: "AutodeskProduction",
        getAccessToken: getToken,
        refreshToken: getToken
    };

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

// Change model selection from pulldown
function changeModel() {
    $("#partDropdown").change(function () {
        var i = $("#partDropdown").val();
        urn = modelList[i].urn;
        initialize3d();
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

// Extract string value from URL
function urlParam(name, w) {
    w = w || window;
    var rx = new RegExp('[\&|\?]' + name + '=([^\&\#]+)'),
        val = w.location.search.match(rx);
    return !val ? '' : val[1];
}
