// var Lat = 37.766396;
// var Lng = -122.452927;
var Lat;
var Lng; 
var position;
var startAddress = '';
var startCity = '';

//Gets User Location
function getLocation() {
    console.log("getLocation");
    if (navigator.geolocation) {
        console.log('if');
        navigator.geolocation.getCurrentPosition(function(position) {
            console.log('function');
            var latitude = position.coords.latitude;
            console.log(latitude);
        });
    } else {
        console.log("Your browser sucks.");
    }
}

function getLatLng(position) {
    console.log("getLatLng");
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    console.log(latitude);
}

//Builds Google Map
function getDynamicMap() {
    var center = new google.maps.LatLng(37,-122);
    var mapOptions = {
        zoom: 12,
        center: center,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        panControl: false,
        mapTypeControlOptions: {
            position: google.maps.ControlPosition.TOP_RIGHT
        },
        zoomControl: true,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.LARGE,
            position: google.maps.ControlPosition.TOP_RIGHT
        }
    };
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
}

google.maps.event.addDomListener(window, 'load', getDynamicMap);

//Saves Starting Address In Variable
$(document).ready(function() {
    $('input#startingAddress, input#startingCity').keyup(function() {
        startAddress = $('input#startingAddress').val();
        console.log(startAddress);
        startCity = $('input#startingCity').val();
        console.log(startCity);
    });
});


//Populates Destination Address With Starting Address
$('#destinationSame').change(function () {
    if ($('#destinationSame').attr('checked')) {
        $('input#endingAddress').val('');
        $('input#endingCity').val('');
        $('#destinationSame').attr('checked', false);
    } else {
        $('input#endingAddress').val(startAddress);
        $('input#endingCity').val(startCity);
        $('#destinationSame').attr('checked', true);
    }
});















