function initialize() {
  var options = {
    'document' : 'urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bm1fYnVja2V0L01HTV9EU1RfUGFuZWxMLkNBVFBhcnQ=',
    'env':'AutodeskProduction',
    'getAccessToken': getToken,
    'refreshToken': getToken,
  };
  var viewerElement = document.getElementById('viewer');
  var viewer = new Autodesk.Viewing.Viewer3D(viewerElement, {});
  Autodesk.Viewing.Initializer(options,function() {
    viewer.initialize();
    loadDocument(viewer, options.document);
  });
}


function getToken() {
/*
  $.get("http://" + window.location.host + ":5000/api/token", function(accessToken) {
    var options = {};
    options.accessToken = accessToken;
console.log(accessToken);
return accessToken;
*/
  return "AaBUsx35j2MY6rtAmyiXlvX84nqp";
}


function loadDocument(viewer, documentId) {  
  // Find the first 3d geometry and load that.
  Autodesk.Viewing.Document.load(documentId, function(doc) {// onLoadCallback
  var geometryItems = [];
  geometryItems = Autodesk.Viewing.Document.getSubItemsWithProperties(doc.getRootItem(), {
      type : "geometry",
      role : "3d"
  }, true);
  if (geometryItems.length > 0) {
      viewer.load(doc.getViewablePath(geometryItems[0]));
  }
}, function(errorMsg) {// onErrorCallback
  alert("Load Error: " + errorMsg);
  });
}