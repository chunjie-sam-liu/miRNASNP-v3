'use strict';

angular.module('miRNASNP3')
    .controller('BrowserController', BrowserController);

function BrowserController($scope,$http,$filter) {
    console.log("BrowserController loaded");
    $(document).ready(function () {
        $('.selectpicker').selectpicker();
    });

    //$scope.browse_mir = function () {
        $http({
            url: '/api/browsemir',
            method: 'GET',
            //params: {chr: $scope.chr, vtype: $scope.vtype, loc_region: $scope.loc_region}
            params:{chr:'chrY'}

        }).then(
            function (response) {
                console.log(response);
                $scope.browse_list_array = response.data.browse_list;
                $scope.pagenum = 5
                var showData = $scope.browse__list_array;
                $scope.$watch('search_ids', function (n, o) {
                    if (n == '') {
                        showData = $scope.browse_list_array;
                    } else {
                        showData = $filter('filter')($scope.browse_list_array, n);
                    }
                    $scope.getPages(1);
                });

                $scope.$watch('pagenum', function (n, o) {
                    $scope.getPages(1);
                });

                $scope.getPages = function (page) {
                    var size = showData.length;
                    console.log($scope.browse_list_array);
                    $scope.totalPages = size % $scope.pagenum == 0 ? (size / $scope.pagenum) : Math.ceil(size / $scope.pagenum);
                    var firspage = 0, endpage = 0;
                    if (page < 5) {
                        console.log('第一项');
                        firspage = 1;
                        endpage = 5 > $scope.totalPages ? $scope.totalPages : 5;
                    } else {
                        var index = $scope.totalPages - page;
                        if (index < (4)) {
                            console.log('第二项');
                            firspage = $scope.totalPages - 4;
                            endpage = $scope.totalPages;
                        } else {
                            console.log('第三项');
                            firspage = page - 2;
                            endpage = page + 2;
                        }
                    }
                    $scope.pages = getPages(0, firspage, endpage, 5);
                    $scope.page = page;
                    var indexS = ($scope.page - 1) * $scope.pagenum;
                    var indexE = parseInt(indexS) + parseInt($scope.pagenum);
                    var indexEnd = indexE > showData.length ? showData.length : indexE;
                    var tableD = []
                    for (var s = indexS; s < indexEnd; s++) {
                        tableD.push(showData[s]);
                    }
                    $scope.data = tableD;
                }
                $scope.getPages(1);
            });
   // }
}
