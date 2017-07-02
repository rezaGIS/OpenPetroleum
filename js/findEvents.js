function findEvents() {
    require([
    /*--ESRI--*/
    "esri/map",
    "esri/tasks/query",
    "esri/tasks/QueryTask",
    "esri/dijit/Search",
    "esri/geometry/Circle",
    "esri/geometry/Point",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/Color",
    "esri/graphic",
    /*--Dojo--*/
    "dojo/store/Memory",
    "dojo/_base/array",
    "dojo/dom-construct",
    "dojo/promise/all"
    ], function (
     /*--ESRI--*/
     Map,
     Query,
     QueryTask,
     Search,
     Circle,
     Point,
     SimpleMarkerSymbol,
     SimpleFillSymbol,
     SimpleLineSymbol,
     Color,
     Graphic,
     /*--Dojo--*/
     Memory,
     array,
     domConstruct,
     all
     ) {
        //var geocode = new Search({
        //    map: map,
        //    maxResults: 4,
        //    countryCode: "US",
        //    suffix: "CO"

        //}, "search");
        //geocode.startup();

        //geocode.on("select-result", showLocation);
        
        var queryOps = new Query();
        /*-- Query features --*/
        function findFeatures() {
            DEBUG && console.log("Find features beginning.")
            var taskPromise = [];
            var tempStore = [];
            opsQueryDictionary.map(function (results) {
                DEBUG && console.log("Searching for '" + results.name + "', URL:'" + results.url + "'");
                var queryClickTask = new QueryTask(results.url);
                taskPromise = queryClickTask.execute(queryOps).then(function (ops) {
                    //DEBUG && console.log(ops[0].features.attributes["Facility_ID"]);
                    for (var i = 0; i < ops.features.length; i++) {
                        tempStore.push(ops.features[i]);
                        //console.log(tempStore);
                    }
                    //tempStore = ops[0].attributes["Site_Name"]
                    //console.log(tempStore)
                    //return tempStore.push(ops.features.length);
                }, function (e) {
                    console.log(e);
                });
                
            });         
            var newPromise = new all([tempStore, taskPromise]);
            newPromise.then(function () {
                console.log(tempStore.features)
                var data = array.map(tempStore.features, function (feature) {
                    
                    return {
                //        // property names used here match those used when creating the dgrid
                //        "id": tempStore.features.attributes[outFields[6]]
                //        //"facility": feature.attributes[outFields[2]],
                        "eventID": feature.attributes[outFields[0]],
                //        //"siteName": feature.attributes[outFields[6]],
                //        //"street": feature.attributes[outFields[6]],
                //        //"cityStateZip": feature.attributes[outFields[6]],
                //        //"date": feature.attributes[outFields[6]],
                //        //"status": feature.attributes[outFields[6]],
                //        //"contact": feature.attributes[outFields[6]],
                //        //"phone": feature.attributes[outFields[6]],
                //        //"email": feature.attributes[outFields[6]]
                    };
                });
                console.log(data);
                var memStore = new Memory({ data: data });
                window.grid.set("store", memStore);
                window.grid.set("sort", [{ attribute: "eventID", descending: false }]);// workaround for dgrid not populating until grid was sorted}
                map.setExtent((circleExtent).expand(1.3));

            })
        }
        map.on("click", function mapSearch(evt) {
            //map.graphics.clear();
            /*-- Collects and stores pointer xy for use --*/
            var promises;
            var xPointer = evt.mapPoint.getLatitude();
            var yPointer = evt.mapPoint.getLongitude();
            var xyPointer = ([yPointer, xPointer]);
            DEBUG && console.log("Cursor coordinates= x:" + xPointer + " ;y:" + yPointer)
            /*--Create circle graphic for visual--*/
            var buffDist = document.getElementById('bufferDist').value;
            var circleSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_NULL,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SHORTDASHDOTDOT,new Color([105, 105, 105]), 2), new Color([255, 255, 0, 0.25]));
            circle = new Circle({
                center: xyPointer,
                geodesic: true,
                radius: buffDist,
                radiusUnit: "esriMiles"
            });
            circleExtent = circle.getExtent();
            //map.setExtent((circleExtent).expand(1.3)); might want to move this after query is complete -- maybe not tho could be confusing
            var graphic = new Graphic(circle, circleSymbol);
            map.graphics.add(graphic);
            queryOps.geometry = circleExtent;
            queryOps.returnGeometry = true;
            queryOps.outFields = ["*"];
            findFeatures();
            })
            
        });
    };
