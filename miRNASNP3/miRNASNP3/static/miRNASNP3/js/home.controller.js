"use strict";

angular.module('miRNASNP3')
    .controller('HomeController', HomeController);

function HomeController($scope,$http,$rootScope,$window) {
    console.log("HomeController loaded");
    var snp_pattern=/^rs[0-9]*/;
    var mir_pattern=/^hsa/;
    var mutation_pattern=/[a-z]/;
    var gene_pattern=/[a-z]/;

    $scope.search_query = function () {
        $rootScope.search_ids = $scope.search_ids
        $scope.$watch('search_ids',function (newVal) {
            if(newVal==""){
                window.alert("Enpty input")
            }
            else if(snp_pattern.test(newVal)){
                window.open("#!/search_summary","_parent")
            }
            else if (mir_pattern.test(newVal)){
                window.open("#!/search_summary_mir","_parent")
            }
        })
    }
}


