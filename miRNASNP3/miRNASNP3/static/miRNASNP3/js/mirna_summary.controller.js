'use strict';

angular.module('miRNASNP3')
    .controller('MirSummaryController', MirSummaryController);

function MirSummaryController($scope,$routeParams,$http,$filter) {
    console.log("MirSummaryController loaded");
    $("[data-toggle='popover']").popover();
    $(document).ready(function () {
        $('.selectpicker').selectpicker();
    });
    var selectedchr="All";
    var page=1;
    $scope.fetch_mirna_summary=function(page){

        $('#chr').val('All');
        $('#chr').change(function () {
            selectedchr = $('#chr').val();
    });

        var mirna_id = $('#query_mirna_summary').val();
        console.log(mirna_id);
        $http({
            url:'/api/mirna_summary',
            method:'Get',
            params:{page:page,chrome:selectedchr,mirna_id:mirna_id}
        }).then(
            function(response){
                console.log(response);
                $scope.mirna_summary_list=response.data.mirna_summary_list;
                $scope.mirna_summary_count=response.data.mirna_summary_count;
            }
        )
    };
    $scope.fetch_mirna_summary(page);
}

angular.module('miRNASNP3')
    .controller('PrimirSummaryController',PrimirSummaryController);

function PrimirSummaryController($scope,$routeParams,$http,$filter) {
    console.log("PrimirSummaryController loaded");
    $("[data-toggle='popover']").popover();
    $(document).ready(function () {
        $('.selectpicker').selectpicker();
    });
    var selectedchr="All";
    var page=1;
    $scope.fetch_primir_summary=function(page){
      //  $('.selectpicker').change(function () {
      //  var selectedchr = $('.selectpicker').val();
        //alert(selectedchr);
           // $scope.fetch_mirna_summary(page,selectedchr)
    //});
         $('#chr').val('All');
        $('#chr').change(function () {
            selectedchr = $('#chr').val();
    });
        var mirna_id = $('#query_mirna_summary').val();
        $http({
            url:'/api/primir_summary',
            method:'Get',
            params:{page:page,chrome:selectedchr,pre_id:mirna_id}
        }).then(
            function(response){
                console.log(response);
                $scope.primir_summary_list=response.data.primir_summary_list;
                $scope.primir_summary_count=response.data.primir_summary_count[0].count;
            }
        )
    };
    $scope.fetch_primir_summary(page);
}
