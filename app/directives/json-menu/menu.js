app.directive('custommenu', function() {
    //define the directive object
    var directive = {};
    
    //restrict = E, signifies that directive is Element directive
    directive.restrict = 'E';
    
    //template replaces the complete element with its text. 
    directive.templateUrl = "views/menu.html";
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