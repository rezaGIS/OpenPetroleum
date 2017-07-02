require([
    "esri/map",
    "dojo/parser",
    "esri/layers/FeatureLayer",
    "dojo/_base/array",
    "esri/dijit/BasemapGallery",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/Color",
    "dojo/dom-construct",
    "esri/geometry/Circle",
    "esri/geometry/Point",
    "esri/graphic",
    "esri/graphicsUtils",
    "esri/symbols/SimpleLineSymbol",
    "esri/tasks/query",
    "esri/tasks/QueryTask",
    "esri/dijit/Search",
    "dgrid/OnDemandGrid",
    "dgrid/Selection",
    "dojo/store/Memory",
    "dojo/_base/declare",
    "dojo/_base/array",
    "dojo/on",
    "dojo/dom",
    "dojo/ready",
    "dojo/domReady!"
], function (
    Map,
    parser,
    FeatureLayer,
    arrayUtils,
    BasemapGallery,
    SimpleFillSymbol,
    SimpleMarkerSymbol,
    Color,
    domConstruct,
    Circle,
    Point,
    Graphic,
    graphicsUtils,
    SimpleLineSymbol,
    Query,
    QueryTask,
    Search,
    Grid,
    Selection,
    Memory,
    declare,
    array,
    on,
    dom,
    ready
    ) {
    parser.parse();
    $(document).ready(function toggleTools() {
        $("#clickDesc").hide();
        $("#useGeocode").click(function () {
            $('input[name="radioMap"]').prop('checked', false);
            $("#clickDesc").hide();
            $('#searchBreak').show();
            $("#search").show();
        });
        $("#useMap").click(function () {
            $('input[name="radioGeocode"]').prop('checked', false);
            $("#search").hide();
            $('#searchBreak').hide();
            $("#clickDesc").show();
        });
    });
    var geocode = new Search({
        map: map,
        maxResults: 4,
        countryCode: "US",
        suffix: "CO"

    }, "search");
    geocode.startup();
    geocode.on("select-result", showLocation);

    //mouse click
    map.on("click", function mapClick(evt) {
        if (document.getElementById('useMap').checked) {
            map.graphics.clear();
            var latitude = evt.mapPoint.getLatitude();
            var longitude = evt.mapPoint.getLongitude();
            var clickCenter = ([longitude, latitude]);
            //alert(clickCenter);
            var buffDist = document.getElementById('bufferDist').value;
            var symbol = new SimpleMarkerSymbol()
              .setStyle("circle")
              .setColor(new Color([255, 0, 0, 0.5]));
            circle = new Circle({
                center: clickCenter,
                geodesic: true,
                radius: buffDist,
                radiusUnit: "esriMiles"
            });
            circleExtent = circle.getExtent();
            map.setExtent((circleExtent).expand(1.3));
            var graphic = new Graphic(circle, symbol);
            map.graphics.add(graphic);
            var query = new Query();
            query.geometry = circleExtent;
            opsMap.queryFeatures(query, selectInBuffer);
        }
        else {
        }
    });
    // Circle created by geocoder 
    function showLocation(evt) {
        map.graphics.clear();
        var buffDist = document.getElementById('bufferDist').value;
        var point = evt.result.feature.geometry;
        var symbol = new SimpleMarkerSymbol()
          .setStyle("circle")
          .setColor(new Color([255, 0, 0, 0.5]));
        var graphic = new Graphic(point, symbol);
        map.graphics.add(graphic);
        map.infoWindow.setTitle("Search Result");
        map.infoWindow.setContent(evt.result.name);
        map.infoWindow.show(evt.result.feature.geometry);
        circle = new Circle({
            center: point,
            geodesic: true,
            radius: buffDist,
            radiusUnit: "esriMiles"
        });
        map.infoWindow.hide();
        var graphic = new Graphic(circle, circleSymb);
        map.graphics.add(graphic);
        geocode.clear()
        queryBuffer();
    };
    function queryBuffer() {
        var query = new Query();
        circleExtent = circle.getExtent();
        query.geometry = circleExtent;
        opsMap.queryFeatures(query, selectInBuffer);
    }
    // Circle styling definition
    var circleSymb = new SimpleFillSymbol(
          SimpleFillSymbol.STYLE_NULL,
          new SimpleLineSymbol(
            SimpleLineSymbol.STYLE_SHORTDASHDOTDOT,
            new Color([105, 105, 105]), 2
          ), new Color([255, 255, 0, 0.25])
        );
    function selectInBuffer(response) {
        var memStore = new Memory({ data: "" });
        window.grid.set("store", memStore);
        var feature;
        var features = response.features;
        var inBuffer = [];
        if (features.length > 300) { // Too many items were being selected causing lag on user side      
            alert("Too many results are found.  Please reduce 'Buffer Radius'.");
            map.graphics.clear();
            map.setZoom(7);
        }
        else {
            //filter out features that are not actually in buffer, since we got all points in the buffer's bounding box
            for (var i = 0; i < features.length; i++) {
                feature = features[i];
                if (circle.contains(feature.geometry)) {
                    inBuffer.push(feature.attributes[opsMap.objectIdField]);
                    var query = new Query();
                    query.objectIds = inBuffer;
                    buffer.value = query.objectIds;

                    populateGrid(Memory);

                }
                else {
                }
            }
        }
    }
    $('#findBtn').on('click', function search() {
        var queryString = [];
        var entryValidate = isNaN(document.getElementById('qryBox').value);
        if (document.getElementById('qryBox').value == "") {
            alert("No values entered.");
        }
        else {
            var qt = new QueryTask(opsURL);
            var query = new Query();
            if (document.getElementById('qryField').value == "Event_ID") {
                if (entryValidate == false) {
                    var queryString = [document.getElementById('qryField').value] + " = " + [document.getElementById('qryBox').value];
                }
                else {
                    alert("Entry must be a number.");
                }
            }
            else if (document.getElementById('qryField').value == "Facility_I") {
                if (entryValidate == false) {
                    var queryString = [document.getElementById('qryField').value] + " = " + [document.getElementById('qryBox').value];
                }
                else {
                    alert("Entry must be a number.");
                }
            }
            else if (document.getElementById('qryField').value == "Site_Name_") {
                if (entryValidate == true) {
                    var storeQry = [document.getElementById('qryBox').value];
                    var formatQry = storeQry.toString().toUpperCase();
                    var queryString = [document.getElementById('qryField').value] + " LIKE '%" + formatQry + "%'";
                }
                else {
                    alert("Entry must be a string.");
                }
            }
            else if (document.getElementById('qryField').value == "Status_Sea") {
                if (entryValidate == true) {
                    var storeQry = [document.getElementById('qryBox').value];
                    var formatQry = storeQry.toString().toUpperCase();
                    var queryString = [document.getElementById('qryField').value] + " LIKE '%" + formatQry + "%'";
                }
                else {
                    alert("Entry must be string.");
                }
            }
            query.where = queryString;
            query.returnGeometry = false;
            query.outFields = ["*"];
            qt.execute(query, function (results) {
                var data = array.map(results.features, function (feature) {
                    return {
                        // property names used here match those used when creating the dgrid
                        "id": feature.attributes[outFields[0]],
                        "facility": feature.attributes[outFields[2]],
                        "eventID": feature.attributes[outFields[3]],
                        "siteName": feature.attributes[outFields[4]],
                        "street": feature.attributes[outFields[5]],
                        "cityStateZip": feature.attributes[outFields[6]],
                        "date": feature.attributes[outFields[7]],
                        "status": feature.attributes[outFields[8]],
                        "contact": feature.attributes[outFields[9]],
                        "phone": feature.attributes[outFields[10]],
                        "email": feature.attributes[outFields[11]]
                    };
                });
                if (data.length === 0) {
                    alert("No results found for '" + document.getElementById('qryBox').value + "'")
                }
                else {
                    var memStore = new Memory({ data: data });
                    window.grid.set("store", memStore);
                    window.grid.set("sort", [{ attribute: "eventID", descending: false }]);// workaround for dgrid not populating until grid was sorted}
                }
            });
        };
    });
    function populateGrid(Memory) {
        var qt = new QueryTask(opsURL);
        var query = new Query();
        query.where = "1=1";
        query.objectIds = [buffer.value];
        query.returnGeometry = false;
        query.outFields = ["*"];
        qt.execute(query, function (results) {
            var data = array.map(results.features, function (feature) {
                return {
                    // property names used here match those used when creating the dgrid
                    "id": feature.attributes[outFields[0]],
                    "facility": feature.attributes[outFields[2]],
                    "eventID": feature.attributes[outFields[3]],
                    "siteName": feature.attributes[outFields[4]],
                    "street": feature.attributes[outFields[5]],
                    "cityStateZip": feature.attributes[outFields[6]],
                    "date": feature.attributes[outFields[7]],
                    "status": feature.attributes[outFields[8]],
                    "contact": feature.attributes[outFields[9]],
                    "phone": feature.attributes[outFields[10]],
                    "email": feature.attributes[outFields[11]]
                };
            });
            var memStore = new Memory({ data: data });
            window.grid.set("store", memStore);
            window.grid.set("sort", [{ attribute: "eventID", descending: false }]);// workaround for dgrid not populating until grid was sorted}
            map.setExtent((circleExtent).expand(1.3));
        });
    };
    grid.on(".dgrid-row:click", selectOps);
    //Select feature on map from dgrid
    function selectOps(e) {
        var row = grid.row(e);  // function variables
        var qt = new QueryTask(window.opsURL);
        var query = new Query();
        query.outFields = ["*"]; // the query
        query.returnGeometry = true;
        query.objectIds = [row.data.id];
        opsMap.queryFeatures(query, function (results) {
            var firstFeature = results.features[0];
            window.map.infoWindow.hide();
            window.map.infoWindow.clearFeatures();
            window.map.infoWindow.show(firstFeature.geometry);
            window.map.infoWindow.setFeatures([firstFeature]);
            window.map.centerAt(firstFeature.geometry);
        });
    }
    $('#clearBtn').click(function () {
        map.graphics.clear();
        var memStore = new Memory({ data: data });
        window.grid.set("store", memStore);
        map.setZoom(7);
    });
    $('#clearDgrid').click(function () {
        var memStore = new Memory({ data: data });
        window.grid.set("store", memStore);
    });
    $('#findBtnGeo').click(function () {
        geocoder.startup();
        geocoder.on("select", showLocation);

    });
});