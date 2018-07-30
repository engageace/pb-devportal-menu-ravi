/**
 *  Created by NEX9FNL on 06-09-2016.
 */
const MenuController = (function () {
    return function ($scope, $rootScope, $window, Jsonmenu, $stateParams, $state, $sce, TokenFactory) {
        const self = this;
        self.selectedTab = $stateParams.productType;
		console.log('self.selectedTab >>', self.selectedTab);
		self.setSelectedMenu = function(menuSelected){
			self.selectedTab = menuSelected;
		}
		
        Jsonmenu.checkSession()
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
            
            Jsonmenu.getMenu(email, 'mainMenu', $rootScope.currentPortal, productType).then(function (res) {
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
    }
})();

MenuController.$inject = ["$scope", "$rootScope", "$window", "Jsonmenu", "$stateParams", "$state", "$sce", "TokenFactory"];
app.controller("MenuController", MenuController);