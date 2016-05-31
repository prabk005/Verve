// Retrieve JSON data by HTTP GET request.
var http = new XMLHttpRequest();
var url = "http://cls.vrvm.com/pois?id=5541&limit=10&latitude=37.7324&longitude=-121.8916";
var initLat = url.split("&")[2].split("=")[1];
var initLng = url.split("&")[3].split("=")[1];
console.log("Current Location: Latitude = " + initLat + " & Longitude = " + initLng);

http.onreadystatechange = function() {
  if (http.readyState == 4 && http.status == 200) {
    var data = JSON.parse(http.responseText);
    myFunction(data);
  }
};
http.open("GET", url, true);
http.send();

// Create an array for the location labels on the map.
var labels = ["A","B","C"];

// Retrieve the JSON data and display it on the HTML page.
function myFunction(data) {
  //var img = document.getElementById("logo").style.float = 'right';
  var container = "";
  console.log("DATA..........",data);
  // Slice the data so that we only loop through the first 3 locations.
  var pois = data.pois.slice(0,3);
  console.log("3 NEAREST lOCATIONS: ", pois);
  for (var i=0 ; i < pois.length; i++){
    // Create an address template for the html page.
    container +=
    '<div class="labels">' + labels[i] + '</div>'+
    '<div class="innerDiv"><div class="address">'+ pois[i].address_1 + '</br>' + pois[i].city + ', '+ pois[i].region + ' '
    + pois[i].postal_code + '-' + pois[i].postal_code_id + '</div>' +
    '<div class="directions"><button class="directionBtn" onclick="getDirection('+ pois[i].latitude + ','+ pois[i].longitude +
    ')"><span>Get Directions</span></button></div></div>';
  }
  // Display the template in the "outerDiv".
  document.getElementById("outerDiv").innerHTML =  container ;
  // Call the initMap function and pass the data in the parameter.
  initMap(pois);
}

function getDirection(lat,lng){
  // Open the link for google maps in another tab.
  // Start points parsed from JSON url and end points passed from the location points.
  var directionsUrl = "https://www.google.ca/maps/dir/'" + initLat + "," + initLng + "'/+" + lat + ",+" + lng;
  console.log("Directions Link Clicked: ",directionsUrl);
  window.open(directionsUrl, '_black');
}

function initMap(pois) {
  var marker, i;
  var infowindow = new google.maps.InfoWindow();

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: new google.maps.LatLng(pois[0].latitude,pois[0].longitude),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  for (i = 0; i < pois.length; i++) {
    // Adds markers to the map.
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(pois[i].latitude, pois[i].longitude),
      map: map,
      label: labels[i],
      // Template for the address in the infoWindow.
      infowindow: new google.maps.InfoWindow({
        content: "<div class='infoWindow'>" + pois[i].address_1 + ", " + pois[i].city + ", " + pois[i].region + ' '
        + pois[i].postal_code + '-' + pois[i].postal_code_id + "</div>"
      }),
      animation: google.maps.Animation.DROP
    });
    // Marker lister for click action.
    marker.addListener('click', markerClick);
  }
  function markerClick() {
    // Get Zoom level on the map and increase zoom by 1 for every click.
    map.setZoom(map.getZoom()+ 1);
    // Get the position for the marker clicked and center on that position
    map.setCenter(this.getPosition());
    // Show Address in the infowindow for the marker clicked.
    this.infowindow.open(map, this);
  };
}
