'use strict';

angular.module('miRNASNP3')
    .controller('MirSummaryController', MirSummaryController);

function MirSummaryController($scope,$routeParams,$http,$filter,miRNASNP3Service) {
    console.log("MirSummaryController loaded");
    $("[data-toggle='popover']").popover();

    $(".input-xs:text").each(function () {
        jQuery(this).change(function () {
          jQuery(this).val(jQuery.trim(jQuery(this).val()));
        })
      })

    var selectedchr="All";
    var page=1;
    var ip_address='/api/mirna_summary';
    var base_url = miRNASNP3Service.getAPIBaseUrl();
    //$('#query_mirna_summary').val("hsa-let-7a-3p");
    $scope.initial=1;
    
    $scope.fetch_mirna_summary=function(){
        var flag_mirna=0;
        var condition={}
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
        if (/[@#\$%\^&\*<>\.]+/g.test(mirna_id)) {
            alert("Invalid input");
            flag_mirna = 1;
            history.back();
        }
        if(flag_mirna==0){
            condition['mirna_id']=mirna_id
        console.log(mirna_id);
        $http({
            url:base_url+ip_address,
            //url:'api/mirna_summary',
            method:'GET',
            params:condition,
        }).then(
            function(response){
                console.log(response);
                $scope.initial=0;
                $scope.mirna_summary_list=response.data.mirna_summary_list;
                $scope.mirna_summary_count=response.data.mirna_summary_count;
                var data_list=$scope.mirna_summary_list
                for(var i=0;i<data_list.length;i++){
                    //console.log(data_list[i])
                    data_list[i].mutation_sum= Number(data_list[i].cosmic_in_matue)+Number(data_list[i].clinvar_in_matue)
                    //console.log(data_list[i]['cosmic_in_mature'])
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
        if (/[@#\$%\^&\*<>\.]+/g.test(mirna_id)) {
            alert("Invalid input");
            flag_mirna = 1;
            history.back();
        }
        if(flag_mirna==0){
            condition['mirna_id']=mirna_id
        console.log(mirna_id);
        $http({
            url:base_url+ip_address,
            //url:'api/mirna_summary',
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
                    data_list[i].mutation_sum= Number(data_list[i].cosmic_in_matue)+Number(data_list[i].clinvar_in_matue)
                    //console.log(data_list[i]['cosmic_in_mature'])
                }
            }
        )
    };
}
}

angular.module('miRNASNP3')
    .controller('PrimirSummaryController',PrimirSummaryController);

function PrimirSummaryController($scope,$routeParams,$http,$filter,miRNASNP3Service) {
    console.log("PrimirSummaryController loaded");
    $("[data-toggle='popover']").popover();
   
    $(".input-xs:text").each(function () {
        jQuery(this).change(function () {
          jQuery(this).val(jQuery.trim(jQuery(this).val()));
        })
      })
    $scope.initial=1;
    var condition={}
    var page=1;
    var ip_address='/api/primir_summary';
    var base_url = miRNASNP3Service.getAPIBaseUrl();

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
        if (/[@#\$%\^&\*<>\.]+/g.test(mirna_id)) {
            alert("Invalid input");
            flag_pri = 1;
            history.back();
        }
        if(flag_pri==0){
            condition['pre_id']=mirna_id
        $http({
            url:base_url+ip_address,
            //url:'/api/primir_summary',
            method:'GET',
            params:condition,
        }).then(
            function(response){
                console.log(response);
                $scope.initial=0;
                $scope.primir_summary_list=response.data.primir_summary_list;
                $scope.primir_summary_count=response.data.primir_summary_count[0].count;
                var data_list=$scope.primir_summary_list
                for(var i=0;i<data_list.length;i++){
                    //console.log(data_list[i])
                    data_list[i].mutation_sum= Number(data_list[i]._id.cosmic_in_pri)+Number(data_list[i]._id.clinvar_in_pri)
                    //console.log(data_list[i]['cosmic_in_mature'])
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
        if (/[@#\$%\^&\*<>\.]+/g.test(mirna_id)) {
            alert("Invalid input");
            flag_pri = 1;
            history.back();
        }
        if(flag_pri==0){
            condition['pre_id']=mirna_id
        $http({
            url:base_url+ip_address,
            //url:'/api/primir_summary',
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
                    data_list[i].mutation_sum= Number(data_list[i]._id.cosmic_in_pri)+Number(data_list[i]._id.clinvar_in_pri)
                    //console.log(data_list[i]['cosmic_in_mature'])
                }
            }
        )
    };
    }
}
