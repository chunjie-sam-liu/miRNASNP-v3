"use strict";

/*angular.module('miRNASNP3')
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
}*/

angular.module('miRNASNP3')
    .controller('MutationSummaryController',MutationSummaryController);

function MutationSummaryController($scope,$routeParams,$http,$filter) {
    console.log('MutationSummaryController loaded');
    $("[data-toggle='popover']").popover();
    $(document).ready(function () {
        $('.selectpicker').selectpicker();
    });
    var page=1;
    var condition={};
    condition['chrome']='All';
    condition['location']='All';
    condition['resource']='All';
    $scope.fetch_mutation_summary=function(page){

        condition['page']=page;
        condition["snp_rela"]='';
        condition['pubmed_id']='';

        $('#chr').val('All');

        $('#location').val('All');

        $('#resource').val('All');


        $('#chr').change(function () {
            condition['chrome'] = $('#chr').val();
    });
        $('#location').change(function(){
            condition['location']=$('#location').val();
        });
        $('#resource').change(function(){
            condition['resource']=$('#resource').val()
        });
        condition['mut_id'] = $('#query_mutation_summary').val();

        if ($("#snp_rela").is(":checked")){
            condition["snp_rela"]=1
        }
        if ($("#is_pubmed").is(":checked")){
            condition['pubmed_id']=1
        }

        $http({
            url:'/api/mutation_summary',
            method:'Get',
            params:condition,
        }).then(function (response) {
            console.log(response);
            $scope.mutation_summary_list=response.data.mutation_summary_list;
            $scope.mutation_summary_count=response.data.mutation_summary_count;
        })
    };
    $scope.fetch_mutation_summary(page)
}
