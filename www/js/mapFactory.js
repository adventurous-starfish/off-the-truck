angular.module('offTheTruck.mapFactory', [])
.factory('Map', function(){

  var myLatlng = new google.maps.LatLng(37.3000, -120.4833);

  var mapOptions = {
      center: myLatlng,
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  var infoWindow;

  var map = new google.maps.Map(document.getElementById("map-container"), mapOptions);

  /*Google navigator code to get position
  In the callback, 'pos' is the result of Google's 'getCurrentPosition method*/
  navigator.geolocation.getCurrentPosition(function(pos) {
      map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
      var myLocation = new google.maps.Marker({
          position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
          map: map,
          animation: google.maps.Animation.DROP,
          title: "My Location"
      });
  });

  return {
    // Provide the Google map
    getMap: function() {
      return map;
    },

    // Recenter the map for the provided latitude and longitude
    recenterMap: function(latitude, longitude){
      map.setCenter({lat: latitude, lng: longitude});
    },

    populateTruckInfo: function(marker, message) {
      google.maps.event.addListener(marker, 'click', function(){
      
        if(infoWindow){
          infoWindow.close();
        }
          
        // TODO: Populate InfoWindow with more Truck information from firebase
        infoWindow = new google.maps.InfoWindow({
          content:message
        });
          
        infoWindow.open(map, marker);
      });
    }

  };

});