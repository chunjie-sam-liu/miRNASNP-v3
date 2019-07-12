"use strict";

angular.module('miRNASNP3')
    .controller('PremirDetailController', PremirDetailController);

function PremirDetailController($scope,$routeParams,$http,$filter) {
    console.log("PremirDetailController loaded");
    //$scope.search_ids='hsa-mir-99b';
    $scope.search_ids=$routeParams.search_ids;
    $scope.fetch_premir=function(){
        $http({
            url:'/api/premir_info',
            method:'Get',
            params:{search_ids:$scope.search_ids}
        }).then(function (response) {
            console.log(response);
                $scope.premir_info = response.data.premir_info[0];
                var container = new fornac.FornaContainer("#rna_ss", {'applyForce': true,'allowPanningAndZooming':true,'initialSize':[300,300]});
                //var options = {'sequence':$scope.premirinfo[0].harpin_seq};
                var options = {
                    'structure': $scope.premir_info.dotfold,
                    'sequence': $scope.premir_info.sequence,
                    'color': '1-10:green 15-30:red'};
                container.addRNA(options.structure, options);
        });
    };
    $scope.fetch_premir();
}