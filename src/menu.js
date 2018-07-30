angular
.module('devportal-json-menu')
.controller('MenuController', ["$scope", "$rootScope", "$window", "$http", "$stateParams", "$state", "$sce", "TokenFactory", function($scope, $rootScope, $window, $http, $stateParams, $state, $sce, TokenFactory) {
    const self = this;
    self.selectedTab = $stateParams.productType;
    console.log('self.selectedTab >>', self.selectedTab);
    self.setSelectedMenu = function(menuSelected){
        self.selectedTab = menuSelected;
    }
    
    $http.get('https://pitneybowes.oktapreview.com/api/v1/sessions/me', {withCredentials: true})
    .success(function (oktaData) {
        
        console.log("oktaData>>>> ", oktaData);
        let email = oktaData.login;
        let productType;
        
        if($rootScope.currentPortal == 'devPortal')
            productType = 'default';
        else{
            const userDetails = TokenFactory.getUserInfo();
            if(userDetails.user.subscriptions.validateaddress)
                productType = 'excelapp';
            else if(userDetails.user.subscriptions.validateaddressgsuite)   
                productType = 'gsuite'; 
        }     
        
        $http.get('/api/menu/build/'+email+'/mainMenu/'+$rootScope.currentPortal+'/'+productType)
        .then(function (res) {
            self.menuItems = res.data.main_menu;
            self.rightMenu = res.data.right_menu;
        }).catch(function (err) {
            console.log("Got getMenu Err :",err);
        });
    })
    .error(function (data) {
        console.log("Got getMenu Err jsnop:",data);
    });       

    self.renderHtml = function(html){
        return $sce.trustAsHtml(atob(html));
    }
}])
.directive('custommenu', function() {
    //define the directive object
    var directive = {};
    
    //restrict = E, signifies that directive is Element directive
    directive.restrict = 'E';
    
    //template replaces the complete element with its text. 
    directive.templateUrl = "bower_components/devportal-json-menu/views/menu.html";
    directive.controller  = 'MenuController';
    directive.controllerAs= 'MenuCtrl';
        
    //compile is called during application initialization. AngularJS calls it once when html page is loaded.
     
    directive.compile = function(element, attributes) {
       //linkFunction is linked with each element with scope to get the element specific data.
       var linkFunction = function($scope, element, attributes) {
       }
       return linkFunction;
    }

    return directive;
 });