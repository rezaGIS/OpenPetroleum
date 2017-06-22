// Variables
var map;
var circle;
var grid;
var buffer = {
    value: []
}
var circleExtent;
var data = [];
var outFields = ["OBJECTID", "Shape", "Facility_I", "Event_ID", "Site_Name", "Address", "City_State", "Date_of_Re", "Status", "OPS_Contac", "Phone", "Email"];
// Mapservices URL
var opsURL = "https://gis.co.gov/oitprod10/rest/services/CDLE/OPS_Events_sde/MapServer/0";
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
