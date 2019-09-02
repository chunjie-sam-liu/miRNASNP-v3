"use strict";

angular.module('miRNASNP3')
    .controller('MutationSummaryController',MutationSummaryController);

function MutationSummaryController($scope,$routeParams,$http,$filter,miRNASNP3Service) {
    console.log('MutationSummaryController loaded');
    $("[data-toggle='popover']").popover();
    $(document).ready(function () {
        $('.selectpicker').selectpicker();
    });
    var page=1;
    var condition={};
    var base_url = miRNASNP3Service.getAPIBaseUrl();
    var gene=$routeParams.gene
    $scope.target_effection=$routeParams.target_effection
    $scope.initial=1;

    $scope.fetch_mutation_summary=function(page){

        $scope.mutation_summary_count=0;
        $scope.target_effection=0;
        $scope.total_summary=1;
        condition['chrome']='All';
        condition['location']='All';
        condition['resource']='All';
        condition["snp_rela"]='';
        condition['pubmed_id']='';
        condition['page']=page

        $scope.target_effection=$routeParams.target_effection

        if (gene){
            condition['gene']=gene
        }
        var chr = $("#chr option:selected").text();
        if (chr!="All"){
            condition["chrome"]=chr
        }
        var location=$("#location option:selected").val();
        if(location!="All"){
            condition['location']=location
        }
        var resource=$("#resource option:selected").text();
        if(resource!="All"){
            condition['resource']=resource
        }
    
        
        $('#histology').change(function(){
           console.log("change histology")
            condition['histology']=$('#histology').selectpicker('val')
        });
        $('#pathology').change(function(){
        condition['pathology']=$('#pathology').selectpicker('val')
        })
    
        if ($("#snp_rela").is(":checked")){
            condition["snp_rela"]=1
        }
        if ($("#is_pubmed").is(":checked")){
            condition['pubmed_id']=1
        }
        if ($("#target_effection").is(":checked")||$scope.target_effection==1){
            $scope.target_effection=1;
            $scope.total_summary=0;
        }

        condition['target_effection']=$scope.target_effection;
        console.log(condition)
        $http({
            //url:base_url+'/api/mutation_summary',
            url:'/api/mutation_summary',
            method:'GET',
            params:condition,
        }).then(function (response) {
            console.log(response);
            $scope.initial=0;
            $scope.mutation_summary_list=response.data.mutation_summary_list;
            $scope.mutation_summary_count=response.data.mutation_summary_count[0].count;
            var data_list=$scope.mutation_summary_list
            for(var i=0;i<data_list.length;i++){
                data_list[i].pathology_show=data_list[i].pathology.replace(/,/g,"; ").replace(/_and/g," ").replace(/_/g," ").replace(/\|/g,"; ")
            }
        })
    };
    $scope.fetch_mutation_summary(page)

    $scope.reset=function(){
        $('#histology').selectpicker('val','All')
        $('#pathology').selectpicker('val','All')
        condition['histology']='All'
        condition['pathology']='All'
    }
}
