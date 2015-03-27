angular.module('offTheTruck.vendorFactory', [])

.factory('Vendor', [function(){
  
  return {
    getLocation: function(currentTruck){
      navigator.geolocation.getCurrentPosition(function(pos) {
        //This line updates the firebase truck object with the longitute and latitude of the user
        currentTruck.update({
          isServing: true,
          long: pos.coords.longitude,
          lat: pos.coords.latitude
        });
      });
    },

    stopServe: function(currentTruck){
      currentTruck.update({
        isServing: false
      });
    },

    updateTruck: function(currentTruck){
      currentTruck.update({
        truckName: currentTruck.truckName,
        email: currentTruck.email,
        url: currentTruck.url,
        description: currentTruck.description
      }, function(err){
        if (err){
          console.error("updateTruck error", err);
        }
      });
    }
  };

}]);