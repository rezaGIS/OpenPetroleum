// -- CDLE initializer / base functionality 

// Variables

require([
    "esri/map",
    "esri/layers/FeatureLayer",
    "esri/dijit/Legend",
    "dojo/_base/array",
    "esri/InfoTemplate",
    "dojo/parser",
    "dgrid/OnDemandGrid",
    "dgrid/Selection",
    "dojo/_base/declare",
    "dojo/ready",
    "dojo/domReady!"
], function (
    Map,
    FeatureLayer,
    Legend,
    arrayUtils,
    InfoTemplate,
    parser,
    Grid,
    Selection,
    declare,
    ready
    ) {
    parser.parse();
    // dgrid fields
    grid = new (declare([Grid, Selection]))({
        bufferRows: Infinity,
        columns: {
            "eventID": "EVENT ID",
            "facility": "FACILITY ID",
            "status": "STATUS",
            "siteName": "SITE NAME",
            "street": "STREET",
            "cityStateZip": "CITY STATE ZIP",
            "date": { "label": "DATE OF RELEASE", "formatter": formatTimestamp },
            "contact": "CONTACT",
            "phone": "PHONE",
            "email": "EMAIL"
        }
    }, "grid");
    // Function for DGRID date/time formatter
    function formatTimestamp(value) {
        var inputDate = new Date(value);
        return dojo.date.locale.format(inputDate, {
            selector: 'date',
            datePattern: 'MM/dd/yyyy'
        });
    }
    map = new Map("mapDiv", {
        basemap: "topo",  //For full list of pre-defined basemaps, navigate to http://arcg.is/1JVo6Wd
        center: [-104, 40], // longitude, latitude
        zoom: 7,
        sliderStyle: "large",
        minZoom: 7
    });

    infoTemplate = new InfoTemplate();
    infoTemplate.setTitle(infoTemplateTitle);
    infoTemplate.setContent(popupData);

    opsMap = new FeatureLayer(opsURL, {
        outFields: outFields,
        infoTemplate: infoTemplate,
        mode: FeatureLayer.MODE_SELECTION,
    });

    opsMap.on("mouse-over", function () {
        map.setMapCursor("pointer");
    });
    opsMap.on("mouse-out", function () {
        map.setMapCursor("default");
    });
    map.on("layers-add-result", function (evt) {
        var layerInfo = arrayUtils.map(evt.layers, function (layer, index) {
            return { layer: layer.layer, title: layer.layer.name};
        });
        if (layerInfo.length > 0) {
            var legendDijit = new Legend({
                map: map,
                layerInfos: layerInfo, "defaultSymbol": false
            }, "legendDiv");
            legendDijit.startup();
        }
    }); 
    map.addLayers([opsMap])

});





