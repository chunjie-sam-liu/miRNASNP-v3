"use strict";

angular.module('miRNASNP3')
    .controller('SnpSummaryController',SnpSummaryController);

function SnpSummaryController($scope,$routeParams,$http,$filter) {
    console.log('SnpSummaryController loaded');
    $("[data-toggle='popover']").popover();
    $(document).ready(function () {
        $('.selectpicker').selectpicker();
    });
    var page = 1;
    var condition = {};
    condition['chrome']='All';
    condition['location']='All';
    condition['gmaf']='All';
    $scope.fetch_snp_summary=function(page){
        condition['page']=page;
        condition['ldsnp']='';
        condition['mutation_rela']='';
        $('#chr').val('All');
        $('#chr').change(function () {
            condition['chrome'] = $('#chr').val();
    });

          $('#location').val('All');
          $('#location').change(function(){
            condition['location']=$('#location').val();
        });

          $('#gmaf').val('All');
          $('#gmaf').change(function(){
            condition['gmaf']=$('#gmaf').val();
        });

        condition['snp_id'] = $('#query_snp_summary').val();
        condition['identifier']=$('#query_iden_summary').val();

        if ($("#ldsnp").is(":checked")){
            condition["ldsnp"]=1
        }

        if ($("#mutation_rela").is(":checked")){
            condition['mutation_rela']=1
        }

        $http({
            url:'/api/snp_summary',
            method:'Get',
            params:condition,
        }).then(function(response){
            console.log(response);
            $scope.snp_summary_list=response.data.snp_summary_list;
            $scope.snp_summary_count=response.data.snp_summary_count;
        })
    };
    $scope.fetch_snp_summary(page);
}