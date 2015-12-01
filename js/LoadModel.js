//----------------------------------------------------- 
// 3D Model Loader
//----------------------------------------------------- 

// Initialize (when DOM assembled)
$(document).ready(function() {
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

    //document.getElementById("sId").innerHTML = urlId; //js method (deprecated)      
    $("#sId").html(urlId); //jQuery method
    console.log("--> ID from URL: " + urlId);

    // Load model based on index
    var modelInt = 0;
    getModel(modelInt);
}

// Get model URN
function getModel(modelInt) {
    $.getJSON("models.json", function (data) {
        var id = data[modelInt].id;
        var urn = data[modelInt].urn;
        console.log("--> Loading Model" + "\n" + "--> ID: " + id + "\n" + "--> urn: " + urn);
        return urn;
    });
}

// Initialize 3d viewer
function initialize3d() { 
    var options = {
        document: getModel(),
        env: "AutodeskProduction",
        getAccessToken: getToken, //why not getToken(), instead?
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

// Find the first 3d geometry and load that.
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

// Get model URN
function getModelOLD() {
    /*
    // Pull model # from pulldown
    var e = document.getElementById("modelDropdown");
    var modelInt = e.options[e.selectedIndex].value;

    // Model Data JSON (eventual database connection or external JSON file)
    var models = '{ "models" : [' +
        '{"id":"3M2_PNL_C03_001","urn":"urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bm1fYnVja2V0L01HTV9EU1RfUGFuZWxMLkNBVFBhcnQ="},' +
        '{"id":"BAM_PNL_D","urn":"urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6c2hlZXQuYnVja2V0L0JBTV9QTkxfUjA3LTAxLkNBVFBhcnQ="}]}';
    console.log(models);

    // Parse models list
    var modelInt = 0
    var modelList = JSON.parse(models);
    var id = modelList.models[modelInt].id;
    var urn = modelList.models[modelInt].urn;
    console.log("--> Loading Model" + "\n" + "--> ID: " + id + "\n" + "--> urn: " + urn);
    return urn;
    */
}

// Utility
function urlParam(name, w) { // Extract string value from URL
    w = w || window;
    var rx = new RegExp('[\&|\?]' + name + '=([^\&\#]+)'),
        val = w.location.search.match(rx);
    return !val ? '' : val[1];
}