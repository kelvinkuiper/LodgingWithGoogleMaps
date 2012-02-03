
var loadResults = function(position) {
    /* DOM elements */
    var mapElement = $('#map');
    var detailsList = $("#detailsList");

    /* Google Maps API */
    var myOptions = {
        disableDefaultUI: false,
        zoom: 13,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        panControl: false,
        rotateControl: false,
        scaleControl: false,
        scrollwheel: false,
        draggable: false
    };
    var map = new google.maps.Map(document.getElementById("map"), myOptions);

    /* current position */
    var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    /* put a marker on current position */
    var marker = new google.maps.Marker({
        position: latlng,
        map: map
    });

    /* places API */
    var places = new google.maps.places.PlacesService(map);
    var placesRequest = {
        location: latlng,
        radius: 5000,
        types: ["lodging"]
    };

    /* eventHandlers */
    var listItemOnClick = function(listItem, itemLatlng, itemMarker) {
        listItem = $(listItem);
        //map.setCenter(itemLatlng);
        $.mobile.changePage('map.html', {
            role: itemLatlng
        })
    }
    places.search(placesRequest, function(results, status) {
        if (status != google.maps.places.PlacesServiceStatus.OK) return;

        $.each(results, function(i, item) {
            if (item.geometry) {

                var itemLatlng = new google.maps.LatLng(item.geometry.location.lat(), item.geometry.location.lng());
                var itemMarker = new google.maps.Marker({
                    position: itemLatlng,
                    map: map,
                    icon: "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld="+(i+1)+"|53d4ff|000000"
                });

                var listItem = $("<li></li>").html('<a>' + item.name + '</a>').tap(function(event){
                    listItemOnClick(this, itemLatlng, itemMarker);
                }).appendTo(detailsList);

                detailsList.listview('refresh');
            };

        });
    });
};

var getLocation = function() {
    var suc = function(p) {
        alert(p.coords.latitude + " " + p.coords.longitude);
    };
    var locFail = function() {
    	alert('Locatie kon niet worden gevonden');
    };
    navigator.geolocation.getCurrentPosition(suc, locFail);
};

function roundNumber(num) {
    var dec = 3;
    var result = Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
    return result;
}
var preventBehavior = function(e) {
    e.preventDefault();
};

var currentWatch;

function watchLocation(successCallback, errorCallback) {
  successCallback = successCallback || function(){};
  errorCallback = errorCallback || function(){};

  // Try HTML5-spec geolocation.
  var geolocation = navigator.geolocation;

  if (geolocation) {
    // We have a real geolocation service.
    try {
      function handleSuccess(position) {
        successCallback(position);
      }

      currentWatch = geolocation.watchPosition(handleSuccess, errorCallback, {
            enableHighAccuracy: true,
            maximumAge: 1000000,
            timeout: 150000
      });
    } catch (err) {
      errorCallback();
    }
  } else {
    errorCallback();
  }
}
