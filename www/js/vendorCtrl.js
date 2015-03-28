angular.module('offTheTruck.vendorCtrl', [])

.controller('VendorCtrl', ['$scope', 'VendorAuth', 'Vendor', '$firebaseObject', function($scope, VendorAuth, Vendor, $firebaseObject){
  
  $scope.statusText = 'Not Serving';
  $scope.checkinText = 'Check In';
  $scope.notEditable = true;

  // set up a watch to listen for when uid in factory changes
  // once uid is changed (from null to an actual logged-in user),
  // get the vendor's information from Firebase.
  //
  // The first function passed to $watch is our listener. The second
  // is what we want to do on change.
  // $scope.$watch(function($scope){
  //   return $scope.uid;
  // },function(newUid){
  //   console.log('newUid', newUid);
  //   $scope.vendorRef = new Firebase("https://offthetruck.firebaseio.com/Trucks/" + newUid);
  //   $scope.vendor = $firebaseObject($scope.vendorRef);        
  // });

  $scope.vendorRef = new Firebase("https://offthetruck.firebaseio.com/Trucks/simplelogin:67");
  $scope.vendor = $firebaseObject($scope.vendorRef);        

  $scope.vendor.$loaded().then(function(){
    $scope.setStatusText();
    // console.log('VENDOR AUTH', VendorAuth.vendorAuthRef);
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
    // check isServing
    // set status text accordingly
    if($scope.vendor.isServing){
      $scope.statusText = 'Serving';
      $scope.checkinText = 'Check Out';
    } else {
      $scope.statusText = 'Not Serving';
      $scope.checkinText = 'Check In';
    }
  };

  // updates the status of the vendor
  $scope.updateIsServing = function(){
    if ($scope.vendor.isServing) {
      Vendor.getLocation($scope.vendor);
    } else {
      Vendor.updateTruck($scope.vendor);
    }
    $scope.setStatusText();
  };

  // method to set start time   
  // method to set end time
  // method to set map

}]);
