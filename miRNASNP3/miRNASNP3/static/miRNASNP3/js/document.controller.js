'use strict';

angular.module('miRNASNP3')
    .controller('DocumentController', DocumentController);

function DocumentController($scope) {
    console.log("DocumentController loaded");
    function removeClasshtml(){
        $("#intro").css({"backgroundColor":"","color":"darkred"});
        $("#qs").css({"backgroundColor":"","color":"darkred"});
        $("#ds").css({"backgroundColor":"","color":"darkred"});
    }
    
    $scope.gotoAnchor = function(x){
      var newHash = 'anchor' + x;
			var id = $location.hash();
      if ($location.hash() !== newHash) {
        // set the $location.hash to `newHash` and
        // $anchorScroll will automatically scroll to it
        $location.hash('anchor' + x);
				$anchorScroll();
				$location.hash(id);
      } else {
        // call $anchorScroll() explicitly,
        // since $location.hash hasn't changed
        $anchorScroll();
      }
      switch(x){
          case 1: 
          removeClasshtml();
          $("#intro").css({"backgroundColor":"#0088cc","color":"GhostWhite"});
          break;
          case 2:
          removeClasshtml();
          $("#qs").css({"backgroundColor":"#0088cc","color":"GhostWhite"});
          break;
          case 3:
          removeClasshtml();
          $("#ds").css({"backgroundColor":"#0088cc","color":"GhostWhite"});
          break;
          case 4:
          removeClasshtml();
          $("#dl").css({"backgroundColor":"#0088cc","color":"GhostWhite"});
          break;
      }
    };
}