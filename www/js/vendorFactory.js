angular.module('offTheTruck.vendorFactory', [])

.factory('Vendor', [function(){
  
  return {
    getLocation: function(currentTruck){
      console.log('currentTruck', currentTruck);
      navigator.geolocation.getCurrentPosition(function(pos) {

        currentTruck.long = pos.coords.longitude;
        currentTruck.lat = pos.coords.latitude;
        
        //This line updates the firebase truck object with the longitute and latitude of the user
        currentTruck.$save().then(function(){
          console.log('saved!');
        }, function(error){
          console.error(error);
        });
      });
    },

    updateTruck: function(currentTruck){
      currentTruck.$save();
    }
  };

}]);