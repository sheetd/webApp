function initialize() {
    // Initialize 3d viewer
    var options = {
        "document" : selectDocument(),
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
    
    // Testing
    testFunction();
    
    // Set viewer background
    viewer.impl.setLightPreset(8)
    
    // Insert the toolbar
    viewer.getToolbar(true)
}

function getToken() {
    var theUrl = "http://app.sheetd.com:5000/auth";
    var xmlHttp = null;
    xmlHttp = new XMLHttpRequest();
    // new jQuery based method here?
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
    // Send string to the console
    testFunction.option1 = "Test Function Works";
    console.log(testFunction.option1);
}

function getModelInt() {
    // Pull model # from pulldown
    var e = document.getElementById("modelNumberDropdown");
    var modelInt = e.options[e.selectedIndex].value;
    console.log("Model # Selected: " + modelInt);
    return modelInt;
}

function selectDocument() {
    // Put model data in an array (eventual database connection...)
    var models = [
        {"modelName" : "BAMPFA Panel", "modelURN" : "urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6c2hlZXQuYnVja2V0L0JBTV9QTkxfUjA3LTAxLkNBVFBhcnQ="},
        {"modelName" : "D-SET Panel", "modelURN" : "urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6c2hlZXQuYnVja2V0L0JBTV9QTkxfUjA3LTAxLkNBVFBhcnQ="}
    ]
    
    // Select model # from dropdown list
    getModelInt()

    // TO DO: Parse array and output URN
    //modelStatus = JSON.parse(models);
    //modelStatus.models[0].modelName + " , " + modelStatus.models[0].modelURN;
    //console.log("Model Status: " + modelStatus);

    // Outputs the URN
    var urn = "urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bm1fYnVja2V0L01HTV9EU1RfUGFuZWxMLkNBVFBhcnQ=";
    return urn;
}