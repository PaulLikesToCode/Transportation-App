var geocoder;
var map;
var marker;
var infowindow = new google.maps.InfoWindow();
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
counter = 0;
var user_lat;
var user_lng;
var dropoff = "";

// Get user lat/lng position
function userPos(){
	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(
			function(position){
				user_lat = parseFloat(position.coords.latitude);
				user_lng = parseFloat(position.coords.longitude);
				codeLatLng(user_lat, user_lng);	
		});
	} else {
		alert("Geolocation is not supported or turned off");
	}
}
userPos();

//initialize map passing user lat/lng
function initialize(user_lat, user_lng){
	geocoder = new google.maps.Geocoder();
	directionsDisplay = new google.maps.DirectionsRenderer();
	var latlng = new google.maps.LatLng(user_lat,user_lng);
	var mapOptions = {
		zoom: 15,
		center: latlng,
		mapTypeId: 'roadmap'
	};
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	marker = new google.maps.Marker({
		position: latlng,
		map: map,
		draggable: true	
		});
	directionsDisplay.setMap(map);
}

//set autocomplete
function autoComplete(){
	var componentRestrictions = {country: 'us'};
	var pickup = (document.getElementById('pickup-loc'));
	var dropoff = (document.getElementById('dropoff-loc'));
	var autocomplete = new google.maps.places.Autocomplete(dropoff);
	autocomplete.setComponentRestrictions(componentRestrictions);
	google.maps.event.addListener(autocomplete, 'place_changed', function(){
		infowindow.close();
		dropoff.className = '';
		var place = autocomplete.getPlace();
		// advise if place not found
		if(!place.geometry){
			dropoff.className = 'notfound';
			return;
		}
		//if place has geommetry then show on map... working?
		if(place.geometry.viewport){
			map.fitBounds(place.geometry.viewport);
		} else {
			console.log("bounds?");
			map.setCenter(place.geometry.location);
			map.setZoom(17);
		}
		//custom drop off location icon
//		marker.setIcon(({
//			url: place.icon,
//			size: new google.maps.Size(65, 65),
//			origin: new google.maps.Point(0, 0),
//			anchor: new google.maps.Point(17, 34),
//			scaledSize: new google.maps.Size(35, 35)
//		}));
//		marker.setPosition(place.geometry.location);
//		marker.setVisible(true);
//		calcRoute();
		//autocomplete address components and set infowindow
		var address = "";
		if(place.address_components){
			address = [
				(place.address_components[0] && place.address_components[0].short_name || ""),
				(place.address_components[1] && place.address_components[1].short_name || ""),
				(place.address_components[2] && place.address_components[2].short_name || "")
			].join(" ");
		}
//		infowindow.setContent(address);
//		infowindow.open(map, marker);
	});
}
autoComplete();

//reverse geocoder user lat/lng to address
function codeLatLng(user_lat, user_lng){	
	geocoder = new google.maps.Geocoder();
	var latlng = new google.maps.LatLng(user_lat, user_lng);
	geocoder.geocode({'latLng': latlng}, function(results, status){
		if(status == google.maps.GeocoderStatus.OK){
			if(results[0]){
//				map.setZoom(15);
				var results = results[0].formatted_address;
//				infowindow.setContent(results);
//				infowindow.open(map, marker);
//				dragMarker(results);
				setAddr(results);
			} else {
				alert("No results found");
			}
		} else {
			console.log("Geocoder failed due to: "+status);
		}
	});
}

//event listener for dragging marker 
/*
function dragMarker(results){
	google.maps.event.addListener(marker, 'dragend', function(event){
		console.log('new position is '+event.latLng.lat()+','+event.latLng.lng());
		var lat = parseFloat(event.latLng.lat());
		console.log(lat);
		var lng = parseFloat(event.latLng.lng());
		console.log(lng);
		codeLatLng(lat,lng);	
	});
}
*/

//show optimal driving route on map
function calcRoute() {
    var start = document.getElementById('pickup-loc').value;
    var end = document.getElementById('dropoff-loc').value;
    var request = {
        origin:start,
        destination:end,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
    };
    directionsService.route(request, function(response, status) {
    	if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
        }
	});
}

//populate pickup location field
function setAddr(results){
	$('#pickup-loc').val(results);

}

// google.maps.event.addDomListener(window, 'load', initialize);


// Hides/Shows Map and Form
$('#showMap').on('click', function() {
	var dropoff = document.getElementById('dropoff-loc').value;
	console.log(dropoff);
	if (dropoff != '') {
		console.log('if');
		calcRoute();
		hideShow();
		marker.setVisible(false);
	} else {
    	hideShow();
    	console.log('else');
    }
});

function hideShow() {
    if ($('#showMap').val() == "Show Map" && counter == 0) {   
        $('#map-canvas').show();
        $('#showMap').val('Hide Map');
        initialize(user_lat, user_lng);
        $('h2').hide();
        $("#user-request-form").hide();
        counter++;
    } else if ($('#showMap').val() == "Show Map" && counter == 1) {
    	$('h2').hide();
        $("#user-request-form").hide();
        $('#map-canvas').show();
        $('#showMap').val('Hide Map');
    } else {
        $('h2').show();
        $('#map-canvas').hide();
        $('#user-request-form').show();
        $('#showMap').val('Show Map');
    }
}

//Formats Passenger and Vehicle Menus
$(document).ready(function() {
    $('.selectpicker').selectpicker();
//    $('.datepicker').datepicker({
//        format: 'mm-dd-yyyy'
//    });
});


//Hides Map on Window Load
window.onload= function() {
	$('#map-canvas').hide();
};