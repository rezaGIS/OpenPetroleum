require([
    "esri/map",
    "esri/layers/ArcGISDynamicMapServiceLayer",
    "esri/layers/FeatureLayer",
    "esri/dijit/Legend",
    "dojo/_base/array",
    "esri/InfoTemplate",
    "esri/dijit/Search",
    "dojo/parser",
    "dgrid/OnDemandGrid",
    "dgrid/Selection",
    "dojo/on",
    "dojo/_base/declare",
    "dojo/_base/connect",
    "dojo/dom",
    "agsjs/dijit/TOC",
    "dojo/ready",
    "dojo/domReady!"
], function (
    Map,
    ArcGISDynamicMapServiceLayer,
    FeatureLayer,
    Legend,
    arrayUtils,
    InfoTemplate,
    Search,
    parser,
    Grid,
    Selection,
    on,
    declare,
    dom,
    connect,
    TOC,
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
        basemap: "topo", 
        center: [-104, 40], // longitude, latitude
        zoom: 7,
        sliderStyle: "large",
        minZoom: 7
        
    });
    
    map.on("layers-add-result", function (evt) {
        opsMap.setVisibleLayers([0]);
        var toc = new TOC({  //Table of Contents info
            map: map,
            layerInfos: [
            {
                layer: opsMap,
                title: "Petroleum Events"
            }]
        }, 'tocDiv');
        toc.startup();
        toc.on('load', function () {
            if (console)
                console.log('TOC loaded');
        });
        toc.on('toc-node-checked', function (evt) { // controls TOC hierarchy
            if (console) {
                console.log("TOCNodeChecked, rootLayer:"
                + (evt.rootLayer ? evt.rootLayer.id : 'NULL')
                + ", serviceLayer:" + (evt.serviceLayer ? evt.serviceLayer.id : 'NULL')
                + " Checked:" + evt.checked);
                if (evt.checked && evt.rootLayer && evt.serviceLayer) {
                    // evt.rootLayer.setVisibleLayers([evt.serviceLayer.id])
                }
            }
        });
    });
    infoTemplate = new InfoTemplate();
    infoTemplate.setTitle(infoTemplateTitle);
    infoTemplate.setContent(popupData);

    opsMap = new ArcGISDynamicMapServiceLayer(opsURL, {
        outFields: ["*"]
    });

    opsMap.on("mouse-over", function () {
        map.setMapCursor("pointer");
    });
    opsMap.on("mouse-out", function () {
        map.setMapCursor("default");
    });
    document.getElementById('allClosed').onclick = function (evt) {
        opsMap.setVisibleLayers([1, 2, 3, 4, 5, 6]);
    };
    document.getElementById('allRemove').onclick = function (evt) {
        opsMap.setVisibleLayers([]);
    };
    map.addLayers([opsMap]);
    window.onload = findEvents();
          
});





