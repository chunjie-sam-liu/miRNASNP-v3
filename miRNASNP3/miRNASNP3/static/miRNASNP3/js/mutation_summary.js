"use strict";

angular.module('miRNASNP3')
    .controller('MutationSummaryController', MutationSummaryController);

function MutationController($scope,$routeParams,$http,$filter) {
    console.log("MutationSummaryController loaded");
    var page=1;
    $scope.fetch_mutation_summary=function(page){
        $http({
            url:'/api/cosmicinfo',
            method:'Get',
            params:{search_ids:'summary',page:page}
        }).then(function(response){
            $scope.cosmic_list=_response.data.cosmic_list;
            $scope.cosmic_count=response.data.data_length
        })
    };
    $scope.fetch_mutation_summary()
}
