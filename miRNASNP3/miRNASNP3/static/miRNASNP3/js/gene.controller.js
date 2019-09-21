'use strict';

angular.module('miRNASNP3')
    .controller('GeneController', GeneController);

function GeneController($scope,$routeParams,$http,$filter,$document,miRNASNP3Service) {
    console.log("GeneController loaded");
    
    $scope.initial = 1;
    var page=1;
    var base_url = miRNASNP3Service.getAPIBaseUrl();
    var gene_search_count=0;

    $("[data-toggle='popover']").popover();
    $scope.query_gene = $routeParams.query_gene;
    var has_snp=$routeParams.has_snp
    var has_phenotype=$routeParams.has_phenotype
    console.log($routeParams.query_gene);


    if(has_phenotype){
    $http({
       url:base_url+'/api/mutation_summary_utr3',
        //url:'/api/mutation_summary',
        method:'GET',
        params:{gene:$scope.query_gene}
    }).then(function(response){
        $scope.initial=0;
        console.log(response)
        $scope.mutation_utr3_list=response.data.mutation_utr3_list;
        $scope.mutation_utr3_count=response.data.mutation_utr3_count[0].count
    })
}
if(has_snp){
    $http({
       url:base_url+'/api/snp_summary_utr3',
        //url:'/api/snp_summary',
        method:'GET',
        params:{gene:$scope.query_gene}
    }).then(function(response){
        $scope.initial=0;
        console.log(response)
        $scope.snp_utr3_list=response.data.snp_utr3_list;
        $scope.snp_utr3_count=response.data.snp_utr3_count;
    })
    }
    
}