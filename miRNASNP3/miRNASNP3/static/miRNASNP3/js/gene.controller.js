'use strict';

angular.module('miRNASNP3')
    .controller('GeneController', GeneController);

function GeneController($scope,$routeParams,$http,$filter,$document,miRNASNP3Service) {
    console.log("GeneController loaded");
    
    $scope.initial = 1;
    var page=1;
    var base_url = miRNASNP3Service.getAPIBaseUrl();
    $scope.gene_search_count=0;

    $("[data-toggle='popover']").popover();
    $scope.query_gene = $routeParams.query_gene;
    console.log($routeParams.query_gene);
    $http({
        url:'/api/snp_summary',
        method:'GET',
        params:{gene:$scope.query_gene}
    }).then(function(response){
        $scope.snp_summary_list=response.data.snp_summary_list;
        $scope.snp_summary_count=response.data.snp_summary_count;
    })
    $http({
        url:'/api/mutation_summary',
        method:'GET',
        params:{gene:$scope.query_gene,target_effection:1}
    }).then(function(response){
        $scope.mutation_summary_list=response.data.mutation_summary_list;
        $scope.mutation_summary_count=response.data.mutation_summary_count[0].count;
    })
    /*$http({
        url:'/api/snp_seed_gain',
        method:'GET',
        params:{gene:$scope.query_gene}
    }).then(function(response){
        $scope.snp_seed_gain_list=response.data.snp_seed_gain_list;
        $scope.snp_seed_gain_count=response.data.snp_seed_gain_count;
    })
    $http({
        url:'/api/snp_seed_loss',
        method:'GET',
        params:{gene:$scope.query_gene}
    }).then(function(response){
        $scope.snp_seed_loss_list=response.data.snp_seed_loss_list
        $scope.snp_seed_loss_count=response.data.snp_seed_loss_count
    })
    */
    $scope.gene_search_count=$scope.snp_summary_count+$scope.mutation_summary_count
    $scope.initial=0;
    if($scope.gene_search_count==0){
        $scope.alert_nonitem=1;
        $('#alert_nonitem').show()
    }
    /*$scope.snp_in_gene=function(gene){
        alert("snp summary")
    }
    $scope.mutation_in_gene=function(gene){
        alert("mutation sumamry")
    }
    $scope.mir_gain_gene=function(gene){
        alert("mirna summary for target gain ")
    }
    $scope.mir_loss_gene=function(gene){
        alert("mirna summary for target loss")
    }*/
}