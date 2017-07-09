require([
    "esri/map",
    "esri/layers/FeatureLayer",
    "esri/tasks/query",
    "esri/tasks/QueryTask",
    "dojo/domReady!"
], function (
    Map,
    FeatureLayer,
    Query,
    QueryTask,
    ready
    ) {
    
        function layerQuery() {
            var qt = new QueryTask(opsURL);
            var queryToggle = new Query();
            queryToggle.outFields = ["*"]; 
            queryToggle.returnGeometry = true;
            queryToggle.where = toggleString;
            opsMap.selectFeatures(queryToggle, FeatureLayer.SELECTION_ADD);
        }
        function layerQueryRemove() {
            var qt = new QueryTask(opsURL);
            var queryToggle = new Query();
            queryToggle.outFields = ["*"]; 
            queryToggle.returnGeometry = true;
            queryToggle.where = toggleString;
            opsMap.selectFeatures(queryToggle, FeatureLayer.SELECTION_SUBTRACT);
        }
        $('#layerClosedCheck').on('click', function closedToggle() {

            if (document.getElementById('layerClosedCheck').checked == true) {
                toggleString = "Status = 'Closed'";
                layerQuery();
            }
            else {
                toggleString = "Status = 'Closed'";
                layerQueryRemove();
            }
        });
        
       
});
