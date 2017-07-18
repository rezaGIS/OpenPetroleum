function readyIdent() {
    require([
        "esri/map",
        "esri/tasks/IdentifyParameters",
        "esri/tasks/IdentifyTask",
        "esri/SpatialReference",
        "esri/InfoTemplate",
        "esri/dijit/Popup",
        "dojo/_base/array",
        "esri/Color",
        "dojo/dom-construct",
        "dojo/domReady!"
    ], function (
        Map,
        IdentifyParameters,
        IdentifyTask,
        SpatialReference,
        InfoTemplate,
        Popup,
        arrayUtils,
        Color,
        domConstruct
        ) {

        map.on("click", function identify(evt) {

            identifyOpsParams = new IdentifyParameters();
            identifyOps = new IdentifyTask(opsURL);

            identifyOpsParams.layerIds = [0,2];
            identifyOpsParams.layerOption = IdentifyParameters.LAYER_OPTION_ALL;
            identifyOpsParams.mapExtent = map.extent;
            identifyOpsParams.tolerance = 10;
            identifyOpsParams.geometry = evt.mapPoint;
            identifyOpsParams.returnGeometry = true;
            console.log(identifyOpsParams)
            var deferedIdentify = identifyOps.execute(identifyOpsParams).addCallback(function (response) {
                return arrayUtils.map(response, function (results) {
                    var feature = results.feature;
                    var layerName = results.layerName;
                    console.log(layerName);
                    console.log(feature);
                    feature.attributes.layerName = layerName;
                    if (layerName === "Open Events") {
                        var openEventsTemplate = new InfoTemplate("Open Petroleum Event");
                        console.log("hi")
                        feature.setInfoTemplate(openEventsTemplate);
                    }
                    if (layerName === "Tier 1"){
                        var tier1EventsTemplate = new InfoTemplate("Closed Petroleum Event");
                        feature.setInfoTemplate(tier1EventsTemplate);
                    }
                    return feature;
                });
              
            })
            map.infoWindow.setFeatures([deferedIdentify]);
            map.infoWindow.show(evt.mapPoint);

        });
    });
}