// Hides/Shows Map and Form
$('#showMap').on('click', function() {
    hideShow();
});

function hideShow() {
    if ($('#showMap').val() == "Show Map") {   
        $('h2').hide();
        $("#user-request-form").hide();
        $('#map-container, #map-canvas').show();
        $('#showMap').val('Hide Map');
    } else {
        $('h2').show();
        $('#map-container, #map-canvas').hide();
        $('#user-request-form').show();
        $('#showMap').val('Show Map');
    }
}

// google.maps.visualRefresh = true;

//get user lat/lng and set to local storage

function userPos() {
	if (navigator.geolocation) {
	    navigator.geolocation.getCurrentPosition(function(position) {
			var user_lat = position.coords.latitude;
			var user_lng = position.coords.longitude;
			localStorage.setItem('user_lat', position.coords.latitude);
			localStorage.setItem('user_lng', position.coords.longitude);
			console.log("user_lat:"+user_lat);
			console.log("user_lng:"+user_lng);
			console.log(user_lat, user_lng);
		});
	} else {
	// // SORRY, Geolocation is not supported
    }
}
userPos();

var geocoder;
var map;
var infowindow = new google.maps.InfoWindow();
var marker;
var user_lat = user_lat;
var user_lng = user_lng
;
var results = localStorage.getItem('results');
var newresults = localStorage.getItem('newresults');
console.log(user_lat);
console.log(user_lng);
console.log(results);

//build map based on user lat/lng
function initialize() {
  geocoder = new google.maps.Geocoder();
  console.log(geocoder);
  var latlng = new google.maps.LatLng(user_lat,user_lng);
  var mapOptions = {
    zoom: 15,
    center: latlng,
    mapTypeId: 'roadmap'
  }
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  //set autocomplete for dropoff location
  var input = /** @type {HTMLInputElement} */(document.getElementById('searchTextField'));
  var autocomplete = new google.maps.places.Autocomplete(input);
	google.maps.event.addListener(autocomplete, 'place_changed', function() {
		infowindow.close();
		marker.setVisible(false);
		input.className = '';
		var place = autocomplete.getPlace();
    // Inform the user that the place was not found and return.
    if (!place.geometry) {
		  input.className = 'notfound';
		  return;
	}

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(15);  // Why 17? Because it looks good.
    }
    marker.setIcon(/** @type {google.maps.Icon} */({
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(35, 35)
    }));
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);

    //show autocomplete address results
    var address = '';
    if (place.address_components) {
      address = [
        (place.address_components[0] && place.address_components[0].short_name || ''),
        (place.address_components[1] && place.address_components[1].short_name || ''),
        (place.address_components[2] && place.address_components[2].short_name || '')
      ].join(' ');
      console.log(address);
    }

    infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
    infowindow.open(map, marker);
  });

}
 initialize();

//reverse geocode user lat/lng for address
function codeLatLng() {
  var lat = parseFloat(user_lat);
  console.log(lat);
  var lng = parseFloat(user_lng);
  console.log(lng);
  var latlng = new google.maps.LatLng(lat, lng);
  console.log(latlng);
  geocoder.geocode({'latLng': latlng}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      if (results[0]) {
        map.setZoom(15);
        marker = new google.maps.Marker({
            position: latlng,
            map: map,
            draggable: true  
        });
        infowindow.setContent(results[0].formatted_address);
        infowindow.open(map, marker);
        console.log(results[0]);
        console.log(results[0].formatted_address);
        localStorage.setItem('results', results[0].formatted_address);
      } /*else {
        alert('No results found');
      } */
    } else {
      alert('Geocoder failed due to: ' + status);
    }

    google.maps.event.addListener(marker, 'dragend', function(event) {
      geocoder.geocode({'latLng': event.latLng}, function(newresults, newstatus) {
      console.log('new position is '+event.latLng.lat()+','+event.latLng.lng());
      console.log(event.latLng.lat());
      var lat = parseFloat(event.latLng.lat());
      console.log(lat);
      var lng = parseFloat(event.latLng.lng());
      console.log(lng);
      var newLatLng = new google.maps.LatLng(lat, lng);
      console.log(newLatLng);
        if (newstatus == google.maps.GeocoderStatus.OK) {
          if (newresults[0]) {
              map.setZoom(15);
              marker = new google.maps.Marker({
                  position: newLatLng,
                  map: map,
                  draggable: true  
              });
              marker.setTitle(newresults[0].formatted_address);
              infowindow.setContent(newresults[0].formatted_address);
              infowindow.open(map, marker);
              console.log(newresults[0]);
              console.log(newresults[0].formatted_address);
              localStorage.setItem('newresults', newresults[0].formatted_address);
          } else {
            alert('No results found');
          }
        } else {
          alert('Geocoder failed due to: ' + newstatus);
        }
      });
    });
  });
}
codeLatLng();

google.maps.event.addDomListener(window, 'load', initialize);


$(document).ready( function() {
	console.log(results);
	//set user location to form field
  $('#pickup-loc').val(results);
  // newresults.onchange = function{
  //   if(results == newresults){
  // 		$('#pickup-loc').val(results);
  //   } else {  
  //     $('#pickup-loc').on(newresults);
  //   }
  // }  
});

//Formats Passenger and Vehicle Menus
$(document).ready(function() {
    $('.selectpicker').selectpicker();
//    $('.datepicker').datepicker({
//        format: 'mm-dd-yyyy'
//    });
});


//Hides Map on Window Load
window.onload = function() {
    $('#map-container, #map-canvas').hide();
}