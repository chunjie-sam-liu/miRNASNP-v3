'use strict';

angular.module('miRNASNP3')
    .controller('MirController', MirController);

function MirController($scope,$rootScope,$http,$filter) {
    console.log("MirController loaded");
    $http({
        url:'/api/mir',
        method:'GET',
    }).then(function (response){
        console.log(response);
        $scope.mir_summary_list = response.data.mir_summary_list;
        var showData = $scope.mir_summary_list;
				$scope.$watch('pagenum',function(n,o){
					$scope.getPages(1);
				});

				$scope.getPages = function(page){
					var size = showData.length;
					console.log($scope.mir_summary_list);
					$scope.totalPages = size%$scope.pagenum==0?(size/$scope.pagenum):Math.ceil(size/$scope.pagenum);
					var firspage=0,endpage=0;
					if(page<5){
						console.log('第一项');
						firspage = 1;
						endpage = 5>$scope.totalPages?$scope.totalPages:5;
					}else{
						var index = $scope.totalPages-page;
						if(index<(4)){
							console.log('第二项');
							firspage = $scope.totalPages-4;
							endpage = $scope.totalPages;
						}else{
							console.log('第三项');
							firspage = page-2;
							endpage = page+2;
						}
					}
					$scope.pages = getPages(0,firspage,endpage,5);
					$scope.page = page;
					var indexS = ($scope.page-1)*$scope.pagenum;
					var indexE = parseInt(indexS)+parseInt($scope.pagenum);
					var indexEnd = indexE>showData.length?showData.length:indexE;
					var tableD = [];
					for(var s=indexS;s<indexEnd;s++){
						tableD.push(showData[s]);
					}
					$scope.data_list = tableD;
				};
				$scope.getPages(1);
            });
}