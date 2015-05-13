function initialize() {
    var options = {
        //"document" : "urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6c2hlZXQuYnVja2V0L0JBTV9QTkxfUjA3LTAxLkNBVFBhcnQ=", // BAMPFA Panel
        "document" : "urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bm1fYnVja2V0L01HTV9EU1RfUGFuZWxMLkNBVFBhcnQ=", // D-SET Panel
        "env" : "AutodeskProduction",
        "getAccessToken" : getToken,
        "refreshToken": getToken
    };

    var viewerElement = document.getElementById("viewer");
  
    var viewer = new Autodesk.Viewing.Viewer3D(viewerElement, {});
  
    Autodesk.Viewing.Initializer(options,function() {
        viewer.initialize();
        loadDocument(viewer, options.document);
    });
}

function getToken() {
    var theUrl = "http://app.sheetd.com:5000/auth";
    var xmlHttp = null;
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false);
    xmlHttp.send(null);
    var resp =  JSON.parse(xmlHttp.responseText);
    var token = resp["access_token"];
    return token;
}  

function loadDocument(viewer, documentId) {  
    // Find the first 3d geometry and load that.
    Autodesk.Viewing.Document.load(documentId, function(doc) {// onLoadCallback
        var geometryItems = [];
        geometryItems = Autodesk.Viewing.Document.getSubItemsWithProperties(doc.getRootItem(), {
            "type" : "geometry",
            "role" : "3d"
        }, true);
        if (geometryItems.length > 0) {
            viewer.load(doc.getViewablePath(geometryItems[0]));
        }
    }, function(errorMsg) {// onErrorCallback
        alert("Load Error: " + errorMsg);
    });
}

function testFunction() {
    // Put model data in an array (eventual database/JSON connection)
    var models = [
        {"modelName" : "BAMPFA Panel", "modelURN" : "urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6c2hlZXQuYnVja2V0L0JBTV9QTkxfUjA3LTAxLkNBVFBhcnQ="},
        {"modelName": "D-SET Panel", "modelURN": "urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6c2hlZXQuYnVja2V0L0JBTV9QTkxfUjA3LTAxLkNBVFBhcnQ="}
    ]

    // Parse array and write to console
    var modelStatus = JSON.parse(models);
    modelStatus.models[0].modelName + " , " + modelStatus.models[0].modelURN;
    console.log("Model Status: " + modelStatus);
}