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
        url:'/api/mutation_summary',
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
        url:'/api/snp_summary',
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