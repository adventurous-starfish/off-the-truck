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

  return {
    // Provide the Google map
    getMap: function() {
      return map;
    },

    // Recenter the map for the provided latitude and longitude
    recenterMap: function(latitude, longitude){
      console.log('lat: ' + latitude + ' lng: ' + longitude);
      map.setCenter({lat: latitude, lng: longitude});
    },

    populateTruckInfo: function(marker, message) {
      google.maps.event.addListener(marker, 'click', function(){
      
        if(infoWindow){
          infoWindow.close();
        }
          
        infoWindow = new google.maps.InfoWindow({
          content:message
        });
          
        infoWindow.open(map, marker);
      });
    }

  };

});
