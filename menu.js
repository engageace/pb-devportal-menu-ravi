(function () {
    // 'use strict';
     angular
     .module('devportal-json-menu', [])
     .controller('MenuController', MenuController)
     .directive('custommenu', menuDirective);
 


    function menuDirective() {
        //define the directive object
        var directive = {};
        
        //restrict = E, signifies that directive is Element directive
        directive.restrict = 'E';
        
        //template replaces the complete element with its text. 
        directive.template = '<div id="main-navbar" pb-mobile-menu-close="" class="collapse navbar-collapse">'+
        '  <ul class="nav navbar-nav">'+
        '    <li class="divider-vertical hidden-xs"></li>'+
        '    <li ng-repeat="menuItem in MenuCtrl.menuItems" class="dropdown"><a data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false" ng-class="{\'selected-tab\': (MenuCtrl.selectedTab == menuItem.menuSelected)}" class="dropdown-toggle">{{menuItem.name}}</a>'+
        '      <ul class="dropdown-menu pb-animate-menu">'+
        '        <li ng-repeat="subMenu in menuItem.subMenu"><a target="{{subMenu.target}}" href="{{subMenu.href}}" ng-click="MenuCtrl.setSelectedMenu(menuItem.menuSelected)" subMenu.attributes="subMenu.attributes">{{subMenu.name}}</a></li>'+
        '      </ul>'+
        '    </li>'+
        '  </ul>'+
        '  <!-- start right menus-->'+
        '  <ul id="headerright-devportal" class="nav navbar-nav navbar-right">'+
        '    <!-- Help menu-->'+
        '    <li class="divider-vertical hidden-xs"> </li>'+
        '    <li ng-repeat="menuItem in MenuCtrl.rightMenu" class="dropdown">'+
        '      <a href="{{menuItem.href}}" data-toggle="{{menuItem.dataToggle}}" {{menuItem.attributes}}="{{menuItem.attributes}}" ng-class="{\'selected-tab\': (MenuCtrl.selectedTab == menuItem.menuSelected)}"> '+
        '        <span ng-if="menuItem.type == \'text\'">{{menuItem.name}}</span>'+
        '        <span ng-if="menuItem.type == \'html\'" ng-bind-html="MenuCtrl.renderHtml(menuItem.htmlCode)"></span>'+
        '      </a>'+
        '      <ul class="dropdown-menu pb-animate-menu">'+
        '        <li ng-repeat="subMenu in menuItem.subMenu">'+
        '          <a target="{{subMenu.target}}" href="{{subMenu.href}}" ng-click="MenuCtrl.setSelectedMenu(menuItem.menuSelected)" subMenu.attributes="subMenu.attributes">'+
        '            {{subMenu.name}}'+
        '          </a>'+
        '        </li>'+
        '        <li ng-if="menuItem.dropdownMenu" style="width:250px;padding:20px;">'+
        '           <div ng-if="MenuCtrl.products.subscribed" class="mute" style="padding-bottom:10px;">My APIs</div>'+
        '           <span ng-repeat="s in MenuCtrl.products.subscribed">'+
        '               <span ng-if="menuItem.dropdownMenu[s].type == \'html\'" ng-bind-html="MenuCtrl.renderHtml(menuItem.dropdownMenu[s].htmlCode)"></span>'+
        '           </span>'+
        '           <hr>'+
        '           <div ng-if="MenuCtrl.products.notsubscribed" class="mute" style="padding-bottom:10px;">Developer Hub APIs</div>'+
        '           <span ng-repeat="ns in MenuCtrl.products.notsubscribed">'+
        '             <span ng-if="menuItem.dropdownMenu[ns].type == \'html\'" ng-bind-html="MenuCtrl.renderHtml(menuItem.dropdownMenu[ns].htmlCode)"></span>'+
        '           </span>'+
        '        </li>'+
        '      </ul>'+
        '    </li>'+
        '  </ul>'+
        '</div>';
        directive.controller  = 'MenuController';
        directive.controllerAs= 'MenuCtrl';
            
        //compile is called during application initialization. AngularJS calls it once when html page is loaded.
        
        var compilefun = function (element, attributes) {
            //linkFunction is linked with each element with scope to get the element specific data.
            return linkf;
        }
        
        compilefun.$inject = ["element", "attributes"];
    
        directive.compile = compilefun;

        return directive;
    }

    linkf.$inject = ["$scope", "element", "attributes"];
    
    function linkf($scope, element, attributes) {
    }

    MenuController.$inject = ["$rootScope", "$http", "$stateParams", "$sce"];

    function MenuController($rootScope, $http, $stateParams, $sce) {
        var self = this;
        self.selectedTab = $stateParams.productType;
        self.setSelectedMenu = function(menuSelected){
            self.selectedTab = menuSelected;
        }
        
        //let email = oktaData.login;
        var productType = 'default';
            
        if(typeof $rootScope.currentPortal === 'undefined') 
            $rootScope.currentPortal = 'devPortal';
        else if($rootScope.currentPortal === 'appPortal')
            productType = $rootScope.productType;

        $http.get('https://pitneybowes.oktapreview.com/api/v1/sessions/me', {withCredentials: true})
        .then(function(response) {
			let email = (typeof response.data !== 'undefined' && typeof response.data.login !== 'undefined') ? response.data.login : 'unauth';
            self.getmenu(email);
        }, function(response) {
            self.getmenu('unauth');
        });

        self.getmenu = function(login){
            $http.get('/api/menu/build/'+login+'/mainMenu/'+$rootScope.currentPortal+'/'+productType)
            .then(function (res) {
                self.menuItems = res.data.main_menu;
                self.rightMenu = res.data.right_menu;
                self.products = {
                    'subscribed':[],
                    'notsubscribed':[]
                }

                for(let key in res.data.hasProducts)
                    res.data.hasProducts[key] ? self.products['subscribed'].push(key) : self.products['notsubscribed'].push(key);

                console.log(self.products, '<<<<<<<<<<<<< self.countproducts');    
            }).catch(function (err) {
                console.log("Got getMenu Err :",err);
            });
        }

        self.renderHtml = function(html){
            return $sce.trustAsHtml(atob(html));
        }
    }
}());
}());