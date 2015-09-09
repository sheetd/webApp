// 
// Load Model 3D Viewer
//

function initialize() {
    // Initialize 3d viewer
    var options = {
        document: getModel(),
        env: "AutodeskProduction",
        getAccessToken: getToken, //why not getToken(), instead?
        refreshToken: getToken
    };

    var viewerElement = document.getElementById("viewer");
    
    //var viewer = new Autodesk.Viewing.Viewer3D(viewerElement, {}); //plain viewer
    var viewer = new Autodesk.Viewing.Private.GuiViewer3D(viewerElement, {}); //viewer with toolbars

    Autodesk.Viewing.Initializer(options, function () {
        viewer.start();
        loadDocument(viewer, options.document);
    });
    
    // Testing
    //testFunction();
    
    // Viewer Extensions testing   
    viewer.loadExtension("Autodesk.ADN.Viewing.Extension.Basic");
    
    // TO DO: Set viewer background, other options, etc.
}

function getToken() {
    //var theUrl = "http://" + location.hostname + ":5000/auth";//production
    var theUrl = "http://app.sheetd.com:5000/auth";//testing
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
    // Find the first 3d geometry and load that.
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

function testFunction() {
    // Send string to the console
    testFunction.option1 = "--> Test Function";
    console.log(testFunction.option1);
}

function getModel() {
    // Pull model # from pulldown
    var e = document.getElementById("modelDropdown");
    var modelInt = e.options[e.selectedIndex].value;
    
    // Pull string value from URL (for future use as web service)
    // http://app.sheetd.com/index.html&urn=1234
    var urlUrn = urlParam("urn");
    console.log("--> urn from URL: " + urlUrn);
    
    // Model Data JSON (eventual database connection or external JSON file)
    var models = '{ "models" : [' +
        '{"label":"D-SET Panel","urn":"urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bm1fYnVja2V0L01HTV9EU1RfUGFuZWxMLkNBVFBhcnQ="},' +
        '{"label":"BAMPFA Panel","urn":"urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6c2hlZXQuYnVja2V0L0JBTV9QTkxfUjA3LTAxLkNBVFBhcnQ="}]}';

    // Parse models list
    var modelSelection = JSON.parse(models);
    var name = modelSelection.models[modelInt].label;
    var urn = modelSelection.models[modelInt].urn;
    console.log("--> Loading Model" + "\n" + "--> name: " + name + "\n" + "--> urn: " + urn);
    return urn;
}

// Pull string value from URL
var urlParam = function (name, w) {
    w = w || window;
    var rx = new RegExp('[\&|\?]' + name + '=([^\&\#]+)'),
        val = w.location.search.match(rx);
    return !val ? '' : val[1];
}