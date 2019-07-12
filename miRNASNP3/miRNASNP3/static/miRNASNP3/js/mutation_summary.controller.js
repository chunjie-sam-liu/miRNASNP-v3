"use strict";

angular.module('miRNASNP3')
    .controller('CosmicSummaryController', CosmicSummaryController);

function CosmicSummaryController($scope,$routeParams,$http,$filter) {
    console.log("CosmicSummaryController loaded");
    var page=1;
    $scope.fetch_cosmic_summary=function(page){
        $http({
            url:'/api/cosmicinfo',
            method:'Get',
            params:{search_ids:'summary',page:page}
        }).then(function(response){
            console.log(response);
            $scope.cosmic_list=response.data.cosmic_list;
            $scope.cosmic_count=response.data.data_length
        })
    };
    $scope.fetch_cosmic_summary(page)
}

angular.module('miRNASNP3')
    .controller('ClinvarSummaryController',ClinvarSummaryController);

function ClinvarSummaryController($scope,$routeParams,$http,$filter){
    console.log('ClinvarSummaryController loaded');
    var page=1;
    $scope.fetch_clinvar_summary=function(page){
        $http({
            url:'/api/clinvarinfo',
            method:'Get',
            params:{search_ids:'summary',page:page}
        }).then(function(response){
            console.log(response);
            $scope.clinvar_list=response.data.clinvar_list;
            $scope.clinvar_count=response.data.data_length
        })
    };
    $scope.fetch_clinvar_summary(page)
}
