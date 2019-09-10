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
    console.log($routeParams.query_gene);

    $scope.check_result=function(gene_search_count){
        if(gene_search_count==0){
            console.log("noitem")
            $scope.alert_nonitem=1;
            $('#alert_nonitem').show()
        }else{
            console.log(gene_search_count)
        }
    }

    $scope.fetch_item=function(){
    $http({
        url:base_url+'/api/mutation_summary',
        //url:'/api/mutation_summary',
        method:'GET',
        params:{gene:$scope.query_gene,target_effection:1}
    }).then(function(response){
        $scope.initial=0;
        console.log(response)
        $scope.mutation_summary_list=response.data.mutation_summary_list;
        if(response.data.mutation_summary_count[0].count){
            $scope.mutation_summary_count=response.data.mutation_summary_count[0].count;
        }else{
            $scope.mutation_summary_count=0
        }
        gene_search_count+=$scope.mutation_summary_count
        console.log(gene_search_count)
    })
    $http({
        url:base_url+'/api/snp_summary',
        //url:'/api/snp_summary',
        method:'GET',
        params:{gene:$scope.query_gene}
    }).then(function(response){
        $scope.initial=0;
        console.log(response)
        $scope.snp_summary_list=response.data.snp_summary_list;
        $scope.snp_summary_count=response.data.snp_summary_count;
        gene_search_count+=$scope.snp_summary_count
        console.log(gene_search_count)
        $scope.check_result(gene_search_count)
    })
    }
    $scope.fetch_item()
    
}