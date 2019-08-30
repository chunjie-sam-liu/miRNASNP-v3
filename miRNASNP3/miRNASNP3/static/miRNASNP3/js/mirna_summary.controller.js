'use strict';

angular.module('miRNASNP3')
    .controller('MirSummaryController', MirSummaryController);

function MirSummaryController($scope,$routeParams,$http,$filter,miRNASNP3Service) {
    console.log("MirSummaryController loaded");
    $("[data-toggle='popover']").popover();
    $(document).ready(function () {
        $('.selectpicker').selectpicker();
    });
    var selectedchr="All";
    var page=1;
    var ip_address='/api/mirna_summary';
    var base_url = miRNASNP3Service.getAPIBaseUrl();

    $scope.reset_query=function(){
        console.log("reset");
       // $('#chr').val('All')
       // $('#chr').attr("value",'All');
        $("#chr").selectpicker('val','All');
        $('#query_mirna_summary').val('');
        page=1;
        selectedchr = $('#chr').val();
    //});
        console.log("selectedchr:"+selectedchr)
        var mirna_id = $('#query_mirna_summary').val();
        console.log(mirna_id);
        $http({
            url:base_url+ip_address,
            //url:'/api/mirna_summary',
            method:'GET',
            params:{page:page,chrome:selectedchr,mirna_id:mirna_id}
        }).then(
            function(response){
                console.log(response);
                $scope.mirna_summary_list=response.data.mirna_summary_list;
                $scope.mirna_summary_count=response.data.mirna_summary_count;
            }
        )
    }
    $scope.reset_query()

    $scope.fetch_mirna_summary=function(page){
        console.log($('#chr').val())
       //$('#chr').val('All');
        //$('#chr').change(function () {
       selectedchr = $('#chr').val();
    //});
        console.log("selectedchr:"+selectedchr)
        var mirna_id = $('#query_mirna_summary').val();
        console.log(mirna_id);
        $http({
            url:base_url+ip_address,
            //url:'api/mirna_summary',
            method:'GET',
            params:{page:page,chrome:selectedchr,mirna_id:mirna_id}
        }).then(
            function(response){
                console.log(response);
                $scope.mirna_summary_list=response.data.mirna_summary_list;
                $scope.mirna_summary_count=response.data.mirna_summary_count;
            }
        )
    };
    //$scope.fetch_mirna_summary(page);
}

angular.module('miRNASNP3')
    .controller('PrimirSummaryController',PrimirSummaryController);

function PrimirSummaryController($scope,$routeParams,$http,$filter,miRNASNP3Service) {
    console.log("PrimirSummaryController loaded");
    $("[data-toggle='popover']").popover();
    $(document).ready(function () {
        $('.selectpicker').selectpicker();
    });
    var selectedchr="All";
    var page=1;
    var ip_address='/api/primir_summary';
    var base_url = miRNASNP3Service.getAPIBaseUrl();

    $scope.reset_query=function(){
        console.log("reset");
       // $('#chr').val('All')
       // $('#chr').attr("value",'All');
        $("#chr").selectpicker('val','All');
        $('#query_mirna_summary').val('');
        page=1;
        selectedchr = $('#chr').val();
    //});
        console.log("selectedchr:"+selectedchr)
        var mirna_id = $('#query_mirna_summary').val();
        console.log(mirna_id);
        $http({
            url:base_url+ip_address,
            //url:'/api/primir_summary',
            method:'GET',
            params:{page:page,chrome:selectedchr,pre_id:mirna_id}
        }).then(
            function(response){
                console.log(response);
                $scope.primir_summary_list=response.data.primir_summary_list;
                $scope.primir_summary_count=response.data.primir_summary_count[0].count;
            }
        )
    };
    $scope.reset_query()


    $scope.fetch_primir_summary=function(page){
        condition['chrome']='All';
        var chr = $("#chr option:selected").text();
        if (chr!="All"){
            condition["chrome"]=chr
        }
    //});
        var mirna_id = $('#query_mirna_summary').val();
        $http({
            url:base_url+ip_address,
            //url:'/api/primir_summary',
            method:'GET',
            params:{page:page,chrome:selectedchr,pre_id:mirna_id}
        }).then(
            function(response){
                console.log(response);
                $scope.primir_summary_list=response.data.primir_summary_list;
                $scope.primir_summary_count=response.data.primir_summary_count[0].count;
            }
        )
    };
    //$scope.fetch_primir_summary(page);
}
