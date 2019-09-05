"use strict";

angular.module('miRNASNP3')
    .controller('SnpSummaryController',SnpSummaryController);

function SnpSummaryController($scope,$routeParams,$http,$filter,miRNASNP3Service) {
    console.log('SnpSummaryController loaded');
    $("[data-toggle='popover']").popover();
    $(".input-xs:text").each(function () {
        jQuery(this).change(function () {
          jQuery(this).val(jQuery.trim(jQuery(this).val()));
        })
      })

    var condition = {};
    var ip_address='/api/snp_summary';
    var base_url = miRNASNP3Service.getAPIBaseUrl();
    $scope.initial=1;
    var page=1;
    var gene=$routeParams.gene
    console.log('gene')
   
    $scope.fetch_snp_summary=function(page){
        var flag_snp=0;
        var flag_identifier=0;
        condition['chrome']='All';
        condition['location']='All';
        condition['gmaf']='All';
        condition['ldsnp']='';
        condition['mutation_rela']='';
        condition['page']=page;
        console.log(page)
        console.log($scope.initial)
        console.log($scope.snp_summary_count)
        $scope.snp_summary_count=0;
        if(gene){
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
        var gmaf=$("#gmaf option:selected").text();
        if(gmaf!="All"){
            condition['gmaf']=gmaf
        }
        
        
        var query_snp_summery = $('#query_snp_summary').val();
        if (/[@#\$%\^&\*<>\.]+/g.test(query_snp_summary)) {
            alert("Invalid input");
            flag_snp = 1;
            history.back();
        }
        if(flag_snp==0){
            condition['snp_id'] =query_snp_summery
        }
        var query_iden_summary=$('#query_iden_summary').val();
        if (/[@#\$%\^&\*<>\.]+/g.test(query_iden_summary)) {
            alert("Invalid input");
            flag_snp = 1;
            history.back();
        }
        if(flag_identifier==0){
            condition['identifier']=query_iden_summary
        }
        

        if ($("#ldsnp").is(":checked")){
            condition["ldsnp"]=1
        }

        if ($("#mutation_rela").is(":checked")){
            condition['mutation_rela']=1
        }
        if(flag_snp==0 && flag_identifier==0){
            $http({
                //url:base_url+ip_address,
                url:'/api/snp_summary',
                method:'GET',
                params:condition,
            }).then(function(response){
                console.log(response);
                $scope.initail=0;
                $scope.snp_summary_list=response.data.snp_summary_list;
                $scope.snp_summary_count=response.data.snp_summary_count;
                var data_list=$scope.snp_summary_list
                for(var i=0;i<data_list.length;i++){
                    data_list[i].identi_gene=0
                    if(data_list[i].ref_freq=='novalue'){data_list[i].ref_freq=0}
                    if(Number(data_list[i].alt_freq)==0.0){data_list[i].alt_freq=0}
                    if(data_list[i].location=='UTR3'){data_list[i].location="3'UTR";data_list[i].identi_gene=1}
                }
                $scope.snp_summary_list=data_list
            })
        }
    };
    $scope.fetch_snp_summary(page);
}