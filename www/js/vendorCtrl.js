angular.module('offTheTruck.vendorCtrl', [])

.controller('VendorCtrl', ['$scope', 'VendorAuth', 'Vendor', '$firebaseObject', function($scope, VendorAuth, Vendor, $firebaseObject){
  
  $scope.statusText = 'Not Serving';
  $scope.notEditable = true;

  $scope.vendorRef = new Firebase("https://offthetruck.firebaseio.com/Trucks/simplelogin:57");
  $scope.vendor = $firebaseObject($scope.vendorRef);

  $scope.vendor.$loaded().then(function(){
    $scope.setStatusText();

    console.log('VENDOR AUTH', VendorAuth.vendorAuthRef);
    console.log('vendor?', $scope.vendor);
    console.log('truckName', $scope.vendor.truckName);
  });




  // get the vendor's information to populate views with

  $scope.getTruckInfo = function(currentTruck){
    console.log('truck', truck);
  };

  // a function that toggles notEditable
  $scope.toggleEditable = function(){
    $scope.notEditable = $scope.notEditable ? false : true;
  };

  // set a vendor's information
  $scope.saveProfile = function(){
    // pass this to factory. if it's succesful, communicate success if error, tell user and log it
    Vendor.updateTruck($scope.vendor);
    $scope.toggleEditable();
  };

  $scope.setStatusText = function(){

    console.log('vendor', $scope.vendor);
    // check isServing
    // set status text accordingly
    if($scope.vendor.isServing){
      $scope.statusText = 'Serving';
    } else {
      $scope.statusText = 'Not Serving';
    }
  };

  // updates the status of the vendor
  $scope.updateIsServing = function(){
    if ($scope.vendor.isServing) {
      Vendor.getLocation($scope.vendor);
    } else {
      Vendor.stopServe($scope.vendor);
    }
    $scope.setStatusText();
  };

  // method to set start time   
  // method to set end time
  // method to set map

}]);
