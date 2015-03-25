/*This module is our main app module.
the 2nd parameter is an array of 'requires', as per Angular syntax.*/
angular.module('offTheTruck', [
  'ionic',
  'firebase',
  'offTheTruck.factories',
  'offTheTruck.mapFactory',
  'offTheTruck.mapCtrl',
  'offTheTruck.userCtrl'
  ])

/*The .run functionality is boilerplate that OffTheTruck imported when following the ionic 
getting started guide.*/

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

/*This is the main functionality that controls 'states' in Ionic / Angular.
This can be thought of as different 'pages' if you were in the context of a standard html/js website.
You can see some define the view controller here, everywhere else it's defined in the html.*/
.config(function($stateProvider, $urlRouterProvider){
  $stateProvider
  .state('main', {
    url: '/main',
    templateUrl: 'view/main.html'
  })
  .state('signup', {
    url:'/signup',
    templateUrl: 'view/signup.html'
  })
  .state('user', {
    url: '/user',
    templateUrl: 'view/user-tabs.html'
  })
  .state('user.home', {
    url: '/home',
    views: {
      'home':{
        templateUrl: 'view/user-main.html',
        controller: 'mapCtrl'
      }
    }
  })
  .state('login', {
    url:'/login',
    templateUrl: 'view/login.html',
    controller: 'UserController'
  })
  .state('vendor', {
    url: '/vendor',
    templateUrl: 'view/vendor-main.html',
    controller: 'VendorCtrl'
  })
  .state('vendor-settings', {
    url: '/vendor-settings',
    templateUrl: 'view/vendor-settings.html',
    controller:  'VendorCtrl'
  });
  /*This is defining the standard view. If there is an error or if the view is not otherwise
  specified, the app will point the visitor to main.*/
  $urlRouterProvider.otherwise('/main');
})

// This controller manages adding a new user to our firebase, which is located at the url below.
.controller('TruckController', ['$scope', '$firebaseObject', 'Map',  
  function($scope, $firebaseObject, Map) {
     /*Scope.user allows us to take information from the models on the html file and have access
     to them here in our JS file*/

     $scope.user = {};
     
     //Declaring a 'new' Firebase reference is the syntax for interacting with a firebase database
     var ref = new Firebase("https://offthetruck.firebaseio.com/Trucks");

     var obj = $firebaseObject(ref);

     $scope.trucks = obj;


     // Recenter the Google Map on the truck's position when a user clicks on the truck's name in the list of trucks in the User main view
     $scope.centerMap = function(truck) {
       // Call the recenterMap method from the mapCtrl controller
       console.log('Inside the centerMap method');
       console.log('lat: ' + truck.lat + ' lng: ' + truck.long);
       Map.recenterMap(truck.lat, truck.long);
     };

   }])

/*This controller manages the longitute and latitude properties of our truck objects in firebase*/
.controller('TruckLocation', ['$scope', '$firebaseObject', 'User', 'Truck', '$state',
  function($scope, $firebaseObject, User, Truck, $state) {
    //This 'new firebase' syntax is how you allow a controller to interact with a firebase database
    var ref = new Firebase("https://offthetruck.firebaseio.com/Trucks");
    /*This is how we gain reference to the specific user who is logged into our app.
    We save this value in our factory.js file*/
    var loggedInTruck = User.uid;
    //the current truck is the firebase object, referencing by calling ref.child
    var currentTruck = ref.child(loggedInTruck);
    $scope.truckname = Truck.name;

    /*This function uses Google map code to find lat / long by referencing the device's GPS*/
    $scope.getLocation = function(){
      navigator.geolocation.getCurrentPosition(function(pos) {
        //This line updates the firebase truck object with the longitute and latitude of the user
        currentTruck.update({
          isServing: true,
          long: pos.coords.longitude,
          lat: pos.coords.latitude
        });
      });

    //  Once location is updated, we redirect the user to the home view
    $state.go('user.home');    
    };

    /*this function updates the isServing property on the firebase object to false.
    The result is that the map functionality elsewhere will remove the truck icon from the map*/
    $scope.stopServe = function(){
      currentTruck.update({
        isServing: false
      });
    };
}]);
