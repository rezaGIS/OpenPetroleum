﻿var DEBUG = true;

// Variables
var map;
var circle;
var grid;
var buffer = {
    value: []
}
var circleExtent;
var data = [];
var outFields = ["*"];
// Mapservices URL
var opsURL = "https://gis.colorado.gov/oit/rest/services/CDLE/OPs_Events_tiers/MapServer";

var opsQueryDictionary = [
    { name: "Open", url: "https://gis.colorado.gov/oit/rest/services/CDLE/OPs_Events_tiers/MapServer/0" },
    { name: "Tier1", url: "https://gis.colorado.gov/oit/rest/services/CDLE/OPs_Events_tiers/MapServer/2" },
    { name: "Tier2", url: "https://gis.colorado.gov/oit/rest/services/CDLE/OPs_Events_tiers/MapServer/3" },
    { name: "Tier3", url: "https://gis.colorado.gov/oit/rest/services/CDLE/OPs_Events_tiers/MapServer/4" },
    { name: "Tier4", url: "https://gis.colorado.gov/oit/rest/services/CDLE/OPs_Events_tiers/MapServer/5" },
    { name: "Others", url: "https://gis.colorado.gov/oit/rest/services/CDLE/OPs_Events_tiers/MapServer/6" }
];

// Mapservices variables
var opsMap;
// Pop-up
var infoTemplate;
var infoTemplateTitle = "<b>Release Event</b>";
var costisURL = "https://opus.cdle.state.co.us/OIS2000/event.asp?h_id=" + "${Event_ID}";
var popupData = "<b>Site Name:</b> ${Site_Name}</br>" + "<b>Event ID:</b> ${Event_ID}</br>" + "<b>Facility ID:</b> ${Facility_I}</br>" +
                "<b>Status:</b> ${Status}</br>" + "<b>Address:</b> ${Address}</br>" + "<b>City/State:</b> ${City_State}</br>" +
                "<b>Release Date:</b> ${Date_of_Re:DateFormat(selector: 'date', fullYear: true)}</br>" + "<b>Contact:</b> ${OPS_Contac}</br>" + "<b>Phone:</b> ${Phone}</br>" +
                "<b>Email:</b> ${Email}</br>" + "<b>COSTIS Link:</b> <a href=" + costisURL + " target='_blank'> Click Here!</a> </br>";