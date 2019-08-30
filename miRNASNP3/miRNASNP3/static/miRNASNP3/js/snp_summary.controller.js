"use strict";

angular.module('miRNASNP3')
    .controller('SnpSummaryController',SnpSummaryController);

function SnpSummaryController($scope,$routeParams,$http,$filter,miRNASNP3Service) {
    console.log('SnpSummaryController loaded');
    $("[data-toggle='popover']").popover();
    $(document).ready(function () {
        $('.selectpicker').selectpicker();
    });
    var page = 1;
    var condition = {};
    var ip_address='/api/snp_summary';
    var base_url = miRNASNP3Service.getAPIBaseUrl();

    $scope.reset_query=function(){
        condition['chrome']='All';
        $("#chr").selectpicker('val','All');
        condition['location']='All';
        $("#location").selectpicker('val','All');
        condition['gmaf']='All';
        $("#gmaf").selectpicker('val','All');
        condition['page']=page;
        condition['ldsnp']='';
        condition['mutation_rela']='';
        condition['snp_id'] ='';
        $('#query_snp_summary').val('');
        condition['identifier']='';
        $('#query_iden_summary').val('');
        $http({
            //url:base_url+ip_address,
            url:'/api/snp_summary',
            method:'GET',
            params:condition,
        }).then(function(response){
            console.log(response);
            $scope.snp_summary_list=response.data.snp_summary_list;
            $scope.snp_summary_count=response.data.snp_summary_count;
            var data_list=$scope.snp_summary_list
            for(var i=0;i<data_list.length;i++){
                //console.log(data_list[i].ref_freq)
                if(data_list[i].ref_freq=='novalue'){data_list[i].ref_freq=0}
                //console.log(data_list[i].ref_freq)
                if(!Number(data_list[i].alt_freq)){data_list[i].alt_freq=0}
            }
            $scope.snp_summary_list=data_list
        })
    };
    $scope.reset_query()

    $scope.fetch_snp_summary=function(page){
        condition['page']=page;
        console.log(page)
       // condition['ldsnp']='';
       // condition['mutation_rela']='';
        //$('#chr').val('All');
        //$('#chr').change(function () {
            condition['chrome'] = $('#chr').val();
    //});

          //$('#location').val('All');
          $('#location').change(function(){
            condition['location']=$('#location').val();
        });

          //$('#gmaf').val('All');
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
            //url:base_url+ip_address,
            url:'/api/snp_summary',
            method:'GET',
            params:condition,
        }).then(function(response){
            console.log(response);
            $scope.snp_summary_list=response.data.snp_summary_list;
            $scope.snp_summary_count=response.data.snp_summary_count;
            var data_list=$scope.snp_summary_list
            for(var i=0;i<data_list.length;i++){
                if(data_list[i].ref_freq=='novalue'){data_list[i].ref_freq=0}
                if(Number(data_list[i].alt_freq)==0.0){data_list[i].alt_freq=0}
            }
            $scope.snp_summary_list=data_list
        })
    };
    //$scope.fetch_snp_summary(page);
}