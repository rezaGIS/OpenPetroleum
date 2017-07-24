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

        identifyEvent = map.on("click", function identify(evt) {

            identifyOpsParams = new IdentifyParameters();
            identifyOps = new IdentifyTask(opsURL);
            identifyOpsParams.layerIds = [0, 2, 3, 4, 5, 6];
            identifyOpsParams.layerOption = IdentifyParameters.LAYER_OPTION_VISIBLE;
            identifyOpsParams.mapExtent = map.extent;
            identifyOpsParams.tolerance = 1;
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
                        feature.setInfoTemplate(openEventsTemplate);
                    }
                    if (layerName === ("Tier 1") || ("Tier 2") || ("Other/Unknown")){
                        var closedEventsTemplate = new InfoTemplate("Closed Petroleum Event", closedData);
                        feature.setInfoTemplate(closedEventsTemplate);
                    }
                    if (layerName === ("Tier 4" || "Tier 3")) {
                        var tier4EventsTemplate = new InfoTemplate("Closed Petroleum Event", tier4Data);
                        feature.setInfoTemplate(tier4EventsTemplate);
                    }
                    return feature;
                });
              
            })
            map.infoWindow.setFeatures([deferedIdentify]);
            map.infoWindow.show(evt.mapPoint);

        });
    });
}