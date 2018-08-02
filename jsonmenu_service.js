/**
 * @preserve Created by NEX22DX on 04-05-2016.
 */

app.service("Jsonmenu",["$http", function ($http) {
	
	this.checkSession = function(email, menuType){
        return $http.get('https://pitneybowes.oktapreview.com/api/v1/sessions/me', {withCredentials: true});
    }
	
    this.getMenu = function(email, menuType, portalType, productType){
        return $http.get('/api/menu/build/'+email+'/'+menuType+'/'+portalType+'/'+productType);
    }
}]);
