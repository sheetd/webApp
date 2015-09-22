//----------------------------------------------------- 
// 3D Model Loader
//----------------------------------------------------- 

function initialize() {
    // Initialize 3d viewer
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

function getModel() {    
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

    // Pull string value from URL: http://app.sheetd.com/?id=123456
    var urlId = urlParam("id");
    if (urlId === "") {
        urlId = "[None Selected]";
    }
    //document.getElementById("sId").innerHTML = urlId; //js method (deprecated)      
    $("#sId").html(urlId); //jQuery method
    console.log("--> ID from URL: " + urlId);

    /*
    // Parse external JSON file - NOT WORKING
    var modelArray = null;
    var id = null;
    var urn = null;
    $.getJSON("models.json", function (data) {
        modelArray = $.parseJSON(data).models;
        id = modelArray.models[0].id;
        urn = modelArray.models[0].urn;
        console.log("--> Loading Model" + "\n" + "--> ID: " + id + "\n" + "--> urn: " + urn);
    });
    */
    
    var modelArray = [];
    $.ajax({
        url: "models.json",
        dataType: "json",
        async: false,
        success: function (data) {
            modelArray = $.parseJSON(data).models;
            console.log(modelArray);
        }
    });
     
    //var id = modelArray[0].id;
    var urn = modelArray[0].url;

    return urn;
}

// Extract string value from URL
function urlParam(name, w) {
    w = w || window;
    var rx = new RegExp('[\&|\?]' + name + '=([^\&\#]+)'),
        val = w.location.search.match(rx);
    return !val ? '' : val[1];
}