'use strict';

angular.module('miRNASNP3')
    .controller('TestController', TestController)
    .controller('Test2Controller', Test2Controller)
    .controller('Test3Controller', Test3Controller);

function TestController($scope, $window, $http) {
    console.log("TestController loaded");

    // $scope.lncrna_snp_list = [
    //     {start: 1, end: 10, chromosome: 'chr1', strand: '+', lnc: 'lncRNA1', snp: 'rs1'},
    //     {start: 1, end: 10, chromosome: 'chr1', strand: '+', lnc: 'lncRNA2', snp: 'rs2'},
    //     {start: 1, end: 10, chromosome: 'chr1', strand: '+', lnc: 'lncRNA3', snp: 'rs3'},
    //     {start: 1, end: 10, chromosome: 'chr1', strand: '+', lnc: 'lncRNA4', snp: 'rs4'},
    //     {start: 1, end: 10, chromosome: 'chr1', strand: '+', lnc: 'lncRNA5', snp: 'rs5'},
    //     {start: 1, end: 10, chromosome: 'chr1', strand: '+', lnc: 'lncRNA6', snp: 'rs6'},
    //     {start: 1, end: 10, chromosome: 'chr1', strand: '+', lnc: 'lncRNA7', snp: 'rs7'},
    // ];


    $scope.jump_to_test2 = function () {
        $window.open("#!/test2");
    };

    $scope.fetch_results = function () {
        $http({
            url: '/api/lncrna_snp_list',
            method: 'GET',
            params: {lncrna: $scope.q_lncrna}
        }).then(
            function (response) {
                console.log(response);
                $scope.lncrna_snp_list = response.data.lncrna_snp_list;
            }
        )
    };

    $scope.fetch_lncrna_snp_list = function () {
        $http({
            url: '/api/lncrna_snp_list',
            method: 'GET',
            params: {page: 1, per_page: 30}
        }).then(
            function (response) {
                console.log(response);
                $scope.lncrna_snp_list = response.data.lncrna_snp_list;
            }
        )
    };

    $scope.fetch_lncrna_snp_list();
}


function Test2Controller($scope, $http, $routeParams) {
    console.log("Test2Controller loaded");
    var params = $routeParams;
    console.log(params);
    $http({
        url: '',
        method: 'GET',
        params: {gene: parms.gene}
    }).then(
        function (response) {
            $scope.xxx = response.data.genes;
        }
    )
}

function Test3Controller($scope, $http) {
    console.log("Test3Controller loaded!");

    $scope.page = 1;
    $scope.per_page=30;
    $http({}).then(
        function (response) {
            $scope.num_records = response.data.num_lncrnas;
        }
    )

    $scope.update_page = function (a, page) {
        $http({
            url: '',
            method: 'GET',
            params: {page: page}
        }).then(
            function (response) {

            }
        );
    };
}