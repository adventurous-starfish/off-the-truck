//Map controller

angular.module('offTheTruck.mapCtrl', [])

.controller('mapCtrl', ['$scope', '$firebaseObject', function($scope, $firebaseObject){
  //We are storing the lat / long data in firebase, so we need reference to our firebase:
  var ref = new Firebase("https://offthetruck.firebaseio.com/Trucks");
  //Initialize the lat/long just in case
  var myLatlng = new google.maps.LatLng(37.3000, -120.4833);
  var infoWindow;

  /*This storage object keeps track of the trucks that should be on the map. This is an object
  that sits client side and is updated whenever Firebase is updated.*/
  var markerStorage = {};
  //The cute trucks we drop on the map instead of the standard Google marker
  var markerImg = './img/truckMarker40x27.png';
   
  var mapOptions = {
      center: myLatlng,
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  //This is how you create a new Google map
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

  /*This 'once' code initializes the map to show the trucks that are active and selling when the client
  first logs in.*/
  ref.once('value', function(snapshot){
    var data = snapshot.val();
    //loops through all objects in firebase to see which ones are active ('isSelling === true')
    for(var key in data){
      if(data[key].isServing){
        //Creates a new truckMarker and puts it on the map at the right location
        var truckMarker = new google.maps.Marker({
          position: new google.maps.LatLng(data[key].lat, data[key].long),
          map: map,
          animation: google.maps.Animation.DROP,
          title: data[key].truckname,
          icon: markerImg
        });

        /*Adds the Truck name to the pin, so when a user clicks it, they can see the truck name on the map
        Function is defined below.*/
        truckInfo(truckMarker, data[key].truckname);

        //Save the marker to the local storage on each client instance
        markerStorage[data[key].truckname] = truckMarker;
      }
    }
  });

  //A listener, to see if there are any changes to isServing
  ref.on('child_changed', function(changedObj){
    var data = changedObj.val();
    //Checks to see if the trucks is actively serving
    if(data.isServing){
      //Checks to see if it's already on the map and already in local client storage
      if(markerStorage[data.truckname]){
        //In this case, then, the only thing possible is the active truck changed positions.
        //Here we set it locally
        var position = new google.maps.LatLng(data.lat, data.long);
        //and then update our local storage using Google Marker's methods. This places it on the map.
        //This only takes a very specific data type, which is defined in 'var position' above
        markerStorage[data.truckname].setPosition(position);
      } else {
        //Otherwise we know that the Truck is serving but is not yet on our map. So we create a new marker:
        var truckMarker = new google.maps.Marker({
          position: new google.maps.LatLng(data.lat, data.long),
          map: map,
          animation: google.maps.Animation.DROP,
          title: data.truckname,
          icon: markerImg
        });
        //...and then add that marker to our local storage, which has the effect of adding it the map (see below)
        truckInfo(truckMarker, data.truckname);
        markerStorage[data.truckname] = truckMarker;
      }
    } else {
      //Otherwise we know that the truck is no longer serving and needs to be removed from our map
      if(markerStorage[data.truckname]){
        markerStorage[data.truckname].setMap(null);
        delete markerStorage[data.truckname];
      }
    }
  });
  
  //Gives our views access to the map data
  $scope.map = map;

  //These little windows pop up when a user clicks on the map icon on the map
  function truckInfo(marker, message){
    google.maps.event.addListener(marker, 'click', function(){
      if(infoWindow){
        infoWindow.close();
      }
      infoWindow = new google.maps.InfoWindow({
        content:message
      });
      infoWindow.open(map, marker);
    });
  };

  // Recenter the map for the provided latitude and longitude
  $scope.recenterMap = function(latitude, longitude){
    console.log('lat: ' + latitude + ' lng: ' + longitude);
    map.setCenter({lat: latitude, lng: longitude});
  };

}]);
