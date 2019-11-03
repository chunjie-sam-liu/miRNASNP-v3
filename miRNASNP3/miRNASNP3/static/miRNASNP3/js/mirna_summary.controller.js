'use strict';

angular.module('miRNASNP3')
    .controller('MirSummaryController', MirSummaryController);

function MirSummaryController($scope,$route,$http,$filter,miRNASNP3Service) {
    console.log("MirSummaryController loaded");
    $("[data-toggle='popover']").popover();

    $(".input-xs:text").each(function () {
        jQuery(this).change(function () {
          jQuery(this).val(jQuery.trim(jQuery(this).val()));
        })
      })

    var selectedchr="All";
    var page=1;
    var base_url = miRNASNP3Service.getAPIBaseUrl();
    //$('#query_mirna_summary').val("hsa-let-7a-3p");
    $scope.initial=1;
    $scope.close_invalid=function(){
        $scope.alert_invalid=0;
        $scope.alert_nonitem=0;
    }
    $scope.fetch_mirna_summary=function(){
        var flag_mirna=0;
        var condition={}
        $scope.alert_nonitem=0;
        $scope.alert_invalid=0;
        $scope.mirna_summary_count=0
        condition['chrome']='All';
        condition['mirna_id']='';
        var selectedchr = $('#chr option:selected').text();

        console.log(page)

        if(selectedchr!='All'){
            condition['chrome']=selectedchr
      }
        condition['page']=1
    //});
        
        var mirna_id = $.trim($('#query_mirna_summary').val());
        if (/[@#\$%\^&\*<>\.\\\/\(\)]+/g.test(mirna_id)) {
            flag_mirna = 1;
            $scope.alert_invalid=1;
            $('#alert_invalid').show()
        }
        if(flag_mirna==0){
            condition['mirna_id']=mirna_id.replace(/r/g,"R")
        console.log(mirna_id);
        $http({
            url:base_url+'/api/mirna_summary',
            //url:base_url++base_url+'api/mirna_summary',
            method:'GET',
            params:condition,
        }).then(
            function(response){
                console.log(response);
                $scope.initial=0;
                $scope.mirna_summary_list=response.data.mirna_summary_list;
                $scope.mirna_summary_count=response.data.mirna_summary_count;
                if($scope.mirna_summary_count==0){
                    $scope.alert_nonitem=1;
                    $('#alert_nonitem').show()
                }else{
                var data_list=$scope.mirna_summary_list
                for(var i=0;i<data_list.length;i++){
                    //console.log(data_list[i])
                    data_list[i].mutation_seed_sum= Number(data_list[i].cosmic_in_seed_singlepre)+Number(data_list[i].clinvar_in_seed_singlepre)+Number(data_list[i].snp_gwas_in_seed_singlepre)
                    data_list[i].mutation_mature_sum=Number(data_list[i].cosmic_in_mature_singlepre)+Number(data_list[i].clinvar_in_mature_singlepre)+Number(data_list[i].snp_gwas_in_mature_singlepre)
                    //console.log(data_list[i]['cosmic_in_mature'])
                }
            }
            }
        )
    };
}
    $scope.fetch_mirna_summary();
    $scope.update_page=function(page){
        var flag_mirna=0;
        var condition={}
        condition['chrome']='All';
        condition['mirna_id']='';
        var selectedchr = $('#chr option:selected').text();

        console.log(page)

        if(selectedchr!='All'){
            condition['chrome']=selectedchr
      }
        condition['page']=page
    //});
        
        var mirna_id = $.trim($('#query_mirna_summary').val());
        if (/[@#\$%\^&\*<>\.\\\/\(\)]+/g.test(mirna_id)) {
            flag_mirna = 1;
            $scope.alert_invalid=1;
            $('#alert_invalid').show()
        }
        if(flag_mirna==0){
            condition['mirna_id']=mirna_id.replace(/R/g,"r")
        console.log(mirna_id);
        $http({
            url:base_url+'/api/mirna_summary',
            //url:base_url++base_url+'api/mirna_summary',
            method:'GET',
            params:condition,
        }).then(
            function(response){
                console.log(response);
                $scope.initial=0;
                $scope.mirna_summary_list=response.data.mirna_summary_list;
                //$scope.mirna_summary_count=response.data.mirna_summary_count;
                var data_list=$scope.mirna_summary_list
                for(var i=0;i<data_list.length;i++){
                    //console.log(data_list[i])
                    data_list[i].mutation_seed_sum= Number(data_list[i].cosmic_in_seed_singlepre)+Number(data_list[i].clinvar_in_seed_singlepre)+Number(data_list[i].snp_gwas_in_seed_singlepre)
                    data_list[i].mutation_mature_sum=Number(data_list[i].cosmic_in_mature_singlepre)+Number(data_list[i].clinvar_in_mature_singlepre)+Number(data_list[i].snp_gwas_in_mature_singlepre)
                    //console.log(data_list[i]['cosmic_in_mature'])
                }
            }
        )
    };
}
    $scope.reset_query=function(){
        //window.open('#!/mirna_summary','_self')
        $route.reload('#!/mirna_summary');
    }
}

angular.module('miRNASNP3')
    .controller('PrimirSummaryController',PrimirSummaryController);

function PrimirSummaryController($scope,$route,$http,$filter,miRNASNP3Service) {
    console.log("PrimirSummaryController loaded");
    $("[data-toggle='popover']").popover();
   
    $(".input-xs:text").each(function () {
        jQuery(this).change(function () {
          jQuery(this).val(jQuery.trim(jQuery(this).val()));
        })
      })
    $scope.initial=1;
    $scope.alert_nonitem=0;
    $scope.alert_invalid=0;
    var condition={}
    var page=1;
    var ip_address='/api/primir_summary';
    var base_url = miRNASNP3Service.getAPIBaseUrl();

    $scope.close_invalid=function(){
        $scope.alert_invalid=0;
        $scope.alert_nonitem=0;
    }
    $scope.fetch_primir_summary=function(){
        var condition={}
        var flag_pri=0;
        $scope.primir_summary_count=0;
        condition['chrome']='All';
        condition['page']=1;
        condition['pre_id']='';
        var chr = $("#chr option:selected").text();
        if (chr!="All"){
            condition["chrome"]=chr
        }
    //});
        var mirna_id = $.trim($('#query_mirna_summary').val());
        if (/[@#\$%\^&\*<>\.\\\/\(\)]+/g.test(mirna_id)) {
            flag_pri = 1;
            $scope.alert_invalid=1;
            $('#alert_invalid').show()
        }
        if(flag_pri==0){
            condition['pre_id']=mirna_id
        $http({
            url:base_url+ip_address,
            //url:base_url+'/api/primir_summary',
            method:'GET',
            params:condition,
        }).then(
            function(response){
                console.log(response);
                $scope.initial=0;
                $scope.primir_summary_list=response.data.primir_summary_list;
                if(response.data.primir_summary_count.length==0){
                    $scope.alert_nonitem=1;
                    $('#alert_nonitem').show()
                }else{
                $scope.primir_summary_count=response.data.primir_summary_count[0].count;
                var data_list=$scope.primir_summary_list
                for(var i=0;i<data_list.length;i++){
                    //console.log(data_list[i])
                    data_list[i].mutation_sum= Number(data_list[i]._id.cosmic_in_pri)+Number(data_list[i]._id.clinvar_in_pri)+Number(data_list[i]._id.snp_gwas_in_pre)
                    //console.log(data_list[i]['cosmic_in_mature'])
                }
            }
            }
        )
    };
}
    $scope.fetch_primir_summary();

    $scope.update_page=function(page){
        var condition={}
        var flag_pri=0;
        condition['chrome']='All';
        condition['page']=page;
        condition['pre_id']='';
        var chr = $("#chr option:selected").text();
        if (chr!="All"){
            condition["chrome"]=chr
        }
    //});
        var mirna_id = $.trim($('#query_mirna_summary').val());
        if (/[@#\$%\^&\*<>\.\\\/\(\)]+/g.test(mirna_id)) {
            flag_pri = 1;
            $scope.alert_invalid=1;
            $('#alert_invalid').show()
        }
        if(flag_pri==0){
            condition['pre_id']=mirna_id
        $http({
            url:base_url+'/api/primir_summary',
            //url:base_url+'/api/primir_summary',
            method:'GET',
            params:condition,
        }).then(
            function(response){
                console.log(response);
                $scope.initial=0;
                $scope.primir_summary_list=response.data.primir_summary_list;
               // $scope.primir_summary_count=response.data.primir_summary_count[0].count;
                var data_list=$scope.primir_summary_list
                for(var i=0;i<data_list.length;i++){
                    //console.log(data_list[i])
                    data_list[i].mutation_sum= Number(data_list[i]._id.cosmic_in_pri)+Number(data_list[i]._id.clinvar_in_pri)+Number(data_list[i]._id.snp_gwas_in_pre)
                    //console.log(data_list[i]['cosmic_in_mature'])
                }
            }
        )
    };
    }
    $scope.reset_query=function(){
        //window.open('#!/mirna_summary','_self')
        $route.reload('#!/primir_summary');
    }
}
